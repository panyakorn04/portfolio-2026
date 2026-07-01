"use client";

import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import {
  startTransition,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import type { PortfolioDictionary } from "../_data/portfolio";

type ChatCopy = PortfolioDictionary["chat"];

export type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  text: string;
};

type PortfolioAssistantStreamEvent = {
  type?:
    | "RUN_STARTED"
    | "TEXT_MESSAGE_START"
    | "TEXT_MESSAGE_CONTENT"
    | "TEXT_MESSAGE_END"
    | "RUN_FINISHED"
    | "RUN_ERROR";
  delta?: string;
  content?: string;
  message?: string;
};

const closeDurMs = 150;
const apiBaseUrl = (
  process.env.NEXT_PUBLIC_API_URL ?? "https://api.panyakorn.com"
).replace(/\/+$/, "");

function apiUrl(path: string) {
  if (
    typeof window !== "undefined" &&
    window.location.hostname.endsWith("panyakorn.com")
  ) {
    return path;
  }

  return `${apiBaseUrl}${path}`;
}

export function useChatDemo(copy: ChatCopy) {
  const [draft, setDraft] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const chatLogRef = useRef<HTMLDivElement | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const messagesRef = useRef<ChatMessage[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>(
    copy.starterConversation.map((message, index) => ({
      id: `starter-${index}`,
      role: message.role,
      text: message.text,
    })),
  );
  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const startClose = useCallback(() => {
    clearCloseTimer();
    setIsOpen(false);
    setIsClosing(true);
    closeTimerRef.current = setTimeout(() => {
      setIsClosing(false);
      closeTimerRef.current = null;
    }, closeDurMs);
  }, [clearCloseTimer]);

  const messageCount = messages.length;

  useLayoutEffect(() => {
    if (!isOpen || messageCount === 0) {
      return;
    }

    const animationFrame = window.requestAnimationFrame(() => {
      chatEndRef.current?.scrollIntoView({
        block: "end",
      });
    });

    return () => {
      window.cancelAnimationFrame(animationFrame);
    };
  }, [isOpen, messageCount]);

  useEffect(() => {
    const chatLog = chatLogRef.current;

    if (!chatLog || !isOpen) {
      return;
    }

    const resizeObserver = new ResizeObserver(() => {
      chatEndRef.current?.scrollIntoView({
        block: "end",
      });
    });

    resizeObserver.observe(chatLog);

    return () => {
      resizeObserver.disconnect();
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    textareaRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        startClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, startClose]);

  useEffect(() => {
    return () => {
      clearCloseTimer();
    };
  }, [clearCloseTimer]);

  function closeChat() {
    if (!isOpen && !isClosing) return;
    startClose();
  }

  function toggleChat() {
    if (isOpen) {
      startClose();
    } else {
      clearCloseTimer();
      setIsClosing(false);
      setIsOpen(true);
    }
  }

  function handleDraftChange(nextDraft: string) {
    setDraft(nextDraft);
  }

  function handleDraftKeyDown(event: ReactKeyboardEvent<HTMLTextAreaElement>) {
    if (event.key !== "Enter" || event.shiftKey) {
      return;
    }

    event.preventDefault();
    void submitPrompt(draft);
  }

  function updateAssistantMessage(messageId: string, updater: (text: string) => string) {
    startTransition(() => {
      setMessages((current) =>
        current.map((message) =>
          message.id === messageId
            ? { ...message, text: updater(message.text) }
            : message,
        ),
      );
    });
  }

  async function streamAssistantReply(
    nextMessages: ChatMessage[],
    assistantMessageId: string,
  ) {
    setIsWaiting(true);

    try {
      const response = await fetch(apiUrl("/api/portfolio/assistant/chat/stream"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          threadId: "portfolio-widget",
          runId: `run-${crypto.randomUUID()}`,
          messages: nextMessages
            .filter((message) => message.text.trim() !== "")
            .map((message) => ({
              role: message.role,
              content: message.text,
            }))
            .slice(-10),
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error(`Assistant stream failed (${response.status})`);
      }

      await readPortfolioAssistantStream(response.body, (event) => {
        if (event.type === "TEXT_MESSAGE_CONTENT") {
          const delta = event.delta ?? event.content ?? "";
          if (delta) {
            updateAssistantMessage(assistantMessageId, (text) => `${text}${delta}`);
          }
        }

        if (event.type === "RUN_ERROR") {
          throw new Error(event.message ?? "Assistant stream error");
        }
      });
    } catch {
      updateAssistantMessage(assistantMessageId, () => copy.streamError);
    } finally {
      setIsWaiting(false);
    }
  }

  async function submitPrompt(prompt: string) {
    const normalizedPrompt = prompt.trim();

    if (!normalizedPrompt || isWaiting) {
      return;
    }

    const userMessage: ChatMessage = {
      id: `user-${crypto.randomUUID()}`,
      role: "user",
      text: normalizedPrompt,
    };
    const assistantMessage: ChatMessage = {
      id: `assistant-${crypto.randomUUID()}`,
      role: "assistant",
      text: "",
    };
    const nextMessages = [...messagesRef.current, userMessage];

    startTransition(() => {
      setMessages([...nextMessages, assistantMessage]);
      setDraft("");
    });

    await streamAssistantReply(nextMessages, assistantMessage.id);
  }

  function handleSubmit() {
    void submitPrompt(draft);
  }

  return {
    chatEndRef,
    chatLogRef,
    closeChat,
    draft,
    handleDraftChange,
    handleDraftKeyDown,
    handleSubmit,
    isClosing,
    isOpen,
    isWaiting,
    messages,
    textareaRef,
    toggleChat,
  };
}

async function readPortfolioAssistantStream(
  body: ReadableStream<Uint8Array>,
  onEvent: (event: PortfolioAssistantStreamEvent) => void,
) {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }

    buffer += decoder.decode(value, { stream: true });
    const parts = buffer.split("\n\n");
    buffer = parts.pop() ?? "";

    for (const part of parts) {
      dispatchPortfolioAssistantStreamEvent(part, onEvent);
    }
  }

  buffer += decoder.decode();
  if (buffer.trim() !== "") {
    dispatchPortfolioAssistantStreamEvent(buffer, onEvent);
  }
}

function dispatchPortfolioAssistantStreamEvent(
  rawEvent: string,
  onEvent: (event: PortfolioAssistantStreamEvent) => void,
) {
  const data = rawEvent
    .split("\n")
    .filter((line) => line.startsWith("data:"))
    .map((line) => line.slice(5).trimStart())
    .join("\n");

  if (!data) {
    return;
  }

  onEvent(JSON.parse(data) as PortfolioAssistantStreamEvent);
}

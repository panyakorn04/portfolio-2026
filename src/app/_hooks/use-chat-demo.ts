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

type PortfolioAssistantResponse = {
  ok: boolean;
  data?: {
    message?: {
      role: "assistant" | "user" | "system";
      content: string;
    };
  };
  error?: {
    message?: string;
  };
};

const closeDurMs = 150;
const apiBaseUrl = (
  process.env.NEXT_PUBLIC_API_URL ?? "https://api.panyakorn.com"
).replace(/\/+$/, "");

function apiUrl(path: string) {
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

  async function queueAssistantReply(nextMessages: ChatMessage[]) {
    setIsWaiting(true);

    try {
      const response = await fetch(apiUrl("/api/portfolio/assistant/chat"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages
            .filter((message) => message.text.trim() !== "")
            .map((message) => ({
              role: message.role,
              content: message.text,
            }))
            .slice(-10),
        }),
      });

      const result = (await response.json()) as PortfolioAssistantResponse;
      if (!response.ok || !result.ok || !result.data?.message?.content) {
        throw new Error(
          result.error?.message ?? `Assistant request failed (${response.status})`,
        );
      }

      startTransition(() => {
        setMessages((current) => [
          ...current,
          {
            id: `assistant-${crypto.randomUUID()}`,
            role: "assistant",
            text: result.data?.message?.content ?? copy.mockReplies.default,
          },
        ]);
      });
    } catch {
      const prompt = nextMessages[nextMessages.length - 1]?.text.toLowerCase() ?? "";
      const fallbackReply = selectMockReply(prompt, copy);

      startTransition(() => {
        setMessages((current) => [
          ...current,
          {
            id: `assistant-${crypto.randomUUID()}`,
            role: "assistant",
            text: `${copy.apiNote} ${fallbackReply}`,
          },
        ]);
      });
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
    const nextMessages = [...messagesRef.current, userMessage];

    startTransition(() => {
      setMessages(nextMessages);
      setDraft("");
    });

    await queueAssistantReply(nextMessages);
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

function selectMockReply(prompt: string, copy: ChatCopy) {
  if (
    prompt.includes("experience") ||
    prompt.includes("recruiter") ||
    prompt.includes("ประสบการณ์") ||
    prompt.includes("สมัครงาน")
  ) {
    return copy.mockReplies.intro;
  }

  if (
    prompt.includes("project") ||
    prompt.includes("work") ||
    prompt.includes("portfolio") ||
    prompt.includes("ผลงาน") ||
    prompt.includes("โปรเจกต์")
  ) {
    return copy.mockReplies.work;
  }

  if (
    prompt.includes("skill") ||
    prompt.includes("stack") ||
    prompt.includes("react") ||
    prompt.includes("ai") ||
    prompt.includes("ทักษะ") ||
    prompt.includes("สแตก")
  ) {
    return copy.mockReplies.skills;
  }

  if (
    prompt.includes("contact") ||
    prompt.includes("hire") ||
    prompt.includes("client") ||
    prompt.includes("ติดต่อ") ||
    prompt.includes("ร่วมงาน")
  ) {
    return copy.mockReplies.contact;
  }

  return copy.mockReplies.default;
}

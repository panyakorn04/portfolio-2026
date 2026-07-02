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

type BackendChatSession = {
  id: string;
  threadId: string;
};

type BackendChatMessage = {
  id: string;
  role: "assistant" | "user";
  text: string;
};

type BackendChatSessionPayload = {
  session: BackendChatSession;
  messages?: BackendChatMessage[];
};

type ApiEnvelope<T> = {
  ok?: boolean;
  data?: T;
};

type StoredChatSession = {
  messages: ChatMessage[];
  threadId: string;
  updatedAt: string;
};

const closeDurMs = 150;
const chatSessionStorageKey = "panyakorn:portfolio-chat-session:v1";
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
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [hasLoadedSession, setHasLoadedSession] = useState(false);
  const [threadId, setThreadId] = useState(createChatSessionId);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const chatLogRef = useRef<HTMLDivElement | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const messagesRef = useRef<ChatMessage[]>([]);
  const sessionIdRef = useRef<string | null>(null);
  const threadIdRef = useRef(threadId);
  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    createStarterMessages(copy),
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

  useEffect(() => {
    sessionIdRef.current = sessionId;
  }, [sessionId]);

  useEffect(() => {
    threadIdRef.current = threadId;
  }, [threadId]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadBackendSession() {
      try {
        const payload = await fetchPortfolioChatSession(controller.signal);
        if (controller.signal.aborted || !payload) {
          return;
        }

        setSessionId(payload.session.id);
        setThreadId(payload.session.threadId);

        const backendMessages = (payload.messages ?? [])
          .filter(isBackendChatMessage)
          .map((message) => ({
            id: message.id,
            role: message.role,
            text: message.text,
          }));

        if (backendMessages.length > 0) {
          setMessages(backendMessages);
          messagesRef.current = backendMessages;
        }
      } catch {
        const storedSession = readStoredChatSession();

        if (storedSession) {
          setMessages(storedSession.messages);
          setThreadId(storedSession.threadId);
          messagesRef.current = storedSession.messages;
        }
      } finally {
        if (!controller.signal.aborted) {
          setHasLoadedSession(true);
        }
      }
    }

    void loadBackendSession();

    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    if (!hasLoadedSession || sessionId) {
      return;
    }

    writeStoredChatSession({
      messages,
      threadId,
      updatedAt: new Date().toISOString(),
    });
  }, [hasLoadedSession, messages, sessionId, threadId]);

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
    userMessage: ChatMessage,
  ) {
    setIsWaiting(true);

    try {
      const currentSessionId = sessionIdRef.current;
      const response = await fetch(apiUrl("/api/portfolio/assistant/chat/stream"), {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          currentSessionId
            ? {
                sessionId: currentSessionId,
                runId: `run-${crypto.randomUUID()}`,
                message: {
                  role: userMessage.role,
                  content: userMessage.text,
                },
              }
            : {
                threadId: threadIdRef.current,
                runId: `run-${crypto.randomUUID()}`,
                messages: nextMessages
                  .filter((message) => message.text.trim() !== "")
                  .map((message) => ({
                    role: message.role,
                    content: message.text,
                  }))
                  .slice(-10),
              },
        ),
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

    await streamAssistantReply(nextMessages, assistantMessage.id, userMessage);
  }

  function handleSubmit() {
    void submitPrompt(draft);
  }

  function handleQuickPrompt(prompt: string) {
    void submitPrompt(prompt);
  }

  return {
    chatEndRef,
    chatLogRef,
    closeChat,
    draft,
    handleDraftChange,
    handleDraftKeyDown,
    handleQuickPrompt,
    handleSubmit,
    isClosing,
    isOpen,
    isWaiting,
    messages,
    textareaRef,
    toggleChat,
  };
}

function createStarterMessages(copy: ChatCopy): ChatMessage[] {
  return copy.starterConversation.map((message, index) => ({
    id: `starter-${index}`,
    role: message.role,
    text: message.text,
  }));
}

function createChatSessionId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `portfolio-widget-${crypto.randomUUID()}`;
  }

  return `portfolio-widget-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

async function fetchPortfolioChatSession(signal: AbortSignal) {
  const response = await fetch(
    apiUrl(`/api/portfolio/assistant/sessions/current?locale=${currentLocale()}`),
    {
      credentials: "include",
      signal,
    },
  );

  if (!response.ok) {
    return null;
  }

  const envelope = (await response.json()) as ApiEnvelope<BackendChatSessionPayload>;

  if (!envelope.ok || !envelope.data?.session?.id || !envelope.data.session.threadId) {
    return null;
  }

  return envelope.data;
}

function currentLocale() {
  if (typeof window === "undefined") {
    return "en";
  }

  return window.location.pathname.startsWith("/th") ? "th" : "en";
}

function isBackendChatMessage(message: unknown): message is BackendChatMessage {
  if (!message || typeof message !== "object") {
    return false;
  }

  const candidate = message as Partial<BackendChatMessage>;

  return (
    typeof candidate.id === "string" &&
    (candidate.role === "assistant" || candidate.role === "user") &&
    typeof candidate.text === "string"
  );
}

function readStoredChatSession(): StoredChatSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const rawSession = window.localStorage.getItem(chatSessionStorageKey);

    if (!rawSession) {
      return null;
    }

    const parsedSession = JSON.parse(rawSession) as Partial<StoredChatSession>;

    if (
      typeof parsedSession.threadId !== "string" ||
      parsedSession.threadId.trim() === "" ||
      !Array.isArray(parsedSession.messages)
    ) {
      window.localStorage.removeItem(chatSessionStorageKey);
      return null;
    }

    const messages = parsedSession.messages
      .filter(isStoredChatMessage)
      .map((message) => ({
        id: message.id,
        role: message.role,
        text: message.text,
      }));

    if (messages.length === 0) {
      window.localStorage.removeItem(chatSessionStorageKey);
      return null;
    }

    return {
      messages,
      threadId: parsedSession.threadId,
      updatedAt:
        typeof parsedSession.updatedAt === "string"
          ? parsedSession.updatedAt
          : new Date().toISOString(),
    };
  } catch {
    window.localStorage.removeItem(chatSessionStorageKey);
    return null;
  }
}

function writeStoredChatSession(session: StoredChatSession) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(chatSessionStorageKey, JSON.stringify(session));
  } catch {
    // Ignore storage failures so the chat still works in private or constrained browsers.
  }
}

function isStoredChatMessage(message: unknown): message is ChatMessage {
  if (!message || typeof message !== "object") {
    return false;
  }

  const candidate = message as Partial<ChatMessage>;

  return (
    typeof candidate.id === "string" &&
    (candidate.role === "assistant" || candidate.role === "user") &&
    typeof candidate.text === "string"
  );
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

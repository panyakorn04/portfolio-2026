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

export type ChatRecentSession = {
  id: string;
  title: string;
  preview: string;
  updatedAt: string;
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
  locale?: string;
  title?: string | null;
  updatedAt?: string;
};

type BackendChatMessage = {
  id: string;
  role: "assistant" | "user";
  text: string;
};

type BackendChatSessionPayload = {
  session: BackendChatSession | null;
  messages?: BackendChatMessage[];
};

type ApiEnvelope<T> = {
  ok?: boolean;
  data?: T;
};

type StoredChatSession = {
  id: string;
  messages: ChatMessage[];
  sessionId: string | null;
  threadId: string;
  title: string;
  preview: string;
  updatedAt: string;
};

const closeDurMs = 150;
const legacyChatSessionStorageKey = "panyakorn:portfolio-chat-session:v1";
const chatRecentsStorageKey = "panyakorn:portfolio-chat-recents:v1";
const chatSessionStoragePrefix = "panyakorn:portfolio-chat-session:v2:";
const maxRecentSessions = 6;
const apiBaseUrl = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/+$/, "");

function apiUrl(path: string) {
  return `${apiBaseUrl}${path}`;
}

export function useChatDemo(copy: ChatCopy) {
  const [draft, setDraft] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [hasLoadedSession, setHasLoadedSession] = useState(false);
  const [isLoadingLatest, setIsLoadingLatest] = useState(false);
  const [threadId, setThreadId] = useState(createChatSessionId);
  const [recentSessions, setRecentSessions] = useState<ChatRecentSession[]>([]);
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

  const activeSessionKey = getSessionStorageId(sessionId, threadId);

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const replaceMessages = useCallback((nextMessages: ChatMessage[]) => {
    messagesRef.current = nextMessages;
    startTransition(() => {
      setMessages(nextMessages);
    });
  }, []);

  const applyBackendSession = useCallback(
    (payload: BackendChatSessionPayload) => {
      if (!payload.session) {
        return;
      }

      const backendMessages = (payload.messages ?? [])
        .filter(isBackendChatMessage)
        .map((message) => ({
          id: message.id,
          role: message.role,
          text: message.text,
        }));
      const nextMessages =
        backendMessages.length > 0 ? backendMessages : createStarterMessages(copy);

      setSessionId(payload.session.id);
      setThreadId(payload.session.threadId);
      replaceMessages(nextMessages);
      persistChatSession({
        copy,
        messages: nextMessages,
        sessionId: payload.session.id,
        threadId: payload.session.threadId,
        title: payload.session.title ?? undefined,
        updatedAt: payload.session.updatedAt,
      });
    },
    [copy, replaceMessages],
  );

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
    setRecentSessions(readStoredRecentSessions());
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    function loadLocalStoredSessionFallback() {
      const storedSession = readBestStoredChatSession();

      if (storedSession) {
        setSessionId(storedSession.sessionId);
        setThreadId(storedSession.threadId);
        replaceMessages(storedSession.messages);
      }
    }

    async function loadBackendSession() {
      try {
        const payload = await fetchPortfolioChatSession(controller.signal);
        if (controller.signal.aborted) {
          return;
        }

        if (!payload) {
          loadLocalStoredSessionFallback();
          return;
        }

        if (!payload.session) {
          return;
        }

        applyBackendSession(payload);
        setRecentSessions(readStoredRecentSessions());
      } catch {
        loadLocalStoredSessionFallback();
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
  }, [applyBackendSession, replaceMessages]);

  useEffect(() => {
    if (!hasLoadedSession) {
      return;
    }

    const hasUserText = messages.some(
      (m) => m.role === "user" && !m.id.startsWith("starter-"),
    );

    if (!hasUserText) {
      return;
    }

    persistChatSession({
      copy,
      messages,
      sessionId,
      threadId,
    });
    setRecentSessions(readStoredRecentSessions());
  }, [copy, hasLoadedSession, messages, sessionId, threadId]);

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
      setMessages((current) => {
        const nextMessages = current.map((message) =>
          message.id === messageId
            ? { ...message, text: updater(message.text) }
            : message,
        );
        messagesRef.current = nextMessages;
        return nextMessages;
      });
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

    replaceMessages([...nextMessages, assistantMessage]);
    setDraft("");

    await streamAssistantReply(nextMessages, assistantMessage.id, userMessage);
  }

  async function handleNewChat() {
    if (isWaiting) {
      return;
    }

    const fallbackThreadId = createChatSessionId();
    setSessionId(null);
    setThreadId(fallbackThreadId);
    replaceMessages(createStarterMessages(copy));

    try {
      const payload = await createPortfolioChatSession(copy.newChatLabel);
      if (payload.session) {
        setSessionId(payload.session.id);
        setThreadId(payload.session.threadId);
      }
    } catch {
      setThreadId(fallbackThreadId);
    }
  }

  async function handleSelectLatestChat() {
    if (isWaiting || isLoadingLatest) {
      return;
    }

    setIsLoadingLatest(true);

    try {
      const payload = await fetchPortfolioChatSession();
      if (!payload?.session) {
        return;
      }

      applyBackendSession(payload);
      setRecentSessions(readStoredRecentSessions());
    } finally {
      setIsLoadingLatest(false);
    }
  }

  function handleSelectRecentChat(recentId: string) {
    if (isWaiting || recentId === activeSessionKey) {
      return;
    }

    const storedSession = readStoredChatSession(recentId);
    if (!storedSession) {
      removeStoredRecentSession(recentId);
      setRecentSessions(readStoredRecentSessions());
      return;
    }

    setSessionId(storedSession.sessionId);
    setThreadId(storedSession.threadId);
    replaceMessages(storedSession.messages);
  }

  async function handleDeleteRecentChat(recentId: string) {
    if (isWaiting) {
      return;
    }

    const storedSession = readStoredChatSession(recentId);

    try {
      if (storedSession?.sessionId) {
        await deletePortfolioChatSession(storedSession.sessionId);
      }
    } catch {
      return;
    }

    removeStoredRecentSession(recentId);
    setRecentSessions(readStoredRecentSessions());

    if (recentId === activeSessionKey) {
      const fallbackThreadId = createChatSessionId();
      setSessionId(null);
      setThreadId(fallbackThreadId);
      replaceMessages(createStarterMessages(copy));
    }
  }

  function handleSubmit() {
    void submitPrompt(draft);
  }

  function handleQuickPrompt(prompt: string) {
    void submitPrompt(prompt);
  }

  return {
    activeSessionKey,
    chatEndRef,
    chatLogRef,
    closeChat,
    draft,
    handleDeleteRecentChat,
    handleDraftChange,
    handleDraftKeyDown,
    handleNewChat,
    handleQuickPrompt,
    handleSelectLatestChat,
    handleSelectRecentChat,
    handleSubmit,
    isClosing,
    isLoadingLatest,
    isOpen,
    isWaiting,
    messages,
    recentSessions,
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

async function fetchPortfolioChatSession(signal?: AbortSignal) {
  const response = await fetch(
    apiUrl(`/api/portfolio/assistant/sessions/latest?locale=${currentLocale()}`),
    {
      credentials: "include",
      signal,
    },
  );

  if (!response.ok) {
    return null;
  }

  const envelope = (await response.json()) as ApiEnvelope<BackendChatSessionPayload>;

  if (!envelope.ok || !envelope.data) {
    return null;
  }

  if (envelope.data.session === null) {
    return envelope.data;
  }

  if (!envelope.data.session.id || !envelope.data.session.threadId) {
    return null;
  }

  return envelope.data;
}

async function createPortfolioChatSession(title: string) {
  const response = await fetch(apiUrl("/api/portfolio/assistant/sessions"), {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      locale: currentLocale(),
      title,
    }),
  });

  if (!response.ok) {
    throw new Error(`Create chat session failed (${response.status})`);
  }

  const envelope = (await response.json()) as ApiEnvelope<BackendChatSessionPayload>;

  if (!envelope.ok || !envelope.data?.session?.id || !envelope.data.session.threadId) {
    throw new Error("Create chat session returned an invalid payload");
  }

  return envelope.data;
}

async function deletePortfolioChatSession(sessionId: string) {
  const response = await fetch(
    apiUrl(`/api/portfolio/assistant/sessions/${encodeURIComponent(sessionId)}`),
    {
      method: "DELETE",
      credentials: "include",
    },
  );

  if (!response.ok) {
    throw new Error(`Delete chat session failed (${response.status})`);
  }
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

function getSessionStorageId(sessionId: string | null, threadId: string) {
  return sessionId ?? threadId;
}

function chatSessionStorageKey(sessionKey: string) {
  return `${chatSessionStoragePrefix}${sessionKey}`;
}

function persistChatSession({
  copy,
  messages,
  sessionId,
  threadId,
  title,
  updatedAt,
}: {
  copy: ChatCopy;
  messages: ChatMessage[];
  sessionId: string | null;
  threadId: string;
  title?: string;
  updatedAt?: string;
}) {
  if (typeof window === "undefined") {
    return;
  }

  const id = getSessionStorageId(sessionId, threadId);
  const storedSession: StoredChatSession = {
    id,
    messages,
    sessionId,
    threadId,
    title: title?.trim() || deriveSessionTitle(messages, copy),
    preview: deriveSessionPreview(messages, copy),
    updatedAt: updatedAt ?? new Date().toISOString(),
  };

  try {
    window.localStorage.setItem(chatSessionStorageKey(id), JSON.stringify(storedSession));
    upsertStoredRecentSession(storedSession);
  } catch {
    // Ignore storage failures so the chat still works in private or constrained browsers.
  }
}

function readBestStoredChatSession(): StoredChatSession | null {
  const recents = readStoredRecentSessions();
  for (const recent of recents) {
    const session = readStoredChatSession(recent.id);
    if (session) {
      return session;
    }
  }

  return readLegacyStoredChatSession();
}

function readStoredChatSession(sessionKey: string): StoredChatSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const rawSession = window.localStorage.getItem(chatSessionStorageKey(sessionKey));

    if (!rawSession) {
      return null;
    }

    const parsedSession = JSON.parse(rawSession) as Partial<StoredChatSession>;

    if (
      typeof parsedSession.id !== "string" ||
      parsedSession.id.trim() === "" ||
      typeof parsedSession.threadId !== "string" ||
      parsedSession.threadId.trim() === "" ||
      !Array.isArray(parsedSession.messages)
    ) {
      window.localStorage.removeItem(chatSessionStorageKey(sessionKey));
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
      window.localStorage.removeItem(chatSessionStorageKey(sessionKey));
      return null;
    }

    return {
      id: parsedSession.id,
      messages,
      sessionId:
        typeof parsedSession.sessionId === "string" &&
        parsedSession.sessionId.trim() !== ""
          ? parsedSession.sessionId
          : null,
      threadId: parsedSession.threadId,
      title:
        typeof parsedSession.title === "string" && parsedSession.title.trim() !== ""
          ? parsedSession.title
          : "Chat",
      preview:
        typeof parsedSession.preview === "string" && parsedSession.preview.trim() !== ""
          ? parsedSession.preview
          : (messages.at(-1)?.text ?? ""),
      updatedAt:
        typeof parsedSession.updatedAt === "string"
          ? parsedSession.updatedAt
          : new Date().toISOString(),
    };
  } catch {
    window.localStorage.removeItem(chatSessionStorageKey(sessionKey));
    return null;
  }
}

function readLegacyStoredChatSession(): StoredChatSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const rawSession = window.localStorage.getItem(legacyChatSessionStorageKey);

    if (!rawSession) {
      return null;
    }

    const parsedSession = JSON.parse(rawSession) as Partial<StoredChatSession>;

    if (
      typeof parsedSession.threadId !== "string" ||
      parsedSession.threadId.trim() === "" ||
      !Array.isArray(parsedSession.messages)
    ) {
      window.localStorage.removeItem(legacyChatSessionStorageKey);
      return null;
    }

    const messages = parsedSession.messages.filter(isStoredChatMessage);

    if (messages.length === 0) {
      window.localStorage.removeItem(legacyChatSessionStorageKey);
      return null;
    }

    return {
      id: parsedSession.threadId,
      messages,
      sessionId: null,
      threadId: parsedSession.threadId,
      title: messages.find((message) => message.role === "user")?.text ?? "Chat",
      preview: messages.at(-1)?.text ?? "",
      updatedAt:
        typeof parsedSession.updatedAt === "string"
          ? parsedSession.updatedAt
          : new Date().toISOString(),
    };
  } catch {
    window.localStorage.removeItem(legacyChatSessionStorageKey);
    return null;
  }
}

function readStoredRecentSessions(): ChatRecentSession[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const rawRecents = window.localStorage.getItem(chatRecentsStorageKey);
    if (!rawRecents) {
      return [];
    }

    const parsedRecents = JSON.parse(rawRecents) as Partial<ChatRecentSession>[];
    return parsedRecents
      .filter(isStoredRecentSession)
      .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt))
      .slice(0, maxRecentSessions);
  } catch {
    window.localStorage.removeItem(chatRecentsStorageKey);
    return [];
  }
}

function upsertStoredRecentSession(session: StoredChatSession) {
  if (typeof window === "undefined") {
    return;
  }

  const recents = readStoredRecentSessions();
  const sessionIndex = recents.findIndex((recent) => recent.id === session.id);
  const nextRecents =
    sessionIndex !== -1
      ? recents.map((recent, index) =>
          index === sessionIndex
            ? {
                id: session.id,
                title: session.title,
                preview: session.preview,
                updatedAt: session.updatedAt,
              }
            : recent,
        )
      : [
          {
            id: session.id,
            title: session.title,
            preview: session.preview,
            updatedAt: session.updatedAt,
          },
          ...recents,
        ].slice(0, maxRecentSessions);

  window.localStorage.setItem(chatRecentsStorageKey, JSON.stringify(nextRecents));
}

function removeStoredRecentSession(sessionKey: string) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const recents = readStoredRecentSessions().filter(
      (recent) => recent.id !== sessionKey,
    );
    window.localStorage.setItem(chatRecentsStorageKey, JSON.stringify(recents));
    window.localStorage.removeItem(chatSessionStorageKey(sessionKey));
  } catch {
    // Ignore storage cleanup failures.
  }
}

function deriveSessionTitle(messages: ChatMessage[], copy: ChatCopy) {
  const firstUserMessage = messages.find((message) => message.role === "user");
  return truncateText(firstUserMessage?.text ?? copy.newChatLabel, 42);
}

function deriveSessionPreview(messages: ChatMessage[], copy: ChatCopy) {
  const lastMessage = messages.findLast((message) => message.text.trim() !== "");
  return truncateText(lastMessage?.text ?? copy.emptyState, 72);
}

function truncateText(value: string, maxLength: number) {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, maxLength - 1).trim()}…`;
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

function isStoredRecentSession(value: unknown): value is ChatRecentSession {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<ChatRecentSession>;
  return (
    typeof candidate.id === "string" &&
    candidate.id.trim() !== "" &&
    typeof candidate.title === "string" &&
    typeof candidate.preview === "string" &&
    typeof candidate.updatedAt === "string"
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

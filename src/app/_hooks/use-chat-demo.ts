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

const assistantReplyDelayMs = 420;
const closeDurMs = 150;

export function useChatDemo(copy: ChatCopy) {
  const [draft, setDraft] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const chatLogRef = useRef<HTMLDivElement | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
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

  const startClose = useCallback(() => {
    clearCloseTimer();
    setIsOpen(false);
    setIsClosing(true);
    closeTimerRef.current = setTimeout(() => {
      setIsClosing(false);
      closeTimerRef.current = null;
    }, closeDurMs);
  }, [clearCloseTimer]);

  useLayoutEffect(() => {
    if (!isOpen) {
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
  });

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
    submitPrompt(draft);
  }

  function queueAssistantReply(prompt: string) {
    setIsWaiting(true);

    window.setTimeout(() => {
      const normalizedPrompt = prompt.toLowerCase();
      const nextReply = selectMockReply(normalizedPrompt, copy);

      startTransition(() => {
        setMessages((current) => [
          ...current,
          {
            id: `assistant-${crypto.randomUUID()}`,
            role: "assistant",
            text: nextReply,
          },
        ]);
        setIsWaiting(false);
      });
    }, assistantReplyDelayMs);
  }

  function submitPrompt(prompt: string) {
    const normalizedPrompt = prompt.trim();

    if (!normalizedPrompt || isWaiting) {
      return;
    }

    startTransition(() => {
      setMessages((current) => [
        ...current,
        {
          id: `user-${crypto.randomUUID()}`,
          role: "user",
          text: normalizedPrompt,
        },
      ]);
      setDraft("");
    });

    queueAssistantReply(normalizedPrompt);
  }

  function handleSubmit() {
    submitPrompt(draft);
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

  return `${copy.apiNote} ${copy.mockReplies.default}`;
}

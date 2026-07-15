"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  adminBodyClass as bodyClass,
  glassCompactPanelClass,
  adminLabelClass as labelClass,
} from "@/components/ui/typography";
import type { Locale, PortfolioDictionary } from "@/lib/portfolio";

type AdminCopy = PortfolioDictionary["adminWorkspace"];

type ChatMessage = {
  id: string;
  role: string;
  type: string;
  text: string;
  createdAt: string;
  metadata?: Record<string, unknown> | null;
};

type ApiResponse<T> = { ok: boolean; data: T };

export default function AdminChatConversation({
  locale,
  sessionId,
  sessionTitle,
  sessionStatus,
  copy,
  onStatusChange,
}: {
  locale: Locale;
  sessionId: string;
  sessionTitle: string;
  sessionStatus: string;
  copy?: AdminCopy;
  onStatusChange?: () => void;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(sessionStatus);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/chat/sessions/${sessionId}`);
      if (!res.ok) throw new Error("Failed to load messages");
      const json: ApiResponse<{
        id: string;
        threadId: string;
        status: string;
        messages: ChatMessage[];
      }> = await res.json();
      if (json.ok) {
        setMessages(json.data.messages ?? []);
        setStatus(json.data.status);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  });

  async function handleSend() {
    const text = draft.trim();
    if (!text || isSending) return;

    setIsSending(true);
    try {
      const res = await fetch(`/api/admin/chat/sessions/${sessionId}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      if (!res.ok) throw new Error("Failed to send reply");
      const json: ApiResponse<ChatMessage> = await res.json();
      if (json.ok) {
        setMessages((prev) => [...prev, json.data]);
        setDraft("");
        setStatus("human");
        onStatusChange?.();
      }
    } catch {
      // silent
    } finally {
      setIsSending(false);
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  }

  function statusLabel(s: string) {
    switch (s) {
      case "pending_human":
        return "Pending human";
      case "human":
        return "Human-assisted";
      default:
        return "AI auto";
    }
  }

  function isAdminMessage(msg: ChatMessage) {
    return msg.metadata?.source === "admin";
  }

  function isSystemEvent(msg: ChatMessage) {
    return msg.type === "request_human" || msg.type === "human_takeover";
  }

  return (
    <section className={glassCompactPanelClass}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--color-line)] p-4 sm:p-5">
        <div className="min-w-0 space-y-1">
          <p className={labelClass}>Conversation</p>
          <p className="text-sm font-semibold text-[var(--color-text)] truncate">
            {sessionTitle}
          </p>
          <p className={`${bodyClass} text-[var(--color-soft)]`}>{statusLabel(status)}</p>
        </div>
      </div>

      <div className="flex min-h-80 flex-col gap-3 overflow-y-auto p-4 sm:p-5 [scrollbar-color:rgba(111,247,166,0.35)_transparent] [scrollbar-width:thin]">
        {loading ? (
          <div className="flex flex-1 items-center justify-center py-12">
            <p className={`${bodyClass}`}>{copy?.loadingLabel ?? "Loading..."}</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 py-12 text-center">
            <div className="flex size-10 items-center justify-center rounded-full border border-[var(--color-line)] bg-[#090b0a]">
              <svg
                aria-hidden="true"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M4 11.5L2 14V4C2 3.44772 2.44772 3 3 3H13C13.5523 3 14 3.44772 14 4V10C14 10.5523 13.5523 11 13 11H7L4 11.5Z"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <p className={`${bodyClass} max-w-sm`}>
              No messages in this conversation yet.
            </p>
          </div>
        ) : (
          <>
            {messages.map((msg) => {
              const isAdmin = isAdminMessage(msg);
              const isSystem = isSystemEvent(msg);

              if (isSystem) {
                return (
                  <div key={msg.id} className="flex justify-center py-1">
                    <span className="rounded-full bg-[#090b0a] px-3 py-1 font-mono text-[0.55rem] text-[var(--color-soft)] border border-[var(--color-line)]">
                      {msg.type === "request_human"
                        ? "Visitor requested human contact"
                        : "Admin took over"}
                    </span>
                  </div>
                );
              }

              const isUser = msg.role === "user" && !isAdmin;

              return (
                <div
                  key={msg.id}
                  className={`flex gap-2 ${isAdmin ? "justify-end" : "justify-start"}`}
                >
                  {!isAdmin ? (
                    <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border border-[var(--color-line)] bg-[#090b0a]">
                      <span className="font-mono text-[9px] text-[var(--color-soft)]">
                        {isUser ? "V" : "AI"}
                      </span>
                    </div>
                  ) : (
                    <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)]">
                      <span className="font-mono text-[9px] font-bold text-[var(--color-accent-foreground)]">
                        A
                      </span>
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                      isAdmin
                        ? "rounded-br-sm border border-[rgba(111,247,166,0.22)] bg-[rgba(111,247,166,0.12)]"
                        : isUser
                          ? "rounded-tl-sm border border-[var(--color-line)] bg-[#090b0a]"
                          : "rounded-tl-sm border border-[rgba(111,247,166,0.12)] bg-[rgba(111,247,166,0.05)]"
                    }`}
                  >
                    {isAdmin && msg.metadata?.adminName ? (
                      <p className="mb-1 font-mono text-[0.55rem] uppercase tracking-wider text-[var(--color-accent)]">
                        {msg.metadata.adminName as string}
                      </p>
                    ) : null}
                    <p
                      className={`whitespace-pre-wrap text-pretty text-[0.82rem] leading-relaxed ${
                        msg.text
                          ? "text-[var(--color-text)]"
                          : "text-[var(--color-soft)] italic"
                      }`}
                    >
                      {msg.text || "..."}
                    </p>
                    {msg.createdAt ? (
                      <p
                        className={`mt-1.5 font-mono text-[0.58rem] tracking-[0.04em] ${
                          isAdmin
                            ? "text-right text-[rgba(111,247,166,0.5)]"
                            : "text-left text-[var(--color-soft)]"
                        }`}
                      >
                        {new Date(msg.createdAt).toLocaleTimeString(locale, {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    ) : null}
                  </div>
                </div>
              );
            })}

            <div ref={chatEndRef} aria-hidden="true" />
          </>
        )}
      </div>

      <div className="border-t border-[var(--color-line)] p-4 sm:p-5">
        <div className="flex items-end gap-2">
          <textarea
            ref={textareaRef}
            value={draft}
            rows={2}
            placeholder="Type a reply..."
            className="min-h-[42px] max-h-32 flex-1 resize-none rounded-md border border-[var(--color-line)] bg-[#090b0a] px-3.5 py-[9px] text-[0.82rem] leading-relaxed text-[var(--color-text)] outline-none transition-all focus:border-[var(--color-line-strong)] placeholder:text-[var(--color-soft)]"
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isSending}
          />
          <Button
            variant="primary"
            size="md"
            onClick={handleSend}
            disabled={isSending || !draft.trim()}
            className="shrink-0 rounded-md"
          >
            {isSending ? "..." : "Send"}
          </Button>
        </div>
      </div>
    </section>
  );
}

"use client";

import {
  type KeyboardEvent as ReactKeyboardEvent,
  type RefObject,
  useState,
} from "react";

import type { PortfolioDictionary } from "../_data/portfolio";
import type { ChatMessage, ChatRecentSession } from "../_hooks/use-chat-demo";

type ChatCopy = PortfolioDictionary["chat"];

type ChatDemoViewProps = {
  activeSessionKey: string;
  chatEndRef: RefObject<HTMLDivElement | null>;
  chatLogRef: RefObject<HTMLDivElement | null>;
  copy: ChatCopy;
  draft: string;
  isClosing: boolean;
  isOpen: boolean;
  isWaiting: boolean;
  messages: ChatMessage[];
  onClose: () => void;
  onDeleteRecentChat: (sessionId: string) => void;
  onDraftChange: (value: string) => void;
  onDraftKeyDown: (event: ReactKeyboardEvent<HTMLTextAreaElement>) => void;
  onNewChat: () => void;
  onQuickPrompt: (prompt: string) => void;
  onSelectRecentChat: (sessionId: string) => void;
  onSubmit: () => void;
  onToggle: () => void;
  recentSessions: ChatRecentSession[];
  textareaRef: RefObject<HTMLTextAreaElement | null>;
};

const widgetShellClass =
  "fixed bottom-4 right-4 z-40 grid justify-items-end gap-3 max-sm:bottom-3 max-sm:right-3";
const backdropClass =
  "fixed inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(111,247,166,0.08),transparent_26%),rgba(5,11,8,0.24)] motion-reduce:transition-none";
const flyoutClass =
  "w-[min(calc(100vw-2rem),38rem)] max-h-[min(84svh,52rem)] origin-bottom-right overflow-hidden rounded-[1.6rem] border border-[rgba(111,247,166,0.12)] bg-[linear-gradient(180deg,rgba(8,16,12,0.98),rgba(4,10,7,0.98))] shadow-[0_28px_80px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(111,247,166,0.08)] backdrop-blur-[14px] motion-reduce:transition-none max-sm:w-[calc(100vw-2.75rem)] max-sm:max-h-[calc(100svh-5.5rem)]";
const chatLogClass =
  "flex min-h-64 max-h-[22rem] flex-col gap-3 overflow-y-auto rounded-[1.15rem] bg-[rgba(5,11,8,0.58)] p-3 [scrollbar-color:rgba(111,247,166,0.4)_transparent] [scrollbar-width:thin] max-sm:min-h-52 max-sm:max-h-[min(40svh,20rem)]";
const recentButtonClass =
  "group flex min-w-0 flex-1 items-start gap-2 rounded-xl border border-[var(--color-line)] bg-[rgba(10,20,16,0.52)] px-3 py-2 text-left transition-colors hover:border-[var(--color-line-strong)]";
const typingClass = "flex items-center gap-1.5 px-1";
const typingDotClass =
  "h-1.5 w-1.5 rounded-full bg-[var(--color-accent)] animate-bounce motion-reduce:animate-none";

export default function ChatDemoView({
  activeSessionKey,
  chatEndRef,
  chatLogRef,
  copy,
  draft,
  isClosing,
  isOpen,
  isWaiting,
  messages,
  onClose,
  onDeleteRecentChat,
  onDraftChange,
  onDraftKeyDown,
  onNewChat,
  onQuickPrompt,
  onSelectRecentChat,
  onSubmit,
  onToggle,
  recentSessions,
  textareaRef,
}: ChatDemoViewProps) {
  const show = isOpen || isClosing;
  const hasUserMessages = messages.some((m) => m.role === "user");
  const [activeTab, setActiveTab] = useState<"new" | "recent">("new");
  const titledSessions = recentSessions.filter((s) => s.title?.trim());

  return (
    <div className={widgetShellClass}>
      {show ? (
        <button
          type="button"
          aria-label={copy.closeLabel}
          className={`${backdropClass} pointer-events-auto opacity-100`}
          onClick={onClose}
        />
      ) : null}

      {show ? (
        <section id="portfolio-chat-widget" className={flyoutClass}>
          <div className="flex items-center justify-between gap-3 border-b border-[var(--color-line)] px-4 py-3">
            <div className="flex items-center gap-2.5">
              <span className="flex size-7 items-center justify-center rounded-full bg-[var(--color-accent)] text-[0.6rem] font-bold text-[#041009]">
                P
              </span>
              <div>
                <p className="text-[0.78rem] font-semibold leading-tight text-[var(--color-text)]">
                  {copy.assistantName}
                </p>
                <p className="font-mono text-[0.55rem] uppercase tracking-[0.06em] text-[var(--color-soft)]">
                  {isWaiting ? "Thinking..." : "Online"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("new");
                  onNewChat();
                }}
                className={`rounded-full px-3 py-1.5 font-mono text-[0.6rem] uppercase tracking-[0.05em] transition-colors ${
                  activeTab === "new"
                    ? "bg-[var(--color-accent)] text-[#041009]"
                    : "border border-[var(--color-line)] text-[var(--color-soft)] hover:border-[var(--color-line-strong)] hover:text-[var(--color-text)]"
                }`}
              >
                {copy.newChatLabel}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("recent")}
                className={`rounded-full px-3 py-1.5 font-mono text-[0.6rem] uppercase tracking-[0.05em] transition-colors ${
                  activeTab === "recent"
                    ? "bg-[var(--color-accent)] text-[#041009]"
                    : "border border-[var(--color-line)] text-[var(--color-soft)] hover:border-[var(--color-line-strong)] hover:text-[var(--color-text)]"
                }`}
              >
                {copy.recentChatsLabel}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex size-7 items-center justify-center rounded-full text-[var(--color-soft)] transition-colors hover:bg-[rgba(255,255,255,0.08)] hover:text-[var(--color-text)]"
                aria-label={copy.closeLabel}
              >
                <svg
                  aria-hidden="true"
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                >
                  <path
                    d="M2 2L12 12M12 2L2 12"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="grid gap-3 p-3">
            <div ref={chatLogRef} className={chatLogClass}>
              {activeTab === "recent" ? (
                titledSessions.length > 0 ? (
                  <div className="grid gap-1.5">
                    {titledSessions.map((session) => {
                      const isActive = session.id === activeSessionKey;

                      return (
                        <div
                          key={session.id}
                          className="flex min-w-0 items-stretch gap-1.5"
                        >
                          <button
                            type="button"
                            disabled={isWaiting || isActive}
                            onClick={() => onSelectRecentChat(session.id)}
                            className={`${recentButtonClass} ${
                              isActive
                                ? "border-[var(--color-line-strong)] bg-[rgba(111,247,166,0.08)]"
                                : ""
                            } disabled:cursor-default disabled:opacity-80`}
                          >
                            <span className="mt-1 size-1.5 shrink-0 rounded-full bg-[var(--color-accent)] opacity-70" />
                            <span className="min-w-0">
                              <span className="block truncate text-[0.72rem] font-medium text-[var(--color-text)]">
                                {session.title}
                              </span>
                              <span className="mt-0.5 block truncate text-[0.64rem] text-[var(--color-soft)]">
                                {session.preview}
                              </span>
                            </span>
                          </button>
                          <button
                            type="button"
                            disabled={isWaiting}
                            onClick={() => onDeleteRecentChat(session.id)}
                            className="flex w-9 shrink-0 items-center justify-center rounded-xl border border-[var(--color-line)] text-[var(--color-soft)] transition-colors hover:border-[var(--color-line-strong)] hover:text-[var(--color-text)] disabled:cursor-not-allowed disabled:opacity-40"
                            aria-label={`${copy.deleteChatLabel}: ${session.title}`}
                          >
                            <svg
                              aria-hidden="true"
                              width="14"
                              height="14"
                              viewBox="0 0 14 14"
                              fill="none"
                            >
                              <path
                                d="M3.5 4.5H10.5M5.5 4.5V3.25H8.5V4.5M5 5.75V10M9 5.75V10M4.25 4.5L4.7 11.25H9.3L9.75 4.5"
                                stroke="currentColor"
                                strokeWidth="1.2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-1 items-center justify-center p-4 text-center">
                    <p className="text-pretty text-[0.82rem] leading-relaxed text-[var(--color-muted)]">
                      {copy.recentChatsEmptyLabel}
                    </p>
                  </div>
                )
              ) : messages.length === 0 ? (
                <div className="flex flex-1 items-center justify-center p-4 text-center">
                  <p className="text-pretty text-[0.82rem] leading-relaxed text-[var(--color-muted)]">
                    {copy.emptyState}
                  </p>
                </div>
              ) : (
                <>
                  {messages.map((message) => {
                    const isAssistant = message.role === "assistant";

                    return (
                      <div
                        key={message.id}
                        className={`flex ${isAssistant ? "justify-start" : "justify-end"}`}
                      >
                        <div
                          className={`max-w-[86%] rounded-2xl px-3.5 py-2.5 ${
                            isAssistant
                              ? "rounded-tl-sm border border-[var(--color-line)] bg-[rgba(10,20,16,0.8)]"
                              : "rounded-br-sm border border-[rgba(111,247,166,0.2)] bg-[rgba(111,247,166,0.1)]"
                          }`}
                        >
                          <p className="whitespace-pre-wrap text-pretty text-[0.82rem] leading-relaxed text-[var(--color-text)]">
                            {message.text}
                          </p>
                        </div>
                      </div>
                    );
                  })}

                  {isWaiting ? (
                    <div className="flex justify-start">
                      <div className="rounded-2xl rounded-tl-sm border border-[var(--color-line)] bg-[rgba(10,20,16,0.8)] px-3.5 py-3">
                        <div className={typingClass} aria-hidden="true">
                          <span
                            className={typingDotClass}
                            style={{
                              animationDelay: "0ms",
                            }}
                          />
                          <span
                            className={typingDotClass}
                            style={{
                              animationDelay: "150ms",
                            }}
                          />
                          <span
                            className={typingDotClass}
                            style={{
                              animationDelay: "300ms",
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ) : null}
                </>
              )}

              <div ref={chatEndRef} aria-hidden="true" />
            </div>

            {activeTab === "new" && !hasUserMessages && copy.quickPrompts.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {copy.quickPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => onQuickPrompt(prompt)}
                    className="rounded-full border border-[var(--color-line)] bg-[rgba(10,20,16,0.6)] px-3 py-1.5 text-left text-[0.7rem] leading-snug text-[var(--color-muted)] transition-colors hover:border-[var(--color-line-strong)] hover:text-[var(--color-text)]"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            ) : null}

            <form
              onSubmit={(event) => {
                event.preventDefault();
                onSubmit();
              }}
              className="flex items-end gap-2"
            >
              <label className="sr-only" htmlFor="chat-draft">
                {copy.inputPlaceholder}
              </label>
              <textarea
                id="chat-draft"
                ref={textareaRef}
                value={draft}
                rows={1}
                placeholder={copy.inputPlaceholder}
                className="min-h-10 max-h-28 flex-1 resize-none rounded-xl border border-[var(--color-line)] bg-[rgba(5,11,8,0.7)] px-3 py-2.5 text-[0.82rem] leading-relaxed text-[var(--color-text)] outline-none focus:ring-0 placeholder:text-[var(--color-soft)] transition-colors"
                onChange={(event) => onDraftChange(event.target.value)}
                onKeyDown={onDraftKeyDown}
              />
              <button
                type="submit"
                disabled={isWaiting || !draft.trim()}
                className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-[var(--color-line-strong)] bg-[var(--color-accent)] text-[#041009] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label={copy.sendLabel}
              >
                <svg
                  aria-hidden="true"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M2 8L14 8M14 8L9 3M14 8L9 13"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </form>
          </div>
        </section>
      ) : null}

      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls="portfolio-chat-widget"
        onClick={onToggle}
        className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 font-medium text-[0.78rem] text-[var(--color-text)] shadow-[0_8px_28px_rgba(0,0,0,0.28)] backdrop-blur-xl transition-all duration-150 motion-reduce:transition-none hover:-translate-y-0.5 hover:shadow-[0_12px_36px_rgba(0,0,0,0.34)] active:translate-y-0 ${
          isOpen
            ? "border-[var(--color-accent)] bg-[rgba(111,247,166,0.12)]"
            : "border-[var(--color-line-strong)] bg-[rgba(10,20,16,0.88)]"
        }`}
      >
        <span className="relative flex size-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-accent)] opacity-75 motion-reduce:animate-none" />
          <span className="relative inline-flex size-2.5 rounded-full bg-[var(--color-accent)]" />
        </span>
        <span className="hidden sm:inline">
          {isOpen ? copy.closeLabel : copy.openLabel}
        </span>
        <span className="sm:hidden">{isOpen ? copy.closeLabel : copy.openLabel}</span>
      </button>
    </div>
  );
}

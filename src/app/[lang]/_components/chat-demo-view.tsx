"use client";

import {
  type KeyboardEvent as ReactKeyboardEvent,
  type RefObject,
  useState,
} from "react";
import type { PortfolioDictionary } from "@/lib/portfolio";
import type { ChatMessage, ChatRecentSession } from "../_hooks/use-chat-demo";

type ChatCopy = PortfolioDictionary["chat"];

type ChatDemoViewProps = {
  activeSessionKey: string;
  chatEndRef: RefObject<HTMLDivElement | null>;
  chatLogRef: RefObject<HTMLDivElement | null>;
  copy: ChatCopy;
  draft: string;
  humanRequestState: "idle" | "pending" | "requested";
  isClosing: boolean;
  isLoadingLatest: boolean;
  isOpen: boolean;
  isWaiting: boolean;
  messages: ChatMessage[];
  onClose: () => void;
  onDeleteRecentChat: (sessionId: string) => void;
  onDraftChange: (value: string) => void;
  onDraftKeyDown: (event: ReactKeyboardEvent<HTMLTextAreaElement>) => void;
  onNewChat: () => void;
  onQuickPrompt: (prompt: string) => void;
  onRequestHuman: () => void;
  onSelectLatestChat: () => void;
  onSelectRecentChat: (sessionId: string) => void;
  onSubmit: () => void;
  onToggle: () => void;
  recentSessions: ChatRecentSession[];
  textareaRef: RefObject<HTMLTextAreaElement | null>;
};

const widgetShellClass =
  "fixed bottom-4 right-4 z-40 grid justify-items-end gap-3 max-sm:bottom-3 max-sm:right-3";
const backdropClass =
  "fixed inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(111,247,166,0.06),transparent_30%),rgba(3,8,6,0.38)] motion-reduce:transition-none";
const flyoutClass =
  "w-[min(calc(100vw-2rem),38rem)] max-h-[min(84svh,52rem)] origin-bottom-right overflow-hidden border border-[var(--color-line-strong)] bg-[rgba(11,13,12,0.98)] shadow-[0_28px_80px_rgba(0,0,0,0.55)] motion-reduce:transition-none max-sm:w-[calc(100vw-2.75rem)] max-sm:max-h-[calc(100svh-5.5rem)]";
const chatLogClass =
  "flex min-h-64 max-h-[22rem] flex-col gap-3 overflow-y-auto rounded-[1.15rem] bg-[rgba(4,9,7,0.72)] p-3 [scrollbar-color:rgba(111,247,166,0.35)_transparent] [scrollbar-width:thin] max-sm:min-h-52 max-sm:max-h-[min(40svh,20rem)]";
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
  humanRequestState,
  isClosing,
  isLoadingLatest,
  isOpen,
  isWaiting,
  messages,
  onClose,
  onDeleteRecentChat,
  onDraftChange,
  onDraftKeyDown,
  onNewChat,
  onQuickPrompt,
  onRequestHuman,
  onSelectLatestChat,
  onSelectRecentChat,
  onSubmit,
  onToggle,
  recentSessions,
  textareaRef,
}: ChatDemoViewProps) {
  const show = isOpen || isClosing;
  const hasUserMessages = messages.some((m) => m.role === "user");
  const hasHumanExchange = messages.filter((m) => m.role === "user").length >= 2;
  const hasBackendSession = Boolean(
    activeSessionKey && !activeSessionKey.startsWith("portfolio-widget-"),
  );
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
        <section id="portfolio-chat-widget" className={`${flyoutClass} relative`}>
          <div className="flex items-center justify-between gap-3 border-b border-[var(--color-line)] px-4 py-3">
            <div className="flex items-center gap-2.5">
              <span className="flex size-11 items-center justify-center rounded-full bg-[var(--color-accent)] text-[0.6rem] font-bold text-[var(--color-accent-foreground)]">
                P
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setActiveTab("new")}
                  className={`min-h-11 rounded-full px-3 font-mono text-[0.6rem] uppercase tracking-[0.05em] transition-colors ${
                    activeTab === "new"
                      ? "bg-[var(--color-accent)] text-[var(--color-accent-foreground)]"
                      : "border border-[var(--color-line)] text-[var(--color-soft)] hover:border-[var(--color-line-strong)] hover:text-[var(--color-text)]"
                  }`}
                >
                  {copy.chatTabLabel}
                </button>
                <span className="text-[0.55rem] text-[var(--color-soft)]">/</span>
                <button
                  type="button"
                  onClick={() => setActiveTab("recent")}
                  className={`min-h-11 rounded-full px-3 font-mono text-[0.6rem] uppercase tracking-[0.05em] transition-colors ${
                    activeTab === "recent"
                      ? "bg-[var(--color-accent)] text-[var(--color-accent-foreground)]"
                      : "border border-[var(--color-line)] text-[var(--color-soft)] hover:border-[var(--color-line-strong)] hover:text-[var(--color-text)]"
                  }`}
                >
                  {copy.recentChatsLabel}
                </button>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("new");
                  onNewChat();
                }}
                className="flex size-11 items-center justify-center rounded-full text-[var(--color-soft)] transition-colors hover:bg-[rgba(255,255,255,0.08)] hover:text-[var(--color-text)]"
                aria-label={copy.newChatLabel}
              >
                <svg
                  aria-hidden="true"
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                >
                  <path
                    d="M11 2L12 3L5 10L2 12L4 9L11 2Z"
                    stroke="currentColor"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex size-11 items-center justify-center rounded-full text-[var(--color-soft)] transition-colors hover:bg-[rgba(255,255,255,0.08)] hover:text-[var(--color-text)]"
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
                  <div className="grid gap-2">
                    <button
                      type="button"
                      disabled={isWaiting || isLoadingLatest}
                      onClick={() => {
                        setActiveTab("new");
                        onSelectLatestChat();
                      }}
                      className="rounded-xl border border-[rgba(111,247,166,0.22)] bg-[rgba(111,247,166,0.08)] px-3 py-2 text-left font-mono text-[0.62rem] uppercase tracking-[0.06em] text-[var(--color-accent)] transition-colors hover:border-[rgba(111,247,166,0.44)] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isLoadingLatest
                        ? copy.loadingLatestChatLabel
                        : copy.latestChatLabel}
                    </button>
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
                            onClick={() => {
                              setActiveTab("new");
                              onSelectRecentChat(session.id);
                            }}
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
                  <div className="flex flex-1 flex-col items-center justify-center gap-3 p-4 text-center">
                    <div>
                      <p className="text-pretty text-[0.82rem] leading-relaxed text-[var(--color-muted)]">
                        {copy.recentChatsEmptyLabel}
                      </p>
                      <p className="mt-1 text-pretty text-[0.68rem] leading-relaxed text-[var(--color-soft)]">
                        {copy.latestChatEmptyLabel}
                      </p>
                    </div>
                    <button
                      type="button"
                      disabled={isWaiting || isLoadingLatest}
                      onClick={() => {
                        setActiveTab("new");
                        onSelectLatestChat();
                      }}
                      className="rounded-full border border-[var(--color-line-strong)] bg-[rgba(111,247,166,0.08)] px-3 py-1.5 font-mono text-[0.62rem] uppercase tracking-[0.06em] text-[var(--color-accent)] transition-colors hover:border-[rgba(111,247,166,0.44)] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isLoadingLatest
                        ? copy.loadingLatestChatLabel
                        : copy.latestChatLabel}
                    </button>
                  </div>
                )
              ) : messages.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center gap-2 p-4 text-center">
                  <div className="flex size-11 items-center justify-center rounded-full bg-[var(--color-accent)]/10 ring-1 ring-[rgba(111,247,166,0.2)]">
                    <span className="font-mono text-[10px] text-[var(--color-accent)]">
                      AI
                    </span>
                  </div>
                  <p className="max-w-[26ch] text-pretty text-[0.82rem] leading-relaxed text-[var(--color-muted)]">
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
                        className={`flex gap-2 ${isAssistant ? "justify-start" : "justify-end"}`}
                      >
                        {isAssistant && (
                          <div className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)] text-[9px] font-bold text-[var(--color-accent-foreground)]">
                            P
                          </div>
                        )}

                        <div
                          className={`max-w-[84%] rounded-2xl px-3.5 py-2.5 ${
                            isAssistant
                              ? "rounded-tl-sm border border-[var(--color-line)] bg-[rgba(10,20,16,0.85)]"
                              : "rounded-br-sm border border-[rgba(111,247,166,0.22)] bg-[rgba(111,247,166,0.12)]"
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

                  {activeTab === "new" &&
                  hasHumanExchange &&
                  humanRequestState === "idle" &&
                  hasBackendSession ? (
                    <div className="flex justify-center pt-1">
                      <button
                        type="button"
                        onClick={onRequestHuman}
                        className="rounded-full border border-[rgba(250,204,21,0.3)] bg-[rgba(250,204,21,0.08)] px-4 py-1.5 font-mono text-[0.6rem] uppercase tracking-[0.06em] text-[#facc15] transition-colors hover:border-[rgba(250,204,21,0.5)] hover:bg-[rgba(250,204,21,0.14)]"
                      >
                        {copy.requestHumanLabel}
                      </button>
                    </div>
                  ) : null}
                  {humanRequestState === "pending" ? (
                    <div className="flex justify-center pt-1">
                      <span className="rounded-full border border-[rgba(250,204,21,0.3)] bg-[rgba(250,204,21,0.08)] px-4 py-1.5 font-mono text-[0.6rem] text-[#facc15]">
                        {copy.requestingHumanLabel}
                      </span>
                    </div>
                  ) : null}
                  {humanRequestState === "requested" ? (
                    <div className="flex justify-center pt-1">
                      <span className="rounded-full border border-[var(--color-accent)] bg-[rgba(111,247,166,0.08)] px-4 py-1.5 font-mono text-[0.6rem] text-[var(--color-accent)]">
                        {copy.humanRequestedLabel}
                      </span>
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
                    className="group rounded-full border border-[rgba(111,247,166,0.18)] bg-[rgba(8,14,11,0.6)] px-3.5 py-1.5 text-left text-[0.7rem] leading-snug text-[var(--color-muted)] transition-all hover:border-[var(--color-accent)] hover:bg-[rgba(111,247,166,0.1)] hover:text-[var(--color-text)] active:scale-[0.985]"
                  >
                    <span className="group-hover:text-[var(--color-accent)] transition-colors">
                      →
                    </span>{" "}
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
                className="min-h-[42px] max-h-28 flex-1 resize-none rounded-xl border border-[var(--color-line)] bg-[rgba(5,11,8,0.72)] px-3.5 py-[9px] text-[0.82rem] leading-relaxed text-[var(--color-text)] outline-none focus:border-[var(--color-line-strong)] placeholder:text-[var(--color-soft)] transition-all"
                onChange={(event) => onDraftChange(event.target.value)}
                onKeyDown={onDraftKeyDown}
              />
              <button
                type="submit"
                disabled={isWaiting || !draft.trim()}
                className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-[var(--color-line-strong)] bg-[var(--color-accent)] text-[var(--color-accent-foreground)] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
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

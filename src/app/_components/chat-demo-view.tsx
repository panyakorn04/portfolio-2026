"use client";

import type { KeyboardEvent as ReactKeyboardEvent, RefObject } from "react";

import type { PortfolioDictionary } from "../_data/portfolio";
import type { ChatMessage } from "../_hooks/use-chat-demo";

type ChatCopy = PortfolioDictionary["chat"];

type ChatDemoViewProps = {
  chatEndRef: RefObject<HTMLDivElement | null>;
  chatLogRef: RefObject<HTMLDivElement | null>;
  copy: ChatCopy;
  draft: string;
  isClosing: boolean;
  isOpen: boolean;
  isWaiting: boolean;
  messages: ChatMessage[];
  onClose: () => void;
  onDraftChange: (value: string) => void;
  onDraftKeyDown: (event: ReactKeyboardEvent<HTMLTextAreaElement>) => void;
  onSubmit: () => void;
  onToggle: () => void;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
};

const widgetShellClass =
  "fixed bottom-4 right-4 z-40 grid justify-items-end gap-[0.85rem] max-sm:bottom-3 max-sm:right-3";
const backdropClass =
  "fixed inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(111,247,166,0.08),transparent_26%),rgba(5,11,8,0.24)] motion-reduce:transition-none";
const flyoutClass =
  "w-[min(calc(100vw-2rem),36rem)] max-h-[min(84svh,52rem)] origin-bottom-right overflow-hidden rounded-[1.6rem] border border-[rgba(111,247,166,0.12)] bg-[linear-gradient(180deg,rgba(8,16,12,0.98),rgba(4,10,7,0.98))] shadow-[0_28px_80px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(111,247,166,0.08)] backdrop-blur-[14px] motion-reduce:transition-none max-sm:w-[calc(100vw-2.75rem)] max-sm:max-h-[calc(100svh-5.5rem)]";
const windowBarClass =
  "flex items-center justify-between gap-4 border-b border-[var(--color-line)] bg-[linear-gradient(180deg,rgba(12,24,18,0.96),rgba(8,15,12,0.96))] px-4 py-[0.82rem] font-mono text-[0.6rem] uppercase tracking-[0.04em] tabular-nums sm:text-[0.64rem]";
const windowDotClass = "inline-block h-[0.65rem] w-[0.65rem] rounded-full opacity-[0.88]";
const chromeButtonClass =
  "inline-flex items-center justify-center rounded-full border border-[var(--color-line-strong)] bg-[rgba(9,18,14,0.88)] px-[0.92rem] py-[0.68rem] font-mono text-[0.66rem] uppercase tracking-[0.04em] tabular-nums text-[var(--color-text)] sm:px-[0.9rem] sm:py-[0.68rem] sm:text-[0.7rem]";
const chatLogClass =
  "grid min-h-72 max-h-[23rem] gap-[0.85rem] overflow-y-auto rounded-[1.35rem] border border-[var(--color-line)] bg-[linear-gradient(180deg,rgba(7,16,12,0.96),rgba(4,10,7,0.96)),radial-gradient(circle_at_top,rgba(111,247,166,0.08),transparent_38%)] p-4 shadow-[inset_0_1px_0_rgba(111,247,166,0.08)] [scrollbar-color:rgba(111,247,166,0.5)_rgba(10,20,16,0.88)] [scrollbar-width:thin] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:border-2 [&::-webkit-scrollbar-thumb]:border-transparent [&::-webkit-scrollbar-thumb]:bg-[linear-gradient(180deg,rgba(111,247,166,0.72),rgba(79,191,125,0.52))] [&::-webkit-scrollbar-thumb]:bg-clip-padding [&::-webkit-scrollbar-track]:border-l [&::-webkit-scrollbar-track]:border-[rgba(111,247,166,0.08)] [&::-webkit-scrollbar-track]:bg-[linear-gradient(180deg,rgba(8,16,12,0.96),rgba(5,11,8,0.96))] [&::-webkit-scrollbar]:w-[0.72rem] max-sm:min-h-56 max-sm:max-h-[min(40svh,21rem)]";
const bubbleBaseClass =
  "grid w-fit max-w-[82%] gap-[0.28rem] border border-[var(--color-line-strong)] px-4 py-[0.95rem] shadow-[inset_0_1px_0_rgba(111,247,166,0.05)]";
const labelClass =
  "font-mono text-[0.58rem] uppercase tracking-[0.06em] tabular-nums text-[var(--color-soft)] sm:text-[0.62rem]";
const copyClass =
  "mt-2 text-pretty text-[0.78rem] leading-[1.72] text-[var(--color-text)] sm:text-[0.8rem] sm:leading-[1.68]";
const formClass =
  "grid gap-[0.9rem] rounded-[1.35rem] border border-[rgba(111,247,166,0.14)] bg-[linear-gradient(180deg,rgba(7,14,11,0.96),rgba(5,10,8,0.96))] p-[0.7rem] shadow-[inset_0_1px_0_rgba(111,247,166,0.06)]";
const inputClass =
  "min-h-[6.8rem] w-full resize-none rounded-[1rem] border border-[rgba(111,247,166,0.12)] bg-[rgba(5,11,8,0.86)] px-4 py-[0.95rem] text-[0.92rem] leading-[1.7] text-[var(--color-text)] outline-none shadow-[inset_0_1px_0_rgba(111,247,166,0.06)] [scrollbar-color:rgba(111,247,166,0.45)_rgba(10,20,16,0.8)] [scrollbar-width:thin] placeholder:text-[var(--color-soft)] focus:border-[var(--color-accent)] focus:shadow-[inset_0_0_0_1px_rgba(111,247,166,0.16),0_0_0_4px_rgba(111,247,166,0.06)] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:border-2 [&::-webkit-scrollbar-thumb]:border-transparent [&::-webkit-scrollbar-thumb]:bg-[linear-gradient(180deg,rgba(111,247,166,0.72),rgba(79,191,125,0.52))] [&::-webkit-scrollbar-thumb]:bg-clip-padding [&::-webkit-scrollbar-track]:border-l [&::-webkit-scrollbar-track]:border-[rgba(111,247,166,0.08)] [&::-webkit-scrollbar-track]:bg-[linear-gradient(180deg,rgba(8,16,12,0.96),rgba(5,11,8,0.96))] [&::-webkit-scrollbar]:w-[0.72rem] max-sm:min-h-[5.4rem] max-sm:px-[0.9rem] max-sm:py-[0.82rem] max-sm:text-[0.84rem] max-sm:leading-[1.58]";
const hintClass =
  "font-mono text-[0.58rem] uppercase tracking-[0.04em] text-[var(--color-soft)] max-sm:text-[0.54rem]";
const submitClass =
  "inline-flex min-w-[8.5rem] items-center justify-center self-end rounded-full border border-[var(--color-line-strong)] bg-[var(--color-accent)] px-4 py-[0.68rem] font-mono text-[0.66rem] uppercase tracking-[0.04em] tabular-nums text-[#041009] disabled:cursor-not-allowed disabled:opacity-70 max-sm:min-w-28 sm:text-[0.7rem]";
const typingClass = "mt-3 inline-flex gap-[0.32rem]";
const typingDotClass =
  "h-[0.42rem] w-[0.42rem] rounded-full bg-[var(--color-accent)] animate-[terminal-pulse_900ms_ease-in-out_infinite] motion-reduce:animate-none";

export default function ChatDemoView({
  chatEndRef,
  chatLogRef,
  copy,
  draft,
  isClosing,
  isOpen,
  isWaiting,
  messages,
  onClose,
  onDraftChange,
  onDraftKeyDown,
  onSubmit,
  onToggle,
  textareaRef,
}: ChatDemoViewProps) {
  const show = isOpen || isClosing;
  const stateClass = isClosing ? "is-closing" : isOpen ? "is-open" : "";

  return (
    <div className={widgetShellClass}>
      <button
        type="button"
        aria-label={copy.closeLabel}
        className={`${backdropClass} t-backdrop ${show ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />

      <section
        id="portfolio-chat-widget"
        aria-hidden={!isOpen}
        className={`${flyoutClass} t-modal ${stateClass}`}
      >
        <div className={windowBarClass}>
          <div className="flex items-center gap-2.5">
            <span className={`${windowDotClass} bg-[#ff5f56]`} />
            <span className={`${windowDotClass} bg-[#ffbd2e]`} />
            <span className={`${windowDotClass} bg-[#27c93f]`} />
            <span className="ml-4 text-[var(--color-soft)]">{copy.windowTitle}</span>
          </div>
          <button type="button" className={chromeButtonClass} onClick={onClose}>
            {copy.closeLabel}
          </button>
        </div>

        <div className="grid gap-4 p-4">
          <div ref={chatLogRef} className={chatLogClass}>
            {messages.length === 0 ? (
              <article
                className={`${bubbleBaseClass} justify-self-start rounded-tl-[0.55rem] rounded-tr-[1rem] rounded-br-[1rem] rounded-bl-[1rem] bg-[rgba(10,20,16,0.86)]`}
              >
                <p className={labelClass}>{copy.assistantName}</p>
                <p className={copyClass}>{copy.emptyState}</p>
              </article>
            ) : null}

            {messages.map((message) => {
              const isAssistant = message.role === "assistant";

              return (
                <article
                  key={message.id}
                  className={`${bubbleBaseClass} ${
                    isAssistant
                      ? "justify-self-start rounded-tl-[0.55rem] rounded-tr-[1rem] rounded-br-[1rem] rounded-bl-[1rem] bg-[rgba(10,20,16,0.86)]"
                      : "justify-self-end rounded-tl-[1rem] rounded-tr-[0.55rem] rounded-br-[1rem] rounded-bl-[1rem] bg-[rgba(111,247,166,0.11)] text-left"
                  }`}
                >
                  <p className={labelClass}>
                    {isAssistant ? copy.assistantName : copy.userName}
                  </p>
                  <p className={copyClass}>{message.text}</p>
                </article>
              );
            })}

            {isWaiting ? (
              <article
                className={`${bubbleBaseClass} justify-self-start rounded-tl-[0.55rem] rounded-tr-[1rem] rounded-br-[1rem] rounded-bl-[1rem] bg-[rgba(10,20,16,0.86)]`}
              >
                <p className={labelClass}>{copy.assistantName}</p>
                <div className={typingClass} aria-hidden="true">
                  <span className={typingDotClass} />
                  <span className={`${typingDotClass} [animation-delay:120ms]`} />
                  <span className={`${typingDotClass} [animation-delay:240ms]`} />
                </div>
              </article>
            ) : null}

            <div ref={chatEndRef} aria-hidden="true" />
          </div>
          <form
            className={formClass}
            onSubmit={(event) => {
              event.preventDefault();
              onSubmit();
            }}
          >
            <label className="sr-only" htmlFor="chat-draft">
              {copy.inputPlaceholder}
            </label>
            <textarea
              id="chat-draft"
              ref={textareaRef}
              value={draft}
              rows={3}
              placeholder={copy.inputPlaceholder}
              className={inputClass}
              onChange={(event) => {
                onDraftChange(event.target.value);
              }}
              onKeyDown={onDraftKeyDown}
            />
            <div className="flex items-center justify-between gap-3">
              <p className={hintClass}>
                Enter = send
                <span className="mx-1 text-[var(--color-line-strong)]">/</span>
                Shift+Enter = new line
              </p>
              <button type="submit" className={submitClass} disabled={isWaiting}>
                {copy.sendLabel}
              </button>
            </div>
          </form>
        </div>
      </section>

      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls="portfolio-chat-widget"
        onClick={onToggle}
        className={`inline-flex items-center gap-[0.58rem] sm:gap-[0.8rem] min-w-[6.2rem] sm:min-w-34 rounded-full border bg-linear-to-b from-[rgba(10,20,16,0.96)] to-[rgba(6,12,9,0.96)] py-[0.48rem] px-[0.62rem] sm:py-[0.62rem] sm:px-[0.8rem] text-foreground shadow-[0_16px_44px_rgba(0,0,0,0.32)] transition-[border-color,color,box-shadow] duration-150 motion-reduce:transition-none hover:border-(--color-accent) hover:text-(--color-accent) hover:shadow-[0_18px_52px_rgba(0,0,0,0.38)] ${
          isOpen
            ? "border-(--color-accent) shadow-[0_18px_52px_rgba(0,0,0,0.38),0_0_0_1px_rgba(111,247,166,0.12)]"
            : "border-(--color-line-strong)"
        }`}
      >
        <span
          aria-hidden="true"
          className="shrink-0 w-[0.66rem] h-[0.66rem] sm:w-[0.78rem] sm:h-[0.78rem] rounded-full bg-(--color-accent) shadow-[0_0_0_0_rgba(111,247,166,0.4)] animate-[terminal-launcher-ping_1600ms_ease_infinite] motion-reduce:animate-none"
        />
        <span className="grid gap-[0.12rem] sm:gap-[0.18rem] text-left">
          <span className="font-mono text-[0.4rem] tabular-nums uppercase tracking-[0.06em] text-(--color-soft)">
            {copy.launcherLabel}
          </span>
          <span className="text-[0.6rem] sm:text-sm font-semibold text-foreground">
            {isOpen ? copy.closeLabel : copy.openLabel}
          </span>
        </span>
      </button>
    </div>
  );
}

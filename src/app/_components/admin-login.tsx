"use client";

import { useState, useTransition } from "react";

import type { adminDirectoryCopy } from "../_data/admin";
import type { Locale } from "../_data/portfolio";

type AdminCopy = (typeof adminDirectoryCopy)[Locale];

export default function AdminLogin({
  locale,
  copy,
}: {
  locale: Locale;
  copy: AdminCopy;
}) {
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSigningIn, startSigningIn] = useTransition();

  const pageShellClass =
    "min-h-screen bg-[var(--color-bg)] px-5 py-8 text-[var(--color-text)] sm:px-8 sm:py-10";
  const panelClass =
    "rounded-[1.45rem] border border-[var(--color-line-strong)] bg-[linear-gradient(180deg,rgba(10,20,16,0.96),rgba(6,12,9,0.96))] p-5 shadow-[inset_0_0_0_1px_rgba(111,247,166,0.04)] sm:p-6";
  const titleClass =
    '[font-family:var(--font-kanit),"Segoe_UI",sans-serif] text-[clamp(2rem,4vw,3.6rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-balance';
  const bodyClass =
    "text-[0.88rem] leading-[1.85] text-[var(--color-muted)] sm:text-[0.92rem]";
  const labelClass =
    "font-mono text-[0.62rem] uppercase tracking-[0.06em] tabular-nums text-[var(--color-soft)]";
  const inputClass =
    "mt-2 w-full rounded-[1rem] border border-[var(--color-line)] bg-[rgba(6,12,9,0.82)] px-3.5 py-3 text-sm text-[var(--color-text)] outline-none transition-colors placeholder:text-[var(--color-soft)] focus:border-[var(--color-line-strong)]";

  function signIn() {
    const email = emailInput.trim().toLowerCase();
    const password = passwordInput.trim();

    if (!email || !password) {
      setStatusMessage(copy.authRequiredMessage);
      return;
    }

    startSigningIn(async () => {
      try {
        const response = await fetch("/api/admin/session", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        });

        const payload = (await response.json()) as
          | {
              ok: true;
              data: {
                authenticated: boolean;
              };
            }
          | {
              ok: false;
              error: {
                message: string;
              };
            };

        if (!response.ok || !payload.ok) {
          setStatusMessage(
            !payload.ok && response.status === 401
              ? copy.authInvalidMessage
              : !payload.ok
                ? payload.error.message
                : copy.requestFailedLabel,
          );
          return;
        }

        window.location.assign(`/${locale}/admin`);
      } catch {
        setStatusMessage(copy.requestFailedLabel);
      }
    });
  }

  return (
    <main lang={locale} className={pageShellClass}>
      <div className="mx-auto max-w-4xl">
        <section className={panelClass}>
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-[var(--color-line-strong)] px-3 py-1 font-mono text-[0.66rem] uppercase tabular-nums text-[var(--color-accent)]">
              /admin/login
            </span>
            <a
              href={`/${locale}`}
              className="rounded-full border border-[var(--color-line)] px-3 py-1 font-mono text-[0.66rem] uppercase tabular-nums text-[var(--color-text)] transition-opacity duration-150 ease-out hover:opacity-80"
            >
              {copy.backToPortfolioLabel}
            </a>
          </div>

          <div className="mt-6 max-w-3xl space-y-4 border-b border-[var(--color-line)] pb-6">
            <p className={labelClass}>{copy.authPanelLabel}</p>
            <h1 className={titleClass}>{copy.authTitle}</h1>
            <p className={`${bodyClass} text-pretty`}>{copy.authDescription}</p>
          </div>

          <div className="mt-6 max-w-xl">
            <label htmlFor="admin-email" className={labelClass}>
              {copy.emailLoginLabel}
            </label>
            <input
              id="admin-email"
              type="email"
              value={emailInput}
              onChange={(event) => setEmailInput(event.target.value)}
              placeholder={copy.emailLoginPlaceholder}
              className={inputClass}
            />

            <label htmlFor="admin-password" className={labelClass}>
              {copy.passwordLabel}
            </label>
            <input
              id="admin-password"
              type="password"
              value={passwordInput}
              onChange={(event) => setPasswordInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  signIn();
                }
              }}
              placeholder={copy.passwordPlaceholder}
              className={inputClass}
            />

            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={signIn}
                disabled={isSigningIn}
                className="inline-flex items-center justify-center rounded-full border border-[var(--color-line-strong)] bg-[var(--color-accent)] px-4 py-2 font-mono text-[0.7rem] uppercase tracking-[0.04em] text-[#041009] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSigningIn ? copy.signingInLabel : copy.signInLabel}
              </button>
            </div>

            {statusMessage ? (
              <p className="mt-4 text-sm text-[var(--color-accent)]">{statusMessage}</p>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}

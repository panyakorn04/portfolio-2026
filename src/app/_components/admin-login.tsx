"use client";

import { useState, useTransition } from "react";

import type { adminDirectoryCopy } from "../_data/admin";
import {
  bodyClass,
  eyeClass,
  glassPanelClass,
  inputClass,
  labelClass,
} from "../_data/admin-styles";
import type { Locale } from "../_data/portfolio";
import { Button, buttonBase, buttonSizes, buttonVariants } from "./button";

type AdminCopy = (typeof adminDirectoryCopy)[Locale];

const titleClass =
  '[font-family:var(--font-display),"Segoe_UI",sans-serif] text-[clamp(2rem,4vw,3.6rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-balance';
const localInputClass = `mt-2 ${inputClass}`;

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
    <main
      lang={locale}
      className="relative min-h-screen overflow-x-clip bg-[var(--color-bg)] text-[var(--color-text)]"
    >
      <div className="ambient" aria-hidden="true" />
      <div className="relative z-10 mx-auto max-w-4xl px-5 py-8 sm:px-8 sm:py-10">
        <section className={glassPanelClass}>
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-[var(--color-line-strong)] bg-[var(--accent-dim)] px-3 py-1 font-mono text-[0.66rem] uppercase tracking-[0.06em] tabular-nums text-[var(--color-accent)]">
              /admin/login
            </span>
            <a
              href={`/${locale}`}
              className={`${buttonBase} ${buttonVariants.ghost} ${buttonSizes.xs}`}
            >
              {copy.backToPortfolioLabel}
            </a>
          </div>

          <div className="mt-6 max-w-3xl space-y-4 border-b border-[var(--color-line)] pb-6">
            <p className={eyeClass}>{copy.authPanelLabel}</p>
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
              className={localInputClass}
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
              className={localInputClass}
            />

            <div className="mt-4 flex flex-wrap gap-3">
              <Button variant="primary" size="md" onClick={signIn} disabled={isSigningIn}>
                {isSigningIn ? copy.signingInLabel : copy.signInLabel}
              </Button>
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

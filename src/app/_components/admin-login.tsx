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
  '[font-family:var(--font-display),"Segoe_UI",sans-serif] text-[clamp(2.25rem,6vw,4.75rem)] font-medium leading-[0.96] tracking-[-0.055em] text-balance';
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
      className="relative flex min-h-dvh overflow-x-clip bg-[#070908] text-[var(--color-text)]"
    >
      <div className="ambient" aria-hidden="true" />
      <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-8 px-5 py-8 sm:px-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(22rem,0.72fr)] lg:gap-14 lg:py-14">
        <header className="max-w-2xl lg:pr-8">
          <div className="flex flex-wrap items-center gap-3 border-b border-[var(--color-line)] pb-5">
            <span className="border-l-2 border-[var(--color-accent)] pl-3 font-mono text-[0.66rem] uppercase tracking-[0.12em] tabular-nums text-[var(--color-accent)]">
              /admin/login
            </span>
            <a
              href={`/${locale}`}
              className={`${buttonBase} ${buttonVariants.ghost} ${buttonSizes.xs}`}
            >
              {copy.backToPortfolioLabel}
            </a>
          </div>

          <div className="mt-10 space-y-5">
            <p className={eyeClass}>{copy.authPanelLabel}</p>
            <h1 className={titleClass}>{copy.authTitle}</h1>
            <p className={`${bodyClass} text-pretty`}>{copy.authDescription}</p>
          </div>
        </header>

        <section className={`${glassPanelClass} w-full`}>
          <div className="mb-7 border-b border-[var(--color-line)] pb-4">
            <p className={eyeClass}>{copy.authPanelLabel}</p>
          </div>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              signIn();
            }}
          >
            <label htmlFor="admin-email" className={labelClass}>
              {copy.emailLoginLabel}
            </label>
            <input
              id="admin-email"
              type="email"
              value={emailInput}
              onChange={(event) => setEmailInput(event.target.value)}
              placeholder={copy.emailLoginPlaceholder}
              autoComplete="email"
              required
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
              placeholder={copy.passwordPlaceholder}
              autoComplete="current-password"
              required
              className={localInputClass}
            />

            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={isSigningIn}
                className="min-h-11 w-full rounded-[0.25rem]"
              >
                {isSigningIn ? copy.signingInLabel : copy.signInLabel}
              </Button>
            </div>

            {statusMessage ? (
              <p
                role="alert"
                className="mt-4 border-l-2 border-[var(--color-accent)] bg-[var(--accent-dim)] px-3 py-2 text-sm text-[var(--color-text)]"
              >
                {statusMessage}
              </p>
            ) : null}
          </form>
        </section>
      </div>
    </main>
  );
}

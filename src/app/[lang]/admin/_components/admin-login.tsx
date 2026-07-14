"use client";

import { useState, useTransition } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  adminBodyClass as bodyClass,
  adminEyeClass as eyeClass,
} from "@/components/ui/typography";
import type { Locale, PortfolioDictionary } from "@/lib/portfolio";

type AdminCopy = PortfolioDictionary["adminWorkspace"];

const titleClass =
  '[font-family:var(--font-display),"Segoe_UI",sans-serif] text-[clamp(2.25rem,6vw,4.75rem)] font-medium leading-[0.96] tracking-[-0.055em] text-balance';

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
              className={buttonVariants({ variant: "ghost", size: "xs" })}
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

        <Card className="w-full">
          <CardHeader>
            <p className={eyeClass}>{copy.authPanelLabel}</p>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                signIn();
              }}
              className="space-y-4"
            >
              <div className="space-y-1.5">
                <Label htmlFor="admin-email">{copy.emailLoginLabel}</Label>
                <Input
                  id="admin-email"
                  type="email"
                  value={emailInput}
                  onChange={(event) => setEmailInput(event.target.value)}
                  placeholder={copy.emailLoginPlaceholder}
                  autoComplete="email"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="admin-password">{copy.passwordLabel}</Label>
                <Input
                  id="admin-password"
                  type="password"
                  value={passwordInput}
                  onChange={(event) => setPasswordInput(event.target.value)}
                  placeholder={copy.passwordPlaceholder}
                  autoComplete="current-password"
                  required
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={isSigningIn}
                className="w-full"
              >
                {isSigningIn ? copy.signingInLabel : copy.signInLabel}
              </Button>

              {statusMessage ? (
                <p
                  role="alert"
                  className="mt-4 border-l-2 border-[var(--color-accent)] bg-[var(--accent-dim)] px-3 py-2 text-sm text-[var(--color-text)]"
                >
                  {statusMessage}
                </p>
              ) : null}
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

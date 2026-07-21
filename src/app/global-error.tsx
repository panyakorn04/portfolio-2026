"use client";

import { useEffect } from "react";
import { posthog } from "../lib/posthog-client";

import "./globals.css";
import {
  errorLinkClass,
  fontDisplayClass,
  formLabel,
  glassCardClass,
  pageShellClass,
} from "../components/ui/typography";
import { jetbrainsMono, kanit, spaceGrotesk } from "../lib/fonts";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
    posthog.captureException(error);
  }, [error]);

  const panelClass = `mx-auto max-w-2xl ${glassCardClass}`;
  const bodyClass = "text-[0.9rem] leading-[1.85] text-[var(--color-muted)]";

  return (
    <html
      lang="en"
      className={`${kanit.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <main className={pageShellClass}>
          <div className={panelClass} role="alert">
            <p className={formLabel}>500 · application error</p>
            <h1
              className={`${fontDisplayClass} mt-4 text-[clamp(1.8rem,4vw,3rem)] font-semibold leading-[1.05] tracking-[-0.04em] text-balance`}
            >
              An unexpected error occurred.
            </h1>
            <p className={`${bodyClass} mt-3`}>เกิดข้อผิดพลาดที่ไม่คาดคิด กรุณาลองใหม่อีกครั้ง</p>
            {error.digest ? (
              <p className={`${formLabel} mt-4`}>digest: {error.digest}</p>
            ) : null}
            <div className="mt-6">
              <button type="button" onClick={reset} className={errorLinkClass}>
                Try again · ลองอีกครั้ง
              </button>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}

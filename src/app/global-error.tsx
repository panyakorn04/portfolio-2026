"use client";

import { useEffect } from "react";

import "./globals.css";
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
  }, [error]);

  return (
    <html
      lang="en"
      className={`${kanit.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <main className="min-h-screen bg-[var(--color-bg)] px-5 py-8 text-[var(--color-text)] sm:px-8 sm:py-10">
          <div
            className="mx-auto max-w-2xl rounded-[1.45rem] border border-[var(--color-line-strong)] bg-[linear-gradient(180deg,rgba(10,20,16,0.96),rgba(6,12,9,0.96))] p-6 shadow-[inset_0_0_0_1px_rgba(111,247,166,0.04)] sm:p-8"
            role="alert"
          >
            <p className="font-mono text-[0.62rem] uppercase tracking-[0.06em] tabular-nums text-[var(--color-soft)]">
              500 · application error
            </p>
            <h1 className='mt-4 [font-family:var(--font-display),"Segoe_UI",sans-serif] text-[clamp(1.8rem,4vw,3rem)] font-semibold leading-[1.05] tracking-[-0.04em] text-balance'>
              An unexpected error occurred.
            </h1>
            <p className="mt-3 text-[0.9rem] leading-[1.85] text-[var(--color-muted)]">
              เกิดข้อผิดพลาดที่ไม่คาดคิด กรุณาลองใหม่อีกครั้ง
            </p>
            {error.digest ? (
              <p className="mt-4 font-mono text-[0.62rem] uppercase tracking-[0.06em] tabular-nums text-[var(--color-soft)]">
                digest: {error.digest}
              </p>
            ) : null}
            <div className="mt-6">
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--color-line-strong)] px-4 py-2 font-mono text-[0.7rem] uppercase tracking-[0.06em] text-[var(--color-accent)] transition-colors hover:bg-[rgba(111,247,166,0.06)]"
              >
                Try again · ลองอีกครั้ง
              </button>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}

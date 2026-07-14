"use client";

import { useState } from "react";
import type { Locale, PortfolioDictionary } from "../lib/portfolio";
import AdminArticles from "./admin-articles";
import AdminContactInquiries from "./admin-contact-inquiries";
import { Button } from "./ui/button";
import {
  adminBodyClass as bodyClass,
  adminEyeClass as eyeClass,
  glassPanelClass,
} from "./ui/typography";

type Tab = "inquiries" | "articles";

export default function AdminWorkspace({
  locale,
  contactCopy,
  articlesCopy,
}: {
  locale: Locale;
  contactCopy: PortfolioDictionary["adminWorkspace"];
  articlesCopy: PortfolioDictionary["adminArticles"];
}) {
  const [tab, setTab] = useState<Tab>("inquiries");

  return (
    <main
      lang={locale}
      className="relative min-h-dvh overflow-x-clip bg-[#070908] text-[var(--color-text)] [&_button]:min-h-11 [&_button]:focus-visible:outline-2 [&_button]:focus-visible:outline-offset-2 [&_button]:focus-visible:outline-[var(--color-accent)]"
    >
      <div className="ambient" aria-hidden="true" />
      <div className="relative z-10 mx-auto max-w-[92rem] space-y-5 px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
        <section className={glassPanelClass}>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-line)] pb-4">
            <span className="border-l-2 border-[var(--color-accent)] pl-3 font-mono text-[0.66rem] uppercase tracking-[0.12em] tabular-nums text-[var(--color-accent)]">
              /admin
            </span>
            <a
              href={`/${locale}`}
              className="font-mono text-[0.66rem] uppercase tracking-[0.1em] text-[var(--color-soft)] transition-colors hover:text-[var(--color-accent)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-accent)]"
            >
              {contactCopy.backToPortfolioLabel}
            </a>
          </div>

          <div className="mt-7 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.55fr)] lg:items-end">
            <div className="space-y-3">
              <p className={eyeClass}>{contactCopy.eyebrow}</p>
              <h1 className="[font-family:var(--font-display),sans-serif] text-[clamp(2rem,4vw,3.75rem)] font-medium leading-[0.98] tracking-[-0.05em] text-balance text-[var(--color-text)]">
                {contactCopy.title}
              </h1>
            </div>
            <p
              className={`${bodyClass} text-pretty lg:border-l lg:border-[var(--color-line)] lg:pl-6`}
            >
              {contactCopy.description}
            </p>
          </div>

          <div
            role="tablist"
            aria-label={contactCopy.navLabel}
            className="mt-7 flex border-t border-[var(--color-line)] pt-4"
          >
            <Button
              variant={tab === "inquiries" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setTab("inquiries")}
              role="tab"
              aria-selected={tab === "inquiries"}
              className="min-h-11 rounded-[0.25rem]"
            >
              {articlesCopy.tabContactLabel}
            </Button>
            <Button
              variant={tab === "articles" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setTab("articles")}
              role="tab"
              aria-selected={tab === "articles"}
              className="min-h-11 rounded-[0.25rem]"
            >
              {articlesCopy.tabArticlesLabel}
            </Button>
          </div>
        </section>

        {tab === "inquiries" ? (
          <AdminContactInquiries locale={locale} copy={contactCopy} />
        ) : (
          <AdminArticles locale={locale} copy={articlesCopy} />
        )}
      </div>
    </main>
  );
}

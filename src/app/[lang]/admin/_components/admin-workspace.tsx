"use client";

import { useState } from "react";
import {
  adminBodyClass as bodyClass,
  adminEyeClass as eyeClass,
  glassCompactPanelClass,
  glassPanelClass,
  adminLabelClass as labelClass,
} from "@/components/ui/typography";
import type { Locale, PortfolioDictionary } from "@/lib/portfolio";
import AdminArticles from "./admin-articles";
import AdminChatTab from "./admin-chat-tab";
import AdminContactInquiries from "./admin-contact-inquiries";

type Tab = "inquiries" | "articles" | "chat";

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

  const tabLabel: Record<Tab, string> = {
    inquiries: articlesCopy.tabContactLabel,
    articles: articlesCopy.tabArticlesLabel,
    chat: articlesCopy.tabChatLabel,
  };

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
                {tabLabel[tab]}
              </h1>
            </div>
            <p
              className={`${bodyClass} text-pretty lg:border-l lg:border-[var(--color-line)] lg:pl-6`}
            >
              {contactCopy.description}
            </p>
          </div>
        </section>

        <div className="grid gap-5 lg:grid-cols-[12rem_minmax(0,1fr)]">
          <aside>
            <nav className={glassCompactPanelClass}>
              <div className="border-b border-[var(--color-line)] px-4 py-3">
                <p className={labelClass}>Menu</p>
              </div>
              <div className="divide-y divide-[var(--color-line)]">
                {[
                  { id: "inquiries" as const, label: articlesCopy.tabContactLabel },
                  { id: "articles" as const, label: articlesCopy.tabArticlesLabel },
                  { id: "chat" as const, label: articlesCopy.tabChatLabel },
                ].map((item) => {
                  const isActive = tab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setTab(item.id)}
                      role="tab"
                      aria-selected={isActive}
                      className={`w-full px-4 py-3.5 text-left font-mono text-[0.72rem] uppercase tracking-[0.08em] transition-colors ${
                        isActive
                          ? "border-l-2 border-[var(--color-accent)] bg-[rgba(111,247,166,0.08)] text-[var(--color-accent)]"
                          : "border-l-2 border-transparent text-[var(--color-soft)] hover:text-[var(--color-text)] hover:bg-[#090b0a]"
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </nav>
          </aside>

          <div className="min-w-0">
            {tab === "inquiries" ? (
              <AdminContactInquiries locale={locale} copy={contactCopy} />
            ) : tab === "articles" ? (
              <AdminArticles locale={locale} copy={articlesCopy} />
            ) : (
              <AdminChatTab locale={locale} copy={contactCopy} />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

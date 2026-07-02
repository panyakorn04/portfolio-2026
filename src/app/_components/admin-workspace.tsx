"use client";

import { useState } from "react";

import type { adminDirectoryCopy } from "../_data/admin";
import type { adminArticlesCopy } from "../_data/admin-articles";
import { bodyClass, eyeClass, glassPanelClass } from "../_data/admin-styles";
import type { Locale } from "../_data/portfolio";
import AdminArticles from "./admin-articles";
import AdminContactInquiries from "./admin-contact-inquiries";
import { Button } from "./button";

type Tab = "inquiries" | "articles";

export default function AdminWorkspace({
  locale,
  contactCopy,
  articlesCopy,
}: {
  locale: Locale;
  contactCopy: (typeof adminDirectoryCopy)[Locale];
  articlesCopy: (typeof adminArticlesCopy)[Locale];
}) {
  const [tab, setTab] = useState<Tab>("inquiries");

  return (
    <main
      lang={locale}
      className="relative min-h-screen overflow-x-clip bg-[var(--color-bg)] text-[var(--color-text)]"
    >
      <div className="ambient" aria-hidden="true" />
      <div className="relative z-10 mx-auto max-w-7xl space-y-6 px-5 py-8 sm:px-8 sm:py-10">
        <section className={glassPanelClass}>
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-[var(--color-line-strong)] bg-[var(--accent-dim)] px-3 py-1 font-mono text-[0.66rem] uppercase tracking-[0.06em] tabular-nums text-[var(--color-accent)]">
              /admin
            </span>
          </div>

          <div className="mt-6 max-w-4xl space-y-4 border-b border-[var(--color-line)] pb-6">
            <p className={eyeClass}>{contactCopy.eyebrow}</p>
            <h1 className="[font-family:var(--font-display),sans-serif] text-[clamp(1.8rem,3.5vw,2.6rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-balance text-[var(--color-text)]">
              {contactCopy.title}
            </h1>
            <p className={`${bodyClass} max-w-3xl text-pretty`}>
              {contactCopy.description}
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <Button
              variant={tab === "inquiries" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setTab("inquiries")}
            >
              {articlesCopy.tabContactLabel}
            </Button>
            <Button
              variant={tab === "articles" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setTab("articles")}
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

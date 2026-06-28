"use client";

import { useState } from "react";

import type { adminDirectoryCopy } from "../_data/admin";
import type { adminArticlesCopy } from "../_data/admin-articles";
import type { Locale } from "../_data/portfolio";
import AdminArticles from "./admin-articles";
import AdminContactInquiries from "./admin-contact-inquiries";

type Tab = "inquiries" | "articles";

const tabBaseClass =
  "rounded-full border px-4 py-1.5 font-mono text-[0.66rem] uppercase tracking-[0.04em] transition-opacity duration-150";

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
    <div className="space-y-6">
      <div className="mx-auto flex max-w-6xl flex-wrap gap-2 px-5 pt-8 sm:px-8">
        <button
          type="button"
          className={`${tabBaseClass} ${
            tab === "inquiries"
              ? "border-[var(--color-line-strong)] bg-[var(--color-accent)] text-[#041009]"
              : "border-[var(--color-line)] text-[var(--color-text)] hover:opacity-80"
          }`}
          onClick={() => setTab("inquiries")}
        >
          {articlesCopy.tabContactLabel}
        </button>
        <button
          type="button"
          className={`${tabBaseClass} ${
            tab === "articles"
              ? "border-[var(--color-line-strong)] bg-[var(--color-accent)] text-[#041009]"
              : "border-[var(--color-line)] text-[var(--color-text)] hover:opacity-80"
          }`}
          onClick={() => setTab("articles")}
        >
          {articlesCopy.tabArticlesLabel}
        </button>
      </div>

      {tab === "inquiries" ? (
        <AdminContactInquiries locale={locale} copy={contactCopy} />
      ) : (
        <div className="mx-auto max-w-6xl px-5 pb-10 sm:px-8">
          <AdminArticles locale={locale} copy={articlesCopy} />
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";

import type { adminDirectoryCopy } from "../_data/admin";
import type { adminArticlesCopy } from "../_data/admin-articles";
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
    <div className="space-y-6">
      <div className="mx-auto flex max-w-6xl flex-wrap gap-2 px-5 pt-8 sm:px-8">
        <Button
          variant={tab === "inquiries" ? "primary" : "ghost"}
          size="xs"
          onClick={() => setTab("inquiries")}
        >
          {articlesCopy.tabContactLabel}
        </Button>
        <Button
          variant={tab === "articles" ? "primary" : "ghost"}
          size="xs"
          onClick={() => setTab("articles")}
        >
          {articlesCopy.tabArticlesLabel}
        </Button>
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

"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState, useTransition } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  adminFieldErrorClass,
  glassCompactPanelClass,
  adminLabelClass as labelClass,
} from "@/components/ui/typography";
import type { Locale, PortfolioDictionary } from "@/lib/portfolio";

const MdxEditorField = dynamic(() => import("./admin-mdx-editor"), { ssr: false });

type ArticleStatus = "draft" | "published";

type ArticleTranslation = {
  locale: "en" | "th";
  title: string;
  summary: string;
  lead: string;
  readingTime: string;
  content: string;
};

type ArticleRecord = {
  id: string;
  slug: string;
  category: string;
  status: ArticleStatus;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  translations: ArticleTranslation[];
};

type ArticleListResponse = {
  items: ArticleRecord[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

type ErrorDetail = { field: string; message: string };

type DraftTranslation = {
  title: string;
  summary: string;
  lead: string;
  readingTime: string;
  content: string;
};

type DraftArticle = {
  id: string | null;
  slug: string;
  category: string;
  status: ArticleStatus;
  translations: Record<"en" | "th", DraftTranslation>;
};

const panelClass = `${glassCompactPanelClass} p-4 sm:p-5 lg:p-6`;

function emptyTranslation(): DraftTranslation {
  return {
    title: "",
    summary: "",
    lead: "",
    readingTime: "",
    content: "",
  };
}

function emptyDraft(): DraftArticle {
  return {
    id: null,
    slug: "",
    category: "",
    status: "draft",
    translations: {
      en: emptyTranslation(),
      th: emptyTranslation(),
    },
  };
}

function toDraft(article: ArticleRecord): DraftArticle {
  const find = (locale: "en" | "th"): DraftTranslation => {
    const translation = article.translations.find((item) => item.locale === locale);
    if (!translation) {
      return emptyTranslation();
    }
    return {
      title: translation.title,
      summary: translation.summary,
      lead: translation.lead,
      readingTime: translation.readingTime,
      content: translation.content,
    };
  };

  return {
    id: article.id,
    slug: article.slug,
    category: article.category,
    status: article.status,
    translations: {
      en: find("en"),
      th: find("th"),
    },
  };
}

function redirectToAdminLogin(locale: Locale) {
  window.location.assign(`/${locale}/admin/login`);
}

export default function AdminArticles({
  locale,
  copy,
}: {
  locale: Locale;
  copy: PortfolioDictionary["adminArticles"];
}) {
  const [articles, setArticles] = useState<ArticleRecord[]>([]);
  const [statusFilter, setStatusFilter] = useState<ArticleStatus | "all">("all");
  const [searchInput, setSearchInput] = useState("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<ErrorDetail[]>([]);
  const [draft, setDraft] = useState<DraftArticle | null>(null);
  const [activeLocale, setActiveLocale] = useState<"en" | "th">("en");
  const [isLoading, startLoading] = useTransition();
  const [isSaving, startSaving] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  // biome-ignore lint/correctness/useExhaustiveDependencies: copy/locale stable; reloadToken intentionally re-triggers fetch
  useEffect(() => {
    startLoading(async () => {
      try {
        const searchParams = new URLSearchParams({ status: statusFilter, limit: "100" });
        const query = searchInput.trim();
        if (query) {
          searchParams.set("query", query);
        }

        const response = await fetch(`/api/admin/articles?${searchParams.toString()}`, {
          cache: "no-store",
        });
        const payload = (await response.json()) as
          | { ok: true; data: ArticleListResponse }
          | { ok: false; error: { message: string } };

        if (!response.ok || !payload.ok) {
          if (response.status === 401 || response.status === 403) {
            redirectToAdminLogin(locale);
            return;
          }
          setStatusMessage(payload.ok ? copy.requestFailedLabel : payload.error.message);
          return;
        }

        setArticles(payload.data.items);
      } catch {
        setStatusMessage(copy.requestFailedLabel);
      }
    });
  }, [statusFilter, searchInput, reloadToken]);

  const statusOptions = useMemo(
    () =>
      [
        { value: "all", label: copy.statusAllLabel },
        { value: "draft", label: copy.statusDraftLabel },
        { value: "published", label: copy.statusPublishedLabel },
      ] as const,
    [copy],
  );

  function fieldError(field: string) {
    return errorDetails.find((detail) => detail.field === field)?.message ?? null;
  }

  function updateTranslation(
    field: keyof Omit<DraftTranslation, "sections">,
    value: string,
  ) {
    setDraft((current) =>
      current
        ? {
            ...current,
            translations: {
              ...current.translations,
              [activeLocale]: {
                ...current.translations[activeLocale],
                [field]: value,
              },
            },
          }
        : current,
    );
  }

  function saveDraft() {
    if (!draft) {
      return;
    }

    startSaving(async () => {
      setErrorDetails([]);
      setStatusMessage(null);

      const body = {
        slug: draft.slug.trim() || undefined,
        category: draft.category,
        status: draft.status,
        translations: (["en", "th"] as const).map((loc) => ({
          locale: loc,
          ...draft.translations[loc],
        })),
      };

      try {
        const response = await fetch(
          draft.id ? `/api/admin/articles/${draft.id}` : "/api/admin/articles",
          {
            method: draft.id ? "PATCH" : "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(body),
          },
        );
        const payload = (await response.json()) as
          | { ok: true; data: ArticleRecord }
          | { ok: false; error: { message: string; details?: ErrorDetail[] } };

        if (!response.ok || !payload.ok) {
          if (response.status === 401 || response.status === 403) {
            redirectToAdminLogin(locale);
            return;
          }
          if (!payload.ok) {
            setErrorDetails(payload.error.details ?? []);
            setStatusMessage(
              (payload.error.details?.length ?? 0) > 0
                ? copy.validationFailedLabel
                : payload.error.message,
            );
          }
          return;
        }

        setStatusMessage(draft.id ? copy.updatedMessage : copy.createdMessage);
        setDraft(null);
        setReloadToken((token) => token + 1);
      } catch {
        setStatusMessage(copy.requestFailedLabel);
      }
    });
  }

  function deleteArticle(id: string) {
    if (!window.confirm(copy.confirmDeleteLabel)) {
      return;
    }

    setDeletingId(id);
    startSaving(async () => {
      try {
        const response = await fetch(`/api/admin/articles/${id}`, {
          method: "DELETE",
        });
        const payload = (await response.json()) as
          | { ok: true }
          | { ok: false; error: { message: string } };

        if (!response.ok || !payload.ok) {
          if (response.status === 401 || response.status === 403) {
            redirectToAdminLogin(locale);
            return;
          }
          setStatusMessage(payload.ok ? copy.requestFailedLabel : payload.error.message);
          return;
        }

        setStatusMessage(copy.deletedMessage);
        if (draft?.id === id) {
          setDraft(null);
        }
        setReloadToken((token) => token + 1);
      } catch {
        setStatusMessage(copy.requestFailedLabel);
      } finally {
        setDeletingId(null);
      }
    });
  }

  const activeTranslation = draft?.translations[activeLocale] ?? null;

  return (
    <div className="space-y-5">
      <section className={panelClass}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className={labelClass}>{copy.panelLabel}</p>
            <h2 className="mt-2 [font-family:var(--font-display),sans-serif] text-[clamp(1.5rem,3vw,2.35rem)] font-medium tracking-[-0.035em] text-[var(--color-text)]">
              {copy.title}
            </h2>
            <p className="mt-2 max-w-2xl text-[0.86rem] leading-relaxed text-[var(--color-muted)]">
              {copy.description}
            </p>
          </div>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              setErrorDetails([]);
              setStatusMessage(null);
              setActiveLocale("en");
              setDraft(emptyDraft());
            }}
          >
            {copy.newArticleLabel}
          </Button>
        </div>

        {statusMessage ? (
          <p
            role="status"
            className="mt-4 border-l-2 border-[var(--color-accent)] bg-[var(--accent-dim)] px-3 py-2 text-[0.8rem] text-[var(--color-text)]"
          >
            {statusMessage}
          </p>
        ) : null}

        <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto]">
          <div className="space-y-1.5">
            <Label>{copy.searchLabel}</Label>
            <Input
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder={copy.searchPlaceholder}
            />
          </div>
          <div className="space-y-1.5">
            <Label>{copy.statusFilterLabel}</Label>
            <select
              className="flex h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 md:text-sm dark:bg-input/30"
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as ArticleStatus | "all")
              }
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className={panelClass}>
        <div className="flex items-center justify-between gap-3">
          <p className={labelClass}>{copy.listLabel}</p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setReloadToken((token) => token + 1)}
          >
            {isLoading ? copy.loadingLabel : copy.refreshLabel}
          </Button>
        </div>

        {articles.length === 0 ? (
          <p className="mt-5 text-[0.86rem] text-[var(--color-muted)]">
            {isLoading ? copy.loadingLabel : copy.emptyLabel}
          </p>
        ) : (
          <div className="mt-5 divide-y divide-[var(--color-line)] border-y border-[var(--color-line)]">
            {articles.map((article) => {
              const headline =
                article.translations.find((item) => item.locale === locale)?.title ??
                article.translations[0]?.title ??
                article.slug;

              return (
                <article
                  key={article.id}
                  className="bg-[#090b0a] px-3 py-4 transition-colors hover:bg-[#0c100d] sm:px-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`border-l-2 px-2 py-1 font-mono text-[0.6rem] uppercase ${
                            article.status === "published"
                              ? "border-[var(--color-accent)] text-[var(--color-accent)]"
                              : "border-[var(--color-line)] text-[var(--color-soft)]"
                          }`}
                        >
                          {article.status === "published"
                            ? copy.statusPublishedLabel
                            : copy.statusDraftLabel}
                        </span>
                        <span className="border border-[var(--color-line)] px-2.5 py-1 font-mono text-[0.6rem] uppercase text-[var(--color-soft)]">
                          {article.category}
                        </span>
                      </div>
                      <h3 className="mt-2 break-words text-[1.02rem] font-semibold text-[var(--color-text)]">
                        {headline}
                      </h3>
                      <p className="mt-1 font-mono text-[0.66rem] text-[var(--color-soft)]">
                        /{article.slug}
                      </p>
                    </div>

                    <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:shrink-0 sm:justify-end">
                      {article.status === "published" ? (
                        <a
                          className={buttonVariants({ variant: "ghost", size: "sm" })}
                          href={`/${locale}/articles/${article.slug}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {copy.viewPublicLabel}
                        </a>
                      ) : null}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setErrorDetails([]);
                          setStatusMessage(null);
                          setActiveLocale("en");
                          setDraft(toDraft(article));
                        }}
                      >
                        {copy.editLabel}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteArticle(article.id)}
                        disabled={deletingId === article.id}
                      >
                        {deletingId === article.id
                          ? copy.deletingLabel
                          : copy.deleteLabel}
                      </Button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {draft && activeTranslation ? (
        <section className={panelClass}>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label>{copy.slugLabel}</Label>
              <Input
                value={draft.slug}
                onChange={(event) => setDraft({ ...draft, slug: event.target.value })}
                placeholder={copy.slugPlaceholder}
              />
              {fieldError("slug") ? (
                <span className={adminFieldErrorClass}>{fieldError("slug")}</span>
              ) : null}
            </div>
            <div className="space-y-1.5">
              <Label>{copy.categoryLabel}</Label>
              <Input
                value={draft.category}
                onChange={(event) => setDraft({ ...draft, category: event.target.value })}
                placeholder={copy.categoryPlaceholder}
              />
              {fieldError("category") ? (
                <span className={adminFieldErrorClass}>{fieldError("category")}</span>
              ) : null}
            </div>
            <div className="space-y-1.5">
              <Label>{copy.statusLabel}</Label>
              <select
                className="flex h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 md:text-sm dark:bg-input/30"
                value={draft.status}
                onChange={(event) =>
                  setDraft({ ...draft, status: event.target.value as ArticleStatus })
                }
              >
                <option value="draft">{copy.statusDraftLabel}</option>
                <option value="published">{copy.statusPublishedLabel}</option>
              </select>
            </div>
          </div>

          <div className="mt-5 flex gap-2 border-b border-[var(--color-line)] pb-4">
            {(["en", "th"] as const).map((loc) => (
              <Button
                key={loc}
                variant={activeLocale === loc ? "primary" : "ghost"}
                size="sm"
                onClick={() => setActiveLocale(loc)}
              >
                {loc === "en" ? copy.translationEnLabel : copy.translationThLabel}
              </Button>
            ))}
          </div>

          <div className="mt-5 space-y-4">
            <div className="space-y-1.5">
              <Label>{copy.fieldTitleLabel}</Label>
              <Input
                value={activeTranslation.title}
                onChange={(event) => updateTranslation("title", event.target.value)}
              />
              {fieldError(`translations.${activeLocale}.title`) ? (
                <span className={adminFieldErrorClass}>
                  {fieldError(`translations.${activeLocale}.title`)}
                </span>
              ) : null}
            </div>

            <div className="grid gap-4 sm:grid-cols-[1fr_12rem]">
              <div className="space-y-1.5">
                <Label>{copy.fieldSummaryLabel}</Label>
                <Textarea
                  className="min-h-[5rem]"
                  value={activeTranslation.summary}
                  onChange={(event) => updateTranslation("summary", event.target.value)}
                />
                {fieldError(`translations.${activeLocale}.summary`) ? (
                  <span className={adminFieldErrorClass}>
                    {fieldError(`translations.${activeLocale}.summary`)}
                  </span>
                ) : null}
              </div>
              <div className="space-y-1.5">
                <Label>{copy.fieldReadingTimeLabel}</Label>
                <Input
                  value={activeTranslation.readingTime}
                  onChange={(event) =>
                    updateTranslation("readingTime", event.target.value)
                  }
                  placeholder={copy.fieldReadingTimePlaceholder}
                />
                {fieldError(`translations.${activeLocale}.readingTime`) ? (
                  <span className={adminFieldErrorClass}>
                    {fieldError(`translations.${activeLocale}.readingTime`)}
                  </span>
                ) : null}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>{copy.fieldLeadLabel}</Label>
              <Textarea
                className="min-h-[6rem]"
                value={activeTranslation.lead}
                onChange={(event) => updateTranslation("lead", event.target.value)}
              />
              {fieldError(`translations.${activeLocale}.lead`) ? (
                <span className={adminFieldErrorClass}>
                  {fieldError(`translations.${activeLocale}.lead`)}
                </span>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <Label>{copy.contentLabel}</Label>
              <MdxEditorField
                key={`${draft.id ?? "new"}-${activeLocale}`}
                value={activeTranslation.content}
                onChange={(md) => updateTranslation("content", md)}
                placeholder={copy.contentPlaceholder}
              />
              <p className="mt-1 text-[0.72rem] text-[var(--color-soft)]">
                {copy.contentHelp}
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button variant="primary" size="md" onClick={saveDraft} disabled={isSaving}>
              {isSaving ? copy.savingLabel : copy.saveLabel}
            </Button>
            <Button
              variant="ghost"
              size="md"
              onClick={() => {
                setDraft(null);
                setErrorDetails([]);
              }}
            >
              {copy.cancelLabel}
            </Button>
          </div>
        </section>
      ) : null}
    </div>
  );
}

"use client";

import { useEffect, useMemo, useState, useTransition } from "react";

import type { AdminArticlesCopy } from "../_data/admin-articles";
import type { Locale } from "../_data/portfolio";

type ArticleStatus = "draft" | "published";

type ArticleTranslation = {
  locale: "en" | "th";
  title: string;
  summary: string;
  lead: string;
  readingTime: string;
  sections: { heading: string; paragraphs: string[] }[];
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
  sections: { heading: string; paragraphs: string[] }[];
};

type DraftArticle = {
  id: string | null;
  slug: string;
  category: string;
  status: ArticleStatus;
  translations: Record<"en" | "th", DraftTranslation>;
};

const panelClass =
  "rounded-[1.45rem] border border-[var(--color-line-strong)] bg-[linear-gradient(180deg,rgba(10,20,16,0.96),rgba(6,12,9,0.96))] p-5 shadow-[inset_0_0_0_1px_rgba(111,247,166,0.04)] sm:p-6";
const labelClass =
  "font-mono text-[0.62rem] uppercase tracking-[0.06em] tabular-nums text-[var(--color-soft)]";
const inputClass =
  "w-full rounded-[0.85rem] border border-[var(--color-line)] bg-[rgba(6,12,9,0.7)] px-3 py-2 text-sm text-[var(--color-text)] outline-none transition-colors duration-150 focus:border-[var(--color-line-strong)]";
const primaryButtonClass =
  "inline-flex items-center rounded-full border border-[var(--color-line-strong)] bg-[var(--color-accent)] px-4 py-2 font-mono text-[0.7rem] uppercase tracking-[0.04em] text-[#041009] transition-opacity duration-150 hover:opacity-90 disabled:opacity-50";
const ghostButtonClass =
  "inline-flex items-center rounded-full border border-[var(--color-line)] px-3 py-1.5 font-mono text-[0.66rem] uppercase tracking-[0.04em] text-[var(--color-text)] transition-opacity duration-150 hover:opacity-80 disabled:opacity-50";

function emptyTranslation(): DraftTranslation {
  return {
    title: "",
    summary: "",
    lead: "",
    readingTime: "",
    sections: [{ heading: "", paragraphs: [""] }],
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
      sections:
        translation.sections.length > 0
          ? translation.sections.map((section) => ({
              heading: section.heading,
              paragraphs: section.paragraphs.length > 0 ? [...section.paragraphs] : [""],
            }))
          : [{ heading: "", paragraphs: [""] }],
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
  copy: AdminArticlesCopy;
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

  function updateSections(
    updater: (sections: DraftTranslation["sections"]) => DraftTranslation["sections"],
  ) {
    setDraft((current) =>
      current
        ? {
            ...current,
            translations: {
              ...current.translations,
              [activeLocale]: {
                ...current.translations[activeLocale],
                sections: updater(current.translations[activeLocale].sections),
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
    <div className="space-y-6">
      <section className={panelClass}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className={labelClass}>{copy.panelLabel}</p>
            <h2 className="mt-2 text-[1.4rem] font-semibold text-[var(--color-text)]">
              {copy.title}
            </h2>
            <p className="mt-2 max-w-2xl text-[0.86rem] leading-relaxed text-[var(--color-muted)]">
              {copy.description}
            </p>
          </div>
          <button
            type="button"
            className={primaryButtonClass}
            onClick={() => {
              setErrorDetails([]);
              setStatusMessage(null);
              setActiveLocale("en");
              setDraft(emptyDraft());
            }}
          >
            {copy.newArticleLabel}
          </button>
        </div>

        {statusMessage ? (
          <p className="mt-4 rounded-[0.85rem] border border-[var(--color-line)] bg-[rgba(6,12,9,0.7)] px-3 py-2 text-[0.8rem] text-[var(--color-accent)]">
            {statusMessage}
          </p>
        ) : null}

        <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto]">
          <label className="block">
            <span className={labelClass}>{copy.searchLabel}</span>
            <input
              className={`${inputClass} mt-1`}
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder={copy.searchPlaceholder}
            />
          </label>
          <label className="block">
            <span className={labelClass}>{copy.statusFilterLabel}</span>
            <select
              className={`${inputClass} mt-1`}
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
          </label>
        </div>
      </section>

      <section className={panelClass}>
        <div className="flex items-center justify-between gap-3">
          <p className={labelClass}>{copy.listLabel}</p>
          <button
            type="button"
            className={ghostButtonClass}
            onClick={() => setReloadToken((token) => token + 1)}
          >
            {isLoading ? copy.loadingLabel : copy.refreshLabel}
          </button>
        </div>

        {articles.length === 0 ? (
          <p className="mt-5 text-[0.86rem] text-[var(--color-muted)]">
            {isLoading ? copy.loadingLabel : copy.emptyLabel}
          </p>
        ) : (
          <div className="mt-5 space-y-3">
            {articles.map((article) => {
              const headline =
                article.translations.find((item) => item.locale === locale)?.title ??
                article.translations[0]?.title ??
                article.slug;

              return (
                <article
                  key={article.id}
                  className="rounded-[1.2rem] border border-[var(--color-line)] bg-[rgba(10,20,16,0.6)] p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full border px-2.5 py-1 font-mono text-[0.6rem] uppercase ${
                            article.status === "published"
                              ? "border-[var(--color-line-strong)] text-[var(--color-accent)]"
                              : "border-[var(--color-line)] text-[var(--color-soft)]"
                          }`}
                        >
                          {article.status === "published"
                            ? copy.statusPublishedLabel
                            : copy.statusDraftLabel}
                        </span>
                        <span className="rounded-full border border-[var(--color-line)] px-2.5 py-1 font-mono text-[0.6rem] uppercase text-[var(--color-soft)]">
                          {article.category}
                        </span>
                      </div>
                      <h3 className="mt-2 truncate text-[1.02rem] font-semibold text-[var(--color-text)]">
                        {headline}
                      </h3>
                      <p className="mt-1 font-mono text-[0.66rem] text-[var(--color-soft)]">
                        /{article.slug}
                      </p>
                    </div>

                    <div className="flex shrink-0 flex-wrap items-center gap-2">
                      {article.status === "published" ? (
                        <a
                          className={ghostButtonClass}
                          href={`/${locale}/articles/${article.slug}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {copy.viewPublicLabel}
                        </a>
                      ) : null}
                      <button
                        type="button"
                        className={ghostButtonClass}
                        onClick={() => {
                          setErrorDetails([]);
                          setStatusMessage(null);
                          setActiveLocale("en");
                          setDraft(toDraft(article));
                        }}
                      >
                        {copy.editLabel}
                      </button>
                      <button
                        type="button"
                        className={ghostButtonClass}
                        onClick={() => deleteArticle(article.id)}
                        disabled={deletingId === article.id}
                      >
                        {deletingId === article.id
                          ? copy.deletingLabel
                          : copy.deleteLabel}
                      </button>
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
            <label className="block">
              <span className={labelClass}>{copy.slugLabel}</span>
              <input
                className={`${inputClass} mt-1`}
                value={draft.slug}
                onChange={(event) => setDraft({ ...draft, slug: event.target.value })}
                placeholder={copy.slugPlaceholder}
              />
              {fieldError("slug") ? (
                <span className="mt-1 block text-[0.72rem] text-[#ff8f8f]">
                  {fieldError("slug")}
                </span>
              ) : null}
            </label>
            <label className="block">
              <span className={labelClass}>{copy.categoryLabel}</span>
              <input
                className={`${inputClass} mt-1`}
                value={draft.category}
                onChange={(event) => setDraft({ ...draft, category: event.target.value })}
                placeholder={copy.categoryPlaceholder}
              />
              {fieldError("category") ? (
                <span className="mt-1 block text-[0.72rem] text-[#ff8f8f]">
                  {fieldError("category")}
                </span>
              ) : null}
            </label>
            <label className="block">
              <span className={labelClass}>{copy.statusLabel}</span>
              <select
                className={`${inputClass} mt-1`}
                value={draft.status}
                onChange={(event) =>
                  setDraft({ ...draft, status: event.target.value as ArticleStatus })
                }
              >
                <option value="draft">{copy.statusDraftLabel}</option>
                <option value="published">{copy.statusPublishedLabel}</option>
              </select>
            </label>
          </div>

          <div className="mt-5 flex gap-2">
            {(["en", "th"] as const).map((loc) => (
              <button
                key={loc}
                type="button"
                className={`rounded-full border px-3 py-1.5 font-mono text-[0.66rem] uppercase tracking-[0.04em] transition-opacity duration-150 ${
                  activeLocale === loc
                    ? "border-[var(--color-line-strong)] bg-[var(--color-accent)] text-[#041009]"
                    : "border-[var(--color-line)] text-[var(--color-text)] hover:opacity-80"
                }`}
                onClick={() => setActiveLocale(loc)}
              >
                {loc === "en" ? copy.translationEnLabel : copy.translationThLabel}
              </button>
            ))}
          </div>

          <div className="mt-5 space-y-4">
            <label className="block">
              <span className={labelClass}>{copy.fieldTitleLabel}</span>
              <input
                className={`${inputClass} mt-1`}
                value={activeTranslation.title}
                onChange={(event) => updateTranslation("title", event.target.value)}
              />
              {fieldError(`translations.${activeLocale}.title`) ? (
                <span className="mt-1 block text-[0.72rem] text-[#ff8f8f]">
                  {fieldError(`translations.${activeLocale}.title`)}
                </span>
              ) : null}
            </label>

            <div className="grid gap-4 sm:grid-cols-[1fr_12rem]">
              <label className="block">
                <span className={labelClass}>{copy.fieldSummaryLabel}</span>
                <textarea
                  className={`${inputClass} mt-1 min-h-[5rem]`}
                  value={activeTranslation.summary}
                  onChange={(event) => updateTranslation("summary", event.target.value)}
                />
                {fieldError(`translations.${activeLocale}.summary`) ? (
                  <span className="mt-1 block text-[0.72rem] text-[#ff8f8f]">
                    {fieldError(`translations.${activeLocale}.summary`)}
                  </span>
                ) : null}
              </label>
              <label className="block">
                <span className={labelClass}>{copy.fieldReadingTimeLabel}</span>
                <input
                  className={`${inputClass} mt-1`}
                  value={activeTranslation.readingTime}
                  onChange={(event) =>
                    updateTranslation("readingTime", event.target.value)
                  }
                  placeholder={copy.fieldReadingTimePlaceholder}
                />
                {fieldError(`translations.${activeLocale}.readingTime`) ? (
                  <span className="mt-1 block text-[0.72rem] text-[#ff8f8f]">
                    {fieldError(`translations.${activeLocale}.readingTime`)}
                  </span>
                ) : null}
              </label>
            </div>

            <label className="block">
              <span className={labelClass}>{copy.fieldLeadLabel}</span>
              <textarea
                className={`${inputClass} mt-1 min-h-[6rem]`}
                value={activeTranslation.lead}
                onChange={(event) => updateTranslation("lead", event.target.value)}
              />
              {fieldError(`translations.${activeLocale}.lead`) ? (
                <span className="mt-1 block text-[0.72rem] text-[#ff8f8f]">
                  {fieldError(`translations.${activeLocale}.lead`)}
                </span>
              ) : null}
            </label>

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <span className={labelClass}>{copy.sectionsLabel}</span>
                <button
                  type="button"
                  className={ghostButtonClass}
                  onClick={() =>
                    updateSections((sections) => [
                      ...sections,
                      { heading: "", paragraphs: [""] },
                    ])
                  }
                >
                  {copy.addSectionLabel}
                </button>
              </div>

              {activeTranslation.sections.map((section, sectionIndex) => (
                <div
                  // biome-ignore lint/suspicious/noArrayIndexKey: editable ordered list without stable ids
                  key={sectionIndex}
                  className="rounded-[1.1rem] border border-[var(--color-line)] bg-[rgba(6,12,9,0.6)] p-4"
                >
                  <div className="flex items-end gap-2">
                    <label className="block flex-1">
                      <span className={labelClass}>{copy.sectionHeadingLabel}</span>
                      <input
                        className={`${inputClass} mt-1`}
                        value={section.heading}
                        onChange={(event) =>
                          updateSections((sections) =>
                            sections.map((item, index) =>
                              index === sectionIndex
                                ? { ...item, heading: event.target.value }
                                : item,
                            ),
                          )
                        }
                      />
                    </label>
                    {activeTranslation.sections.length > 1 ? (
                      <button
                        type="button"
                        className={ghostButtonClass}
                        onClick={() =>
                          updateSections((sections) =>
                            sections.filter((_, index) => index !== sectionIndex),
                          )
                        }
                      >
                        {copy.removeSectionLabel}
                      </button>
                    ) : null}
                  </div>

                  <div className="mt-3 space-y-2">
                    {section.paragraphs.map((paragraph, paragraphIndex) => (
                      // biome-ignore lint/suspicious/noArrayIndexKey: editable ordered list without stable ids
                      <div key={paragraphIndex} className="flex items-start gap-2">
                        <textarea
                          className={`${inputClass} min-h-[4rem] flex-1`}
                          value={paragraph}
                          onChange={(event) =>
                            updateSections((sections) =>
                              sections.map((item, index) =>
                                index === sectionIndex
                                  ? {
                                      ...item,
                                      paragraphs: item.paragraphs.map((value, idx) =>
                                        idx === paragraphIndex
                                          ? event.target.value
                                          : value,
                                      ),
                                    }
                                  : item,
                              ),
                            )
                          }
                        />
                        {section.paragraphs.length > 1 ? (
                          <button
                            type="button"
                            className={ghostButtonClass}
                            onClick={() =>
                              updateSections((sections) =>
                                sections.map((item, index) =>
                                  index === sectionIndex
                                    ? {
                                        ...item,
                                        paragraphs: item.paragraphs.filter(
                                          (_, idx) => idx !== paragraphIndex,
                                        ),
                                      }
                                    : item,
                                ),
                              )
                            }
                          >
                            {copy.removeParagraphLabel}
                          </button>
                        ) : null}
                      </div>
                    ))}
                    <button
                      type="button"
                      className={ghostButtonClass}
                      onClick={() =>
                        updateSections((sections) =>
                          sections.map((item, index) =>
                            index === sectionIndex
                              ? { ...item, paragraphs: [...item.paragraphs, ""] }
                              : item,
                          ),
                        )
                      }
                    >
                      {copy.addParagraphLabel}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              className={primaryButtonClass}
              onClick={saveDraft}
              disabled={isSaving}
            >
              {isSaving ? copy.savingLabel : copy.saveLabel}
            </button>
            <button
              type="button"
              className={ghostButtonClass}
              onClick={() => {
                setDraft(null);
                setErrorDetails([]);
              }}
            >
              {copy.cancelLabel}
            </button>
          </div>
        </section>
      ) : null}
    </div>
  );
}

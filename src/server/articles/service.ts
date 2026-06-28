import { hasLocale } from "@/app/_data/portfolio";
import {
  type ArticleInput,
  type ArticleLocale,
  type ArticleRecord,
  type ArticleSection,
  type ArticleStatus,
  articleLocales,
  articleStatuses,
  buildArticleSlug,
  getPublishedArticleBySlug,
  listPublishedArticles,
} from "@/server/db/articles";
import type { ApiErrorDetail } from "@/server/http/response";

export function parseArticleLocale(value: string | null) {
  const locale = value ?? "en";

  if (!hasLocale(locale)) {
    return {
      ok: false as const,
      error: {
        field: "lang",
        message: "Use `en` or `th`.",
      },
    };
  }

  return {
    ok: true as const,
    locale,
  };
}

function pickTranslation(article: ArticleRecord, locale: ArticleLocale) {
  return (
    article.translations.find((translation) => translation.locale === locale) ??
    article.translations.find((translation) => translation.locale === "en") ??
    article.translations[0] ??
    null
  );
}

function toListItem(article: ArticleRecord, locale: ArticleLocale) {
  const translation = pickTranslation(article, locale);

  if (!translation) {
    return null;
  }

  return {
    slug: article.slug,
    category: article.category,
    title: translation.title,
    summary: translation.summary,
    lead: translation.lead,
    publishedAt: article.publishedAt
      ? article.publishedAt.toISOString().slice(0, 10)
      : "",
    readingTime: translation.readingTime,
  };
}

function toDetail(article: ArticleRecord, locale: ArticleLocale) {
  const translation = pickTranslation(article, locale);

  if (!translation) {
    return null;
  }

  return {
    slug: article.slug,
    category: article.category,
    title: translation.title,
    summary: translation.summary,
    lead: translation.lead,
    readingTime: translation.readingTime,
    publishedAt: article.publishedAt
      ? article.publishedAt.toISOString().slice(0, 10)
      : "",
    sections: translation.sections as ArticleSection[],
  };
}

export async function listArticles(locale: ArticleLocale, limit?: number | null) {
  const articles = await listPublishedArticles(limit);

  return articles
    .map((article) => toListItem(article, locale))
    .filter((item): item is NonNullable<typeof item> => item !== null);
}

export async function findArticle(locale: ArticleLocale, slug: string) {
  const article = await getPublishedArticleBySlug(slug);

  if (!article) {
    return null;
  }

  return toDetail(article, locale);
}

type RawTranslation = {
  locale?: unknown;
  title?: unknown;
  summary?: unknown;
  lead?: unknown;
  readingTime?: unknown;
  sections?: unknown;
};

export type ArticlePayload = {
  slug?: unknown;
  category?: unknown;
  status?: unknown;
  translations?: unknown;
};

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function validateSections(
  sections: unknown,
  locale: string,
  details: ApiErrorDetail[],
): ArticleSection[] {
  if (!Array.isArray(sections) || sections.length === 0) {
    details.push({
      field: `translations.${locale}.sections`,
      message: "At least one section is required.",
    });
    return [];
  }

  const parsed: ArticleSection[] = [];

  sections.forEach((section, index) => {
    const heading = (section as { heading?: unknown })?.heading;
    const paragraphs = (section as { paragraphs?: unknown })?.paragraphs;

    if (!isNonEmptyString(heading)) {
      details.push({
        field: `translations.${locale}.sections.${index}.heading`,
        message: "Section heading is required.",
      });
    }

    if (
      !Array.isArray(paragraphs) ||
      paragraphs.length === 0 ||
      !paragraphs.every((paragraph) => isNonEmptyString(paragraph))
    ) {
      details.push({
        field: `translations.${locale}.sections.${index}.paragraphs`,
        message: "Each section needs at least one non-empty paragraph.",
      });
      return;
    }

    if (isNonEmptyString(heading)) {
      parsed.push({
        heading: heading.trim(),
        paragraphs: (paragraphs as string[]).map((paragraph) => paragraph.trim()),
      });
    }
  });

  return parsed;
}

export function validateArticlePayload(payload: ArticlePayload): {
  ok: boolean;
  details: ApiErrorDetail[];
  input?: ArticleInput;
} {
  const details: ApiErrorDetail[] = [];

  const slugSource = isNonEmptyString(payload.slug)
    ? payload.slug
    : isNonEmptyString((payload.translations as RawTranslation[] | undefined)?.[0]?.title)
      ? String((payload.translations as RawTranslation[])[0].title)
      : "";
  const slug = buildArticleSlug(slugSource);

  if (!slug) {
    details.push({
      field: "slug",
      message: "Provide a slug or an English title to generate one.",
    });
  }

  if (!isNonEmptyString(payload.category)) {
    details.push({
      field: "category",
      message: "Category is required.",
    });
  }

  const status = isNonEmptyString(payload.status) ? payload.status.trim() : "draft";

  if (!articleStatuses.includes(status as ArticleStatus)) {
    details.push({
      field: "status",
      message: `Use one of: ${articleStatuses.join(", ")}.`,
    });
  }

  const rawTranslations = Array.isArray(payload.translations)
    ? (payload.translations as RawTranslation[])
    : [];

  const translations: ArticleInput["translations"] = [];

  for (const locale of articleLocales) {
    const raw = rawTranslations.find((item) => item.locale === locale);

    if (!raw) {
      details.push({
        field: `translations.${locale}`,
        message: `Translation for "${locale}" is required.`,
      });
      continue;
    }

    if (!isNonEmptyString(raw.title)) {
      details.push({
        field: `translations.${locale}.title`,
        message: "Title is required.",
      });
    }

    if (!isNonEmptyString(raw.summary)) {
      details.push({
        field: `translations.${locale}.summary`,
        message: "Summary is required.",
      });
    }

    if (!isNonEmptyString(raw.lead)) {
      details.push({
        field: `translations.${locale}.lead`,
        message: "Lead is required.",
      });
    }

    if (!isNonEmptyString(raw.readingTime)) {
      details.push({
        field: `translations.${locale}.readingTime`,
        message: "Reading time is required.",
      });
    }

    const sections = validateSections(raw.sections, locale, details);

    if (
      isNonEmptyString(raw.title) &&
      isNonEmptyString(raw.summary) &&
      isNonEmptyString(raw.lead) &&
      isNonEmptyString(raw.readingTime) &&
      sections.length > 0
    ) {
      translations.push({
        locale,
        title: raw.title.trim(),
        summary: raw.summary.trim(),
        lead: raw.lead.trim(),
        readingTime: raw.readingTime.trim(),
        sections,
      });
    }
  }

  if (details.length > 0) {
    return { ok: false, details };
  }

  return {
    ok: true,
    details: [],
    input: {
      slug,
      category: (payload.category as string).trim(),
      status: status as ArticleStatus,
      publishedAt: status === "published" ? new Date() : null,
      translations,
    },
  };
}

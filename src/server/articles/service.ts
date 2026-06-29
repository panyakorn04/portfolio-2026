import { hasLocale } from "@/app/_data/portfolio";
import type { ApiErrorDetail } from "@/server/http/response";

export const articleStatuses = ["draft", "published"] as const;
export type ArticleStatus = (typeof articleStatuses)[number];

export const articleLocales = ["en", "th"] as const;
export type ArticleLocale = (typeof articleLocales)[number];

export type ArticleSection = {
  heading: string;
  paragraphs: string[];
};

export type ArticleListItem = {
  slug: string;
  category: string;
  title: string;
  summary: string;
  lead: string;
  publishedAt: string;
  readingTime: string;
};

export type ArticleDetail = ArticleListItem & {
  sections: ArticleSection[];
};

export type ArticleTranslationInput = {
  locale: ArticleLocale;
  title: string;
  summary: string;
  lead: string;
  readingTime: string;
  sections: ArticleSection[];
};

export type ArticleInput = {
  slug: string;
  category: string;
  status: ArticleStatus;
  publishedAt: Date | null;
  translations: ArticleTranslationInput[];
};

type ApiSuccess<T> = {
  ok: true;
  data: T;
};

type RawArticleListResponse = {
  items?: unknown;
};

function getApiBaseUrl() {
  return (
    process.env.FRONTEND_API_BASE_URL?.trim() ||
    process.env.NEXT_PUBLIC_API_URL?.trim() ||
    "https://api.panyakorn.com"
  ).replace(/\/+$/, "");
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function parseListItem(value: unknown): ArticleListItem | null {
  if (!isObject(value)) {
    return null;
  }

  const { slug, category, title, summary, lead, publishedAt, readingTime } = value;

  if (
    !isNonEmptyString(slug) ||
    !isNonEmptyString(category) ||
    !isNonEmptyString(title) ||
    !isNonEmptyString(summary) ||
    !isNonEmptyString(lead) ||
    !isNonEmptyString(readingTime)
  ) {
    return null;
  }

  return {
    slug: slug.trim(),
    category: category.trim(),
    title: title.trim(),
    summary: summary.trim(),
    lead: lead.trim(),
    publishedAt: typeof publishedAt === "string" ? publishedAt : "",
    readingTime: readingTime.trim(),
  };
}

function parseSection(value: unknown): ArticleSection | null {
  if (
    !isObject(value) ||
    !isNonEmptyString(value.heading) ||
    !Array.isArray(value.paragraphs)
  ) {
    return null;
  }

  const paragraphs = value.paragraphs
    .filter(isNonEmptyString)
    .map((paragraph) => paragraph.trim());

  if (paragraphs.length === 0) {
    return null;
  }

  return {
    heading: value.heading.trim(),
    paragraphs,
  };
}

function parseArticleDetail(value: unknown): ArticleDetail | null {
  const item = parseListItem(value);
  if (!item || !isObject(value) || !Array.isArray(value.sections)) {
    return null;
  }

  return {
    ...item,
    sections: value.sections
      .map(parseSection)
      .filter((section): section is ArticleSection => section !== null),
  };
}

async function fetchApi<T>(path: string) {
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    cache: "no-store",
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Portfolio API request failed: ${response.status}`);
  }

  const payload = (await response.json()) as ApiSuccess<T>;

  if (!payload.ok) {
    throw new Error("Portfolio API returned an error response.");
  }

  return payload.data;
}

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

export async function listArticles(locale: ArticleLocale, limit?: number | null) {
  const searchParams = new URLSearchParams({ lang: locale });
  if (typeof limit === "number") {
    searchParams.set("limit", String(limit));
  }

  const data = await fetchApi<RawArticleListResponse>(
    `/api/articles?${searchParams.toString()}`,
  );
  const items = Array.isArray(data?.items) ? data.items : [];

  return items
    .map(parseListItem)
    .filter((item): item is ArticleListItem => item !== null);
}

export async function findArticle(locale: ArticleLocale, slug: string) {
  const searchParams = new URLSearchParams({ lang: locale });
  const data = await fetchApi<unknown>(
    `/api/articles/${encodeURIComponent(slug)}?${searchParams.toString()}`,
  );

  return parseArticleDetail(data);
}

export async function getArticleSlugs(locale: ArticleLocale = "en") {
  const articles = await listArticles(locale);
  return articles.map((article) => article.slug);
}

export function buildArticleSlug(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

export type ArticlePayload = {
  slug?: unknown;
  category?: unknown;
  status?: unknown;
  translations?: unknown;
};

type RawTranslation = {
  locale?: unknown;
  title?: unknown;
  summary?: unknown;
  lead?: unknown;
  readingTime?: unknown;
  sections?: unknown;
};

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
        message: `Add the ${locale.toUpperCase()} translation.`,
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

    translations.push({
      locale,
      title: isNonEmptyString(raw.title) ? raw.title.trim() : "",
      summary: isNonEmptyString(raw.summary) ? raw.summary.trim() : "",
      lead: isNonEmptyString(raw.lead) ? raw.lead.trim() : "",
      readingTime: isNonEmptyString(raw.readingTime) ? raw.readingTime.trim() : "",
      sections: validateSections(raw.sections, locale, details),
    });
  }

  if (details.length > 0) {
    return { ok: false, details };
  }

  return {
    ok: true,
    details: [],
    input: {
      slug,
      category: String(payload.category).trim(),
      status: status as ArticleStatus,
      publishedAt: status === "published" ? new Date() : null,
      translations,
    },
  };
}

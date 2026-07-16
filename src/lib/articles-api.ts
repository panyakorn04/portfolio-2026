import "server-only";
import { cache } from "react";

type ArticleLocale = "en" | "th";

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
  content: string;
};

type ApiSuccess<T> = {
  ok: true;
  data: T;
};

type RawArticleListResponse = {
  items?: unknown;
};

type NextFetchInit = RequestInit & {
  next?: {
    revalidate?: number;
    tags?: string[];
  };
};

function getApiBaseUrl() {
  return (
    process.env.BUILD_API_BASE_URL?.trim() ||
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

function parseArticleDetail(value: unknown): ArticleDetail | null {
  const item = parseListItem(value);
  if (!item || !isObject(value)) {
    return null;
  }

  return {
    ...item,
    content: typeof value.content === "string" ? value.content : "",
  };
}

function getApiRequestTimeoutMs() {
  const timeoutMs = Number.parseInt(process.env.PORTFOLIO_API_TIMEOUT_MS ?? "3000", 10);

  return Number.isFinite(timeoutMs) && timeoutMs > 0 ? timeoutMs : 3000;
}

async function fetchApi<T>(path: string) {
  let response: Response;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), getApiRequestTimeoutMs());

  const fetchOptions: NextFetchInit = {
    next: { revalidate: 300, tags: ["articles"] },
    signal: controller.signal,
  };

  try {
    response = await fetch(`${getApiBaseUrl()}${path}`, fetchOptions);
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `Portfolio API request skipped for ${path}: ${error instanceof Error ? error.message : "unknown error"}`,
      );
    }
    return null;
  } finally {
    clearTimeout(timeoutId);
  }

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

export const listArticles = cache(
  async (locale: ArticleLocale, limit?: number | null) => {
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
  },
);

export const findArticle = cache(async (locale: ArticleLocale, slug: string) => {
  const searchParams = new URLSearchParams({ lang: locale });
  const data = await fetchApi<unknown>(
    `/api/articles/${encodeURIComponent(slug)}?${searchParams.toString()}`,
  );

  return parseArticleDetail(data);
});

export async function getArticleSlugs(locale: ArticleLocale = "en") {
  const articles = await listArticles(locale);
  return articles.map((article) => article.slug);
}

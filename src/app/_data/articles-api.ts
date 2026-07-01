type ArticleLocale = "en" | "th";

type ArticleSection = {
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

type ApiSuccess<T> = {
  ok: true;
  data: T;
};

type RawArticleListResponse = {
  items?: unknown;
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
  let response: Response;

  try {
    response = await fetch(`${getApiBaseUrl()}${path}`, {
      next: { revalidate: 300, tags: ["articles"] },
    });
  } catch (error) {
    console.warn(
      `Portfolio API request skipped for ${path}: ${error instanceof Error ? error.message : "unknown error"}`,
    );
    return null;
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

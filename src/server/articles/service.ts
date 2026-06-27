import { getArticleBySlug, getArticles } from "@/app/_data/articles";
import { hasLocale } from "@/app/_data/portfolio";

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

export function listArticles(locale: "en" | "th", limit?: number | null) {
  const items = getArticles(locale).map((article) => ({
    slug: article.slug,
    category: article.category,
    title: article.title,
    summary: article.summary,
    publishedAt: article.publishedAt,
    readingTime: article.readingTime,
  }));

  return typeof limit === "number" ? items.slice(0, limit) : items;
}

export function findArticle(locale: "en" | "th", slug: string) {
  return getArticleBySlug(locale, slug);
}

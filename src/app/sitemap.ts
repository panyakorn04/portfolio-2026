import type { MetadataRoute } from "next";

import { getArticleSlugs } from "../lib/articles-api";

import { locales } from "../lib/portfolio";
import { getSiteUrl } from "../lib/site-url";

async function getArticleSlugsForSitemap() {
  try {
    return await getArticleSlugs();
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("Skipping article sitemap entries:", error);
    }

    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const lastModified = new Date();
  const articleSlugs = await getArticleSlugsForSitemap();

  return locales.flatMap((locale) => {
    const localePriority = locale === "en" ? 1 : 0.9;

    return [
      {
        url: `${siteUrl}/${locale}`,
        lastModified,
        changeFrequency: "monthly",
        priority: localePriority,
        alternates: {
          languages: {
            en: `${siteUrl}/en`,
            th: `${siteUrl}/th`,
          },
        },
      },
      {
        url: `${siteUrl}/${locale}/articles`,
        lastModified,
        changeFrequency: "monthly",
        priority: locale === "en" ? 0.9 : 0.8,
        alternates: {
          languages: {
            en: `${siteUrl}/en/articles`,
            th: `${siteUrl}/th/articles`,
          },
        },
      },
      ...articleSlugs.map((slug) => ({
        url: `${siteUrl}/${locale}/articles/${slug}`,
        lastModified,
        changeFrequency: "monthly" as const,
        priority: locale === "en" ? 0.8 : 0.7,
        alternates: {
          languages: {
            en: `${siteUrl}/en/articles/${slug}`,
            th: `${siteUrl}/th/articles/${slug}`,
          },
        },
      })),
    ];
  });
}

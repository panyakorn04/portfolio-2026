import type { MetadataRoute } from "next";

import { locales } from "./_data/portfolio";
import { getSiteUrl } from "./_data/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const lastModified = new Date();

  return locales.map((locale) => ({
    url: `${siteUrl}/${locale}`,
    lastModified,
    changeFrequency: "monthly",
    priority: locale === "en" ? 1 : 0.9,
    alternates: {
      languages: {
        en: `${siteUrl}/en`,
        th: `${siteUrl}/th`,
      },
    },
  }));
}

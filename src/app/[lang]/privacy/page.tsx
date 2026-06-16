import type { Metadata } from "next";
import { notFound } from "next/navigation";

import LegalPage from "../../_components/legal-page";
import { hasLocale } from "../../_data/portfolio";
import {
  getAbsoluteSiteUrl,
  getLocalizedSitePath,
  getMetadataBase,
} from "../../_data/site-url";
import { getDictionary } from "../dictionaries";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/privacy">): Promise<Metadata> {
  const { lang } = await params;

  if (!hasLocale(lang)) {
    return {};
  }

  const dictionary = await getDictionary(lang);
  const pathname = getLocalizedSitePath(lang, "/privacy");

  return {
    metadataBase: getMetadataBase(),
    title: dictionary.legal.privacy.title,
    description: dictionary.legal.privacy.description,
    alternates: {
      canonical: pathname,
      languages: {
        en: "/en/privacy",
        th: "/th/privacy",
        "x-default": "/en/privacy",
      },
    },
    openGraph: {
      title: dictionary.legal.privacy.title,
      description: dictionary.legal.privacy.description,
      type: "article",
      url: pathname,
      locale: lang === "th" ? "th_TH" : "en_US",
    },
  };
}

export default async function PrivacyPage({ params }: PageProps<"/[lang]/privacy">) {
  const { lang } = await params;

  if (!hasLocale(lang)) {
    notFound();
  }

  const dictionary = await getDictionary(lang);
  const pathname = getLocalizedSitePath(lang, "/privacy");

  return (
    <LegalPage
      locale={lang}
      dictionary={dictionary}
      page="privacy"
      url={getAbsoluteSiteUrl(pathname)}
    />
  );
}

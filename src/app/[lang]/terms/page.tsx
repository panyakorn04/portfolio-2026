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
}: PageProps<"/[lang]/terms">): Promise<Metadata> {
  const { lang } = await params;

  if (!hasLocale(lang)) {
    return {};
  }

  const dictionary = await getDictionary(lang);
  const pathname = getLocalizedSitePath(lang, "/terms");

  return {
    metadataBase: getMetadataBase(),
    title: dictionary.legal.terms.title,
    description: dictionary.legal.terms.description,
    alternates: {
      canonical: pathname,
      languages: {
        en: "/en/terms",
        th: "/th/terms",
        "x-default": "/en/terms",
      },
    },
    openGraph: {
      title: dictionary.legal.terms.title,
      description: dictionary.legal.terms.description,
      type: "article",
      url: pathname,
      locale: lang === "th" ? "th_TH" : "en_US",
    },
  };
}

export default async function TermsPage({ params }: PageProps<"/[lang]/terms">) {
  const { lang } = await params;

  if (!hasLocale(lang)) {
    notFound();
  }

  const dictionary = await getDictionary(lang);
  const pathname = getLocalizedSitePath(lang, "/terms");

  return (
    <LegalPage
      locale={lang}
      dictionary={dictionary}
      page="terms"
      url={getAbsoluteSiteUrl(pathname)}
    />
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import AdminWorkspace from "../../_components/admin-workspace";
import { adminDirectoryCopy } from "../../_data/admin";
import { adminArticlesCopy } from "../../_data/admin-articles";
import { hasLocale } from "../../_data/portfolio";
import { getLocalizedSitePath, getMetadataBase } from "../../_data/site-url";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/admin">): Promise<Metadata> {
  const { lang } = await params;

  if (!hasLocale(lang)) {
    return {};
  }

  const copy = adminDirectoryCopy[lang];
  const pathname = getLocalizedSitePath(lang, "/admin");

  return {
    metadataBase: getMetadataBase(),
    title: copy.navLabel,
    description: copy.description,
    robots: {
      index: false,
      follow: false,
    },
    alternates: {
      canonical: pathname,
      languages: {
        en: "/en/admin",
        th: "/th/admin",
        "x-default": "/en/admin",
      },
    },
    openGraph: {
      title: copy.title,
      description: copy.description,
      type: "website",
      url: pathname,
      locale: lang === "th" ? "th_TH" : "en_US",
    },
  };
}

export default async function AdminPage({ params }: PageProps<"/[lang]/admin">) {
  const { lang } = await params;

  if (!hasLocale(lang)) {
    notFound();
  }

  return (
    <AdminWorkspace
      locale={lang}
      contactCopy={adminDirectoryCopy[lang]}
      articlesCopy={adminArticlesCopy[lang]}
    />
  );
}

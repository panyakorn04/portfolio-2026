import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "../../../lib/portfolio";
import { getLocalizedSitePath, getMetadataBase } from "../../../lib/site-url";
import { getDictionary } from "../dictionaries";
import AdminWorkspace from "./_components/admin-workspace";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/admin">): Promise<Metadata> {
  const { lang } = await params;

  if (!hasLocale(lang)) {
    return {};
  }

  const dictionary = await getDictionary(lang);
  const copy = dictionary.adminWorkspace;
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

  const dict = await getDictionary(lang);

  return (
    <AdminWorkspace
      locale={lang}
      contactCopy={dict.adminWorkspace}
      articlesCopy={dict.adminArticles}
    />
  );
}

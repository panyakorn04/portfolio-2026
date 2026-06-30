import type { Metadata } from "next";
import { notFound } from "next/navigation";

import AdminLogin from "../../../_components/admin-login";
import { adminDirectoryCopy } from "../../../_data/admin";
import { hasLocale } from "../../../_data/portfolio";
import { getLocalizedSitePath, getMetadataBase } from "../../../_data/site-url";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/admin/login">): Promise<Metadata> {
  const { lang } = await params;

  if (!hasLocale(lang)) {
    return {};
  }

  const copy = adminDirectoryCopy[lang];
  const pathname = getLocalizedSitePath(lang, "/admin/login");

  return {
    metadataBase: getMetadataBase(),
    title: copy.authTitle,
    description: copy.authDescription,
    robots: {
      index: false,
      follow: false,
    },
    alternates: {
      canonical: pathname,
      languages: {
        en: "/en/admin/login",
        th: "/th/admin/login",
        "x-default": "/en/admin/login",
      },
    },
    openGraph: {
      title: copy.authTitle,
      description: copy.authDescription,
      type: "website",
      url: pathname,
      locale: lang === "th" ? "th_TH" : "en_US",
    },
  };
}

export default async function AdminLoginPage({
  params,
}: PageProps<"/[lang]/admin/login">) {
  const { lang } = await params;

  if (!hasLocale(lang)) {
    notFound();
  }

  return <AdminLogin locale={lang} copy={adminDirectoryCopy[lang]} />;
}

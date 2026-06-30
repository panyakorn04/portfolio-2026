import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

import AdminLogin from "../../../_components/admin-login";
import { adminDirectoryCopy } from "../../../_data/admin";
import { hasLocale } from "../../../_data/portfolio";
import { getLocalizedSitePath, getMetadataBase } from "../../../_data/site-url";

function getApiBaseUrl() {
  return (
    process.env.FRONTEND_API_BASE_URL?.trim() ||
    process.env.NEXT_PUBLIC_API_URL?.trim() ||
    "https://api.panyakorn.com"
  ).replace(/\/+$/, "");
}

async function isAuthenticated() {
  const cookieHeader = (await cookies()).toString();

  if (!cookieHeader) {
    return false;
  }

  try {
    const response = await fetch(`${getApiBaseUrl()}/api/admin/session`, {
      cache: "no-store",
      headers: {
        cookie: cookieHeader,
      },
    });

    if (!response.ok) {
      return false;
    }

    const payload = (await response.json()) as {
      ok?: boolean;
      data?: { user?: unknown | null };
    };

    return Boolean(payload.ok && payload.data?.user);
  } catch {
    return false;
  }
}

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

  if (await isAuthenticated()) {
    redirect(`/${lang}/admin`);
  }

  return <AdminLogin locale={lang} copy={adminDirectoryCopy[lang]} />;
}

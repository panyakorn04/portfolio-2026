import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { adminSessionCookieName } from "@/server/auth/session";
import { getAuthSessionByRawToken, staffRoles } from "@/server/auth/users";

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

  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(adminSessionCookieName)?.value ?? null;
  const session = sessionToken ? await getAuthSessionByRawToken(sessionToken) : null;

  if (
    session &&
    session.expiresAt > new Date() &&
    staffRoles.includes(session.user.role as (typeof staffRoles)[number])
  ) {
    redirect(`/${lang}/admin`);
  }

  return <AdminLogin locale={lang} copy={adminDirectoryCopy[lang]} />;
}

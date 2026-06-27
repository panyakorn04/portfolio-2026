import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { adminSessionCookieName } from "@/server/auth/session";
import { getAuthSessionByRawToken, staffRoles } from "@/server/auth/users";

import AdminContactInquiries from "../../_components/admin-contact-inquiries";
import { adminDirectoryCopy } from "../../_data/admin";
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

  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(adminSessionCookieName)?.value ?? null;
  const session = sessionToken ? await getAuthSessionByRawToken(sessionToken) : null;

  if (
    !session ||
    session.expiresAt <= new Date() ||
    !staffRoles.includes(session.user.role as (typeof staffRoles)[number])
  ) {
    redirect(`/${lang}/admin/login`);
  }

  return <AdminContactInquiries locale={lang} copy={adminDirectoryCopy[lang]} />;
}

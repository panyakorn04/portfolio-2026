import "../globals.css";

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connection } from "next/server";

import { PostHogPageView } from "../../components/posthog-pageview";
import { PostHogProvider } from "../../components/posthog-provider";
import { jetbrainsMono, kanit, spaceGrotesk } from "../../lib/fonts";
import { hasLocale, locales } from "../../lib/portfolio";
import { getMetadataBase } from "../../lib/site-url";
import { getDictionary } from "./dictionaries";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;

  if (!hasLocale(lang)) {
    return {};
  }

  const dictionary = await getDictionary(lang);
  const metadataBase = getMetadataBase();

  return {
    metadataBase,
    title: dictionary.meta.metaTitle,
    description: dictionary.meta.metaDescription,
    alternates: {
      canonical: `/${lang}`,
      languages: {
        en: "/en",
        th: "/th",
        "x-default": "/en",
      },
    },
    openGraph: {
      title: dictionary.meta.openGraphTitle,
      description: dictionary.meta.openGraphDescription,
      type: "website",
      url: `/${lang}`,
      locale: lang === "th" ? "th_TH" : "en_US",
    },
  };
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  await connection();
  const { lang } = await params;

  if (!hasLocale(lang)) {
    notFound();
  }

  return (
    <html
      lang={lang}
      className={`${kanit.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/*<a
          href="#main-content"
          className="fixed -translate-y-full focus:translate-y-0 left-4 top-4 z-50 rounded bg-[var(--color-accent)] px-4 py-2 text-sm font-semibold text-black transition-transform focus:outline-2 focus:outline-offset-2 focus:outline-[var(--color-accent)]"
        >
          Skip to content
        </a>*/}
        <PostHogProvider
          posthogKey={process.env.NEXT_PUBLIC_POSTHOG_KEY}
          posthogHost={process.env.NEXT_PUBLIC_POSTHOG_HOST || "/ingest"}
        >
          {children}
          <PostHogPageView />
        </PostHogProvider>
      </body>
    </html>
  );
}

import "../globals.css";

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { jetbrainsMono, kanit, spaceGrotesk } from "../_data/fonts";
import { hasLocale, locales } from "../_data/portfolio";
import { getMetadataBase } from "../_data/site-url";
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
  const { lang } = await params;

  if (!hasLocale(lang)) {
    notFound();
  }

  return (
    <html
      lang={lang}
      className={`${kanit.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

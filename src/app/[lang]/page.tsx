import { notFound } from "next/navigation";

import { listArticles } from "@/server/articles/service";

import packageJson from "../../../package.json";
import { PortfolioShell } from "../_components/portfolio-shell";
import { hasLocale } from "../_data/portfolio";
import { getDictionary } from "./dictionaries";

export default async function LocalizedHomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;

  if (!hasLocale(lang)) {
    notFound();
  }

  const [dictionary, articles] = await Promise.all([
    getDictionary(lang),
    listArticles(lang, 4),
  ]);

  return (
    <PortfolioShell
      locale={lang}
      dictionary={dictionary}
      articles={articles}
      appVersion={packageJson.version}
    />
  );
}

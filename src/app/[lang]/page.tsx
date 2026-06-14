import { notFound } from "next/navigation";

import { PortfolioShell } from "../_components/portfolio-shell";
import { hasLocale } from "../_data/portfolio";
import { getDictionary } from "./dictionaries";

export default async function LocalizedHomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;

  if (!hasLocale(lang)) {
    notFound();
  }

  const dictionary = await getDictionary(lang);

  return <PortfolioShell locale={lang} dictionary={dictionary} />;
}

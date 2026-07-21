import { notFound } from "next/navigation";

import { listArticles } from "@/lib/articles-api";

import packageJson from "../../../package.json";
import { hasLocale } from "../../lib/portfolio";
import { PortfolioShell } from "./_components/portfolio-shell";
import { getDictionary } from "./dictionaries";

export default async function LocalizedHomePage({
    params,
}: PageProps<"/[lang]">) {
    const { lang } = await params;

    if (!hasLocale(lang)) {
        notFound();
    }

    const dictionary = await getDictionary(lang);
    const articlesPromise = listArticles(lang, 4);

    return (
        <PortfolioShell
            locale={lang}
            dictionary={dictionary}
            articlesPromise={articlesPromise}
            appVersion={packageJson.version}
        />
    );
}

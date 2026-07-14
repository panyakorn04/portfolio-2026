import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { listArticles } from "@/lib/articles-api";
import { buttonBase, buttonSizes, buttonVariants } from "../../../components/ui/button";
import { articleDirectoryCopy } from "../../../lib/articles";
import { hasLocale } from "../../../lib/portfolio";
import { getLocalizedSitePath, getMetadataBase } from "../../../lib/site-url";

export const revalidate = 300;

const pageShellClass =
  "min-h-screen bg-[var(--color-bg)] px-5 py-14 text-[var(--color-text)] sm:px-8 sm:py-20";
const panelClass = "border-t border-[var(--color-line)] py-8 sm:py-12";
const titleClass =
  '[font-family:var(--font-display),"Segoe_UI",sans-serif] text-[clamp(2rem,4vw,3.8rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-balance';
const bodyClass =
  "text-[0.88rem] leading-[1.85] text-[var(--color-muted)] sm:text-[0.92rem]";
const labelClass =
  "font-mono text-[0.62rem] uppercase tracking-[0.06em] tabular-nums text-[var(--color-soft)]";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/articles">): Promise<Metadata> {
  const { lang } = await params;

  if (!hasLocale(lang)) {
    return {};
  }

  const copy = articleDirectoryCopy[lang];
  const pathname = getLocalizedSitePath(lang, "/articles");

  return {
    metadataBase: getMetadataBase(),
    title: copy.navLabel,
    description: copy.description,
    alternates: {
      canonical: pathname,
      languages: {
        en: "/en/articles",
        th: "/th/articles",
        "x-default": "/en/articles",
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

export default async function ArticlesPage({ params }: PageProps<"/[lang]/articles">) {
  const { lang } = await params;

  if (!hasLocale(lang)) {
    notFound();
  }

  const copy = articleDirectoryCopy[lang];
  const articles = await listArticles(lang);
  const [featuredArticle, ...restArticles] = articles;

  return (
    <main lang={lang} className={pageShellClass}>
      <div className="mx-auto max-w-6xl space-y-6">
        <section className={panelClass}>
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-[var(--color-line-strong)] px-3 py-1 font-mono text-[0.66rem] uppercase tabular-nums text-[var(--color-accent)]">
              /articles
            </span>
            <Link
              href={`/${lang}`}
              className={`${buttonBase} ${buttonVariants.ghost} ${buttonSizes.xs}`}
            >
              {copy.backToPortfolioLabel}
            </Link>
          </div>

          <div className="mt-6 max-w-4xl space-y-4 border-b border-[var(--color-line)] pb-6">
            <p className={labelClass}>{copy.eyebrow}</p>
            <h1 className={titleClass}>{copy.title}</h1>
            <p className={`${bodyClass} max-w-3xl text-pretty`}>{copy.description}</p>
          </div>

          {featuredArticle ? (
            <article className="mt-6 grid gap-8 border-b border-[var(--color-line)] py-8 lg:grid-cols-[minmax(0,1.25fr)_14rem]">
              <div>
                <p className={labelClass}>{copy.featuredLabel}</p>
                <h2 className="mt-3 text-[1.5rem] font-semibold leading-tight text-[var(--color-text)]">
                  {featuredArticle.title}
                </h2>
                <p className={`${bodyClass} mt-3 max-w-2xl text-pretty`}>
                  {featuredArticle.summary}
                </p>
                <p className={`${bodyClass} mt-4 max-w-2xl text-pretty`}>
                  {featuredArticle.lead}
                </p>
              </div>

              <div className="border-l border-[var(--color-line)] p-4">
                <dl className="space-y-4">
                  <div>
                    <dt className={labelClass}>{copy.publishedLabel}</dt>
                    <dd className="mt-2 text-sm text-[var(--color-text)]">
                      {featuredArticle.publishedAt}
                    </dd>
                  </div>
                  <div>
                    <dt className={labelClass}>{copy.readingTimeLabel}</dt>
                    <dd className="mt-2 text-sm text-[var(--color-text)]">
                      {featuredArticle.readingTime}
                    </dd>
                  </div>
                  <div>
                    <dt className={labelClass}>Type</dt>
                    <dd className="mt-2 text-sm text-[var(--color-accent)]">
                      {featuredArticle.category}
                    </dd>
                  </div>
                </dl>

                <Link
                  href={`/${lang}/articles/${featuredArticle.slug}`}
                  className={`${buttonBase} ${buttonVariants.primary} ${buttonSizes.md} mt-5`}
                >
                  {copy.readArticleLabel}
                </Link>
              </div>
            </article>
          ) : (
            <p className={`${bodyClass} mt-6`}>{copy.emptyLabel}</p>
          )}
        </section>

        {restArticles.length ? (
          <section className={panelClass}>
            <div className="flex items-center justify-between gap-3">
              <p className={labelClass}>{copy.listLabel}</p>
              <span className="font-mono text-[0.7rem] text-[var(--color-soft)]">
                {articles.length}
              </span>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              {restArticles.map((article) => (
                <article
                  key={article.slug}
                  className="border-t border-[var(--color-line)] py-6 transition-colors duration-150 hover:border-[var(--color-accent)]"
                >
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full border border-[var(--color-line)] px-2.5 py-1 font-mono text-[0.62rem] uppercase text-[var(--color-accent)]">
                      {article.category}
                    </span>
                    <span className="rounded-full border border-[var(--color-line)] px-2.5 py-1 font-mono text-[0.62rem] uppercase text-[var(--color-soft)]">
                      {article.readingTime}
                    </span>
                  </div>
                  <h2 className="mt-4 text-[1.18rem] font-semibold leading-snug text-[var(--color-text)]">
                    {article.title}
                  </h2>
                  <p className={`${bodyClass} mt-3 text-pretty`}>{article.summary}</p>
                  <div className="mt-5 flex items-center justify-between gap-3">
                    <span className="font-mono text-[0.66rem] uppercase text-[var(--color-soft)]">
                      {article.publishedAt}
                    </span>
                    <Link
                      href={`/${lang}/articles/${article.slug}`}
                      className="font-mono text-[0.68rem] uppercase tracking-[0.04em] text-[var(--color-accent)]"
                    >
                      {copy.readArticleLabel}
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}

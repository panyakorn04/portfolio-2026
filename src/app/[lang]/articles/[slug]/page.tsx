import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

import { findArticle, getArticleSlugs } from "@/lib/articles-api";
import { buttonVariants } from "../../../../components/ui/button";
import {
  fontDisplayClass,
  formLabel,
  pageShellClassWide,
} from "../../../../components/ui/typography";
import { hasLocale, locales } from "../../../../lib/portfolio";
import { getLocalizedSitePath, getMetadataBase } from "../../../../lib/site-url";
import { getDictionary } from "../../dictionaries";

export const revalidate = 300;

export async function generateStaticParams() {
  const results = await Promise.all(
    locales.map(async (lang) => {
      try {
        const slugs = await getArticleSlugs(lang);
        return slugs.map((slug) => ({ lang, slug }));
      } catch {
        return [];
      }
    }),
  );
  return results.flat();
}

const panelClass = "border-t border-[var(--color-line)] py-8 sm:py-12";
const titleClass = `${fontDisplayClass} text-[clamp(2rem,4vw,3.6rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-balance`;
const bodyClass = "text-[0.96rem] leading-[1.9] text-[var(--color-muted)] sm:text-[1rem]";
const headingClass = "text-[1.32rem] font-semibold text-[var(--color-text)] mt-8 mb-3";
const codeClass =
  "rounded bg-[var(--color-panel)] px-1.5 py-0.5 font-mono text-[0.84em] text-[var(--color-accent)]";
const preClass =
  "overflow-x-auto rounded border border-[var(--color-line)] bg-[#090b0a] p-4 text-[0.84rem] leading-relaxed";
const blockquoteClass =
  "border-l-2 border-[var(--color-accent)] pl-4 italic text-[var(--color-soft)]";
const listClass = "ml-5 space-y-1.5 text-[var(--color-muted)]";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/articles/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;

  if (!hasLocale(lang)) {
    return {};
  }

  const article = await findArticle(lang, slug);

  if (!article) {
    return {};
  }

  const pathname = getLocalizedSitePath(lang, `/articles/${slug}`);

  return {
    metadataBase: getMetadataBase(),
    title: article.title,
    description: article.summary,
    alternates: {
      canonical: pathname,
      languages: {
        en: `/en/articles/${slug}`,
        th: `/th/articles/${slug}`,
        "x-default": `/en/articles/${slug}`,
      },
    },
    openGraph: {
      title: article.title,
      description: article.summary,
      type: "article",
      url: pathname,
      locale: lang === "th" ? "th_TH" : "en_US",
    },
  };
}

export default async function ArticleDetailPage({
  params,
}: PageProps<"/[lang]/articles/[slug]">) {
  const { lang, slug } = await params;

  if (!hasLocale(lang)) {
    notFound();
  }

  const [dictionary, article] = await Promise.all([
    getDictionary(lang),
    findArticle(lang, slug),
  ]);
  const copy = dictionary.articleDirectory;

  if (!article) {
    notFound();
  }

  return (
    <main lang={lang} className={pageShellClassWide}>
      <div className="mx-auto max-w-4xl">
        <article className={panelClass}>
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-[var(--color-line-strong)] px-3 py-1 font-mono text-[0.66rem] uppercase tabular-nums text-[var(--color-accent)]">
              /articles/{article.slug}
            </span>
            <Link
              href={`/${lang}/articles`}
              className={buttonVariants({ variant: "ghost", size: "xs" })}
            >
              {copy.backToArticlesLabel}
            </Link>
          </div>

          <header className="mt-6 border-b border-[var(--color-line)] pb-6">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-[var(--color-line)] px-2.5 py-1 font-mono text-[0.62rem] uppercase text-[var(--color-accent)]">
                {article.category}
              </span>
              <span className="rounded-full border border-[var(--color-line)] px-2.5 py-1 font-mono text-[0.62rem] uppercase text-[var(--color-soft)]">
                {article.readingTime}
              </span>
            </div>

            <h1 className={`${titleClass} mt-5`}>{article.title}</h1>
            <p className={`${bodyClass} mt-4 max-w-3xl text-pretty`}>{article.summary}</p>

            <dl className="mt-6 flex flex-wrap gap-6">
              <div>
                <dt className={formLabel}>{copy.publishedLabel}</dt>
                <dd className="mt-2 text-sm text-[var(--color-text)]">
                  {article.publishedAt}
                </dd>
              </div>
              <div>
                <dt className={formLabel}>{copy.readingTimeLabel}</dt>
                <dd className="mt-2 text-sm text-[var(--color-text)]">
                  {article.readingTime}
                </dd>
              </div>
            </dl>
          </header>

          <div className="mt-6 space-y-6">
            <p className={`${bodyClass} text-pretty`}>{article.lead}</p>

            <div className="prose-custom">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                  h2: ({ children }) => (
                    <h2
                      className={`${headingClass} border-t border-[var(--color-line)] pt-6`}
                    >
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="mt-6 text-[1.12rem] font-semibold text-[var(--color-text)]">
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className={`${bodyClass} text-pretty`}>{children}</p>
                  ),
                  code: ({ className, children, ...props }) => {
                    const isInline = !className;
                    return isInline ? (
                      <code className={codeClass} {...props}>
                        {children}
                      </code>
                    ) : (
                      <pre className={preClass}>
                        <code className={className} {...props}>
                          {children}
                        </code>
                      </pre>
                    );
                  },
                  blockquote: ({ children }) => (
                    <blockquote className={blockquoteClass}>{children}</blockquote>
                  ),
                  ul: ({ children }) => (
                    <ul className={`${listClass} list-disc`}>{children}</ul>
                  ),
                  ol: ({ children }) => (
                    <ol className={`${listClass} list-decimal`}>{children}</ol>
                  ),
                  li: ({ children }) => (
                    <li className="text-[0.96rem] leading-[1.9] text-[var(--color-muted)] sm:text-[1rem]">
                      {children}
                    </li>
                  ),
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      className="text-[var(--color-accent)] underline underline-offset-2 hover:no-underline"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {children}
                    </a>
                  ),
                  hr: () => <hr className="border-t border-[var(--color-line)] my-8" />,
                  img: ({ src, alt }) => (
                    <img
                      src={src}
                      alt={alt ?? ""}
                      className="my-6 rounded border border-[var(--color-line)] max-w-full h-auto"
                    />
                  ),
                }}
              >
                {article.content}
              </ReactMarkdown>
            </div>
          </div>
        </article>
      </div>
    </main>
  );
}

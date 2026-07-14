import Link from "next/link";

import type { Locale, PortfolioDictionary } from "../lib/portfolio";
import { buttonBase, buttonSizes, buttonVariants } from "./ui/button";

const pageShellClass =
  "min-h-screen bg-[var(--color-bg)] px-5 py-8 text-[var(--color-text)] sm:px-8 sm:py-10";
const panelClass =
  "rounded-[1.45rem] border border-[var(--color-line-strong)] bg-[linear-gradient(180deg,rgba(10,20,16,0.96),rgba(6,12,9,0.96))] p-5 shadow-[inset_0_0_0_1px_rgba(111,247,166,0.04)] sm:p-6";
const labelClass =
  "font-mono text-[0.62rem] uppercase tabular-nums text-[var(--color-soft)]";
const bodyClass =
  "text-[0.88rem] leading-[1.8] text-[var(--color-muted)] sm:text-[0.92rem]";
const titleClass =
  '[font-family:var(--font-display),"Segoe_UI",sans-serif] text-[clamp(1.9rem,4vw,3.4rem)] font-semibold leading-[1.02] text-balance';

type LegalPageProps = {
  locale: Locale;
  dictionary: PortfolioDictionary;
  page: "terms" | "privacy";
  url: string;
};

const legalDates = {
  effectiveAt: "2026-06-16",
  updatedAt: "2026-06-16",
} as const;

export default function LegalPage({ locale, dictionary, page, url }: LegalPageProps) {
  const shared = dictionary.legal.shared;
  const content = dictionary.legal[page];

  return (
    <main lang={locale} className={pageShellClass}>
      <div className="mx-auto max-w-4xl">
        <div className={panelClass}>
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-[var(--color-line-strong)] px-3 py-1 font-mono text-[0.66rem] uppercase tabular-nums text-[var(--color-accent)]">
              /legal/{page}
            </span>
            <Link
              href={`/${locale}`}
              className={`${buttonBase} ${buttonVariants.ghost} ${buttonSizes.xs}`}
            >
              {shared.backToHome}
            </Link>
          </div>

          <div className="mt-6 space-y-4 border-b border-[var(--color-line)] pb-6">
            <h1 className={titleClass}>{content.title}</h1>
            <p className={`${bodyClass} max-w-3xl text-pretty`}>{shared.intro}</p>
            <p className={`${bodyClass} max-w-3xl text-pretty`}>{content.intro}</p>
          </div>

          <dl className="mt-6 grid gap-4 border-b border-[var(--color-line)] pb-6 sm:grid-cols-3">
            <div>
              <dt className={labelClass}>{shared.effectiveLabel}</dt>
              <dd className="mt-2 text-sm text-[var(--color-text)]">
                {legalDates.effectiveAt}
              </dd>
            </div>
            <div>
              <dt className={labelClass}>{shared.updatedLabel}</dt>
              <dd className="mt-2 text-sm text-[var(--color-text)]">
                {legalDates.updatedAt}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className={labelClass}>URL</dt>
              <dd className="mt-2 break-all font-mono text-sm text-[var(--color-accent)]">
                {url}
              </dd>
            </div>
          </dl>

          <div className="mt-6 space-y-5">
            {content.sections.map((section) => (
              <section
                key={section.heading}
                className="border-b border-[var(--color-line)] pb-5 last:border-b-0 last:pb-0"
              >
                <h2 className="text-xl font-semibold text-[var(--color-text)]">
                  {section.heading}
                </h2>
                <div className="mt-3 space-y-3">
                  {section.body.map((paragraph) => (
                    <p key={paragraph} className={`${bodyClass} text-pretty`}>
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-6 border-t border-[var(--color-line)] pt-5">
            <p className={labelClass}>{shared.contactLabel}</p>
            <a
              href="mailto:panyakorn40@gmail.com"
              className="mt-2 inline-flex font-mono text-sm text-[var(--color-accent)] transition-opacity duration-150 ease-out hover:opacity-80"
            >
              panyakorn40@gmail.com
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}

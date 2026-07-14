import type { Locale, PortfolioDictionary } from "../lib/portfolio";
import NavControls from "./nav-controls";

export default function Navbar({
  locale,
  dictionary,
}: {
  locale: Locale;
  dictionary: Pick<PortfolioDictionary, "ui" | "navItems" | "articleDirectory">;
}) {
  const t = dictionary.ui;
  const alternateLocale: Locale = locale === "en" ? "th" : "en";

  return (
    <div className="sticky top-0 z-40 border-b border-[var(--color-line)] bg-[rgba(11,13,12,0.92)] backdrop-blur-xl">
      <nav className="relative mx-auto max-w-[88rem] px-5 py-3 sm:px-8 lg:px-12">
        <div className="relative flex items-center justify-between gap-3 sm:gap-4">
          <a
            href={`/${locale}#top`}
            className="flex min-w-0 items-center gap-2.5 sm:gap-3"
          >
            <span className="grid size-10 shrink-0 place-items-center border border-[var(--color-line-strong)] font-mono text-[0.68rem] font-bold text-[var(--color-accent)]">
              PB
            </span>
            <div className="hidden min-w-0 sm:block">
              <p className="truncate text-sm font-semibold tracking-[-0.03em] text-[var(--color-text)]">
                Panyakorn Boonyong
              </p>
              <p className="truncate font-mono text-[0.62rem] uppercase tracking-[0.08em] text-[var(--color-soft)]">
                {t.brandRole}
              </p>
            </div>
          </a>

          <NavControls
            alternateLocale={alternateLocale}
            locale={locale}
            navItems={dictionary.navItems}
            ui={t}
            articleNavLabel={dictionary.articleDirectory.navLabel}
          />
        </div>
      </nav>
    </div>
  );
}

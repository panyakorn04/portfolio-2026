import type { Locale, PortfolioDictionary } from "../_data/portfolio";
import NavControls from "./nav-controls";

export default function Navbar({
  locale,
  dictionary,
}: {
  locale: Locale;
  dictionary: Pick<PortfolioDictionary, "ui" | "navItems">;
}) {
  const t = dictionary.ui;
  const alternateLocale: Locale = locale === "en" ? "th" : "en";

  return (
    <nav className="relative z-20 mx-auto max-w-7xl px-5 py-3 after:pointer-events-none after:absolute after:inset-x-5 after:-bottom-[0.2rem] after:h-px after:bg-[linear-gradient(90deg,rgba(111,247,166,0),rgba(111,247,166,0.24),rgba(111,247,166,0))] sm:px-8 sm:py-4 sm:after:inset-x-8">
      <div className="relative z-30 flex items-center justify-between gap-3 sm:gap-4">
        <a href={`/${locale}#top`} className="flex items-center gap-2.5 sm:gap-3">
          <span className="grid size-9 place-items-center rounded-[1.15rem] border border-[var(--color-line-strong)] bg-[var(--color-panel)] text-[0.68rem] font-semibold text-[var(--color-accent)] shadow-[inset_0_1px_0_rgba(111,247,166,0.06)] sm:size-10 sm:rounded-2xl sm:text-xs">
            PB
          </span>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold uppercase text-[var(--color-text)]">
              Panyakorn Boonyong
            </p>
            <p className="text-xs text-[var(--color-soft)]">{t.brandRole}</p>
          </div>
        </a>

        <NavControls
          alternateLocale={alternateLocale}
          locale={locale}
          navItems={dictionary.navItems}
          ui={t}
        />
      </div>
    </nav>
  );
}

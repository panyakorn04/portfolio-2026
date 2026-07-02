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
    <div className="sticky top-0 z-40 border-b border-[var(--color-line)] bg-[rgba(2,2,3,0.66)] backdrop-blur-2xl backdrop-saturate-150">
      <nav className="relative mx-auto max-w-[92rem] px-4 py-3 sm:px-6">
        <div className="relative flex items-center justify-between gap-3 sm:gap-4">
          <a
            href={`/${locale}#top`}
            className="flex min-w-0 items-center gap-2.5 sm:gap-3"
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-[0.7rem] bg-[linear-gradient(135deg,var(--color-accent),#16a34a)] font-mono text-[0.68rem] font-black text-[#05070a] shadow-[0_0_22px_var(--accent-glow)] sm:size-10 sm:text-xs">
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
          />
        </div>
      </nav>
    </div>
  );
}

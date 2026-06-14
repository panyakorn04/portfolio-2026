import type { Locale, PortfolioDictionary } from "../_data/portfolio";
import MobileNav from "./mobile-nav";

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
    <nav className="relative z-20 mx-auto max-w-7xl px-5 py-4 sm:px-8">
      <div className="relative z-30 flex items-center justify-between">
        <a href={`/${locale}#top`} className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-sm border border-[var(--color-line-strong)] bg-[var(--color-panel)] text-xs font-semibold text-[var(--color-accent)]">
            PB
          </span>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold uppercase text-[var(--color-text)]">
              Panyakorn Boonyong
            </p>
            <p className="text-xs text-[var(--color-soft)]">{t.brandRole}</p>
          </div>
        </a>

        <div className="hidden items-center gap-6 md:flex">
          {dictionary.navItems.map((item) => (
            <a
              key={item.id}
              href={`/${locale}#${item.id}`}
              className="text-sm uppercase text-[var(--color-soft)] transition hover:text-[var(--color-accent)]"
            >
              {item.label}
            </a>
          ))}
        </div>

        <MobileNav
          alternateLocale={alternateLocale}
          locale={locale}
          navItems={dictionary.navItems}
          ui={t}
        />
      </div>
    </nav>
  );
}

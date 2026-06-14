import type { Locale, PortfolioDictionary } from "../_data/portfolio";

type MobileNavProps = {
  alternateLocale: Locale;
  locale: Locale;
  navItems: PortfolioDictionary["navItems"];
  ui: Pick<
    PortfolioDictionary["ui"],
    "closeMenuLabel" | "contactCta" | "languageLabel" | "menuLabel"
  >;
};

export default function MobileNav({
  alternateLocale,
  locale,
  navItems,
  ui,
}: MobileNavProps) {
  return (
    <div className="flex items-center gap-2">
      <a href={`/${alternateLocale}#top`} className="terminal-button">
        {ui.languageLabel}
      </a>
      <a
        href="mailto:panyakorn40@gmail.com"
        className="terminal-button hidden sm:inline-flex"
      >
        {ui.contactCta}
      </a>

      <details className="terminal-mobile-nav md:hidden">
        <summary
          aria-controls="mobile-menu"
          className="terminal-button list-none [&::-webkit-details-marker]:hidden"
        >
          <span className="terminal-mobile-nav-closed">{ui.menuLabel}</span>
          <span className="terminal-mobile-nav-open">{ui.closeMenuLabel}</span>
        </summary>

        <div id="mobile-menu" className="terminal-menu-drawer is-open">
          <div className="mb-3 flex items-center justify-between border-b border-[var(--color-line)] pb-2.5">
            <p className="terminal-label">{ui.menuLabel}</p>
            <span className="text-[0.58rem] uppercase text-[var(--color-soft)]">
              session://nav
            </span>
          </div>

          <div className="grid gap-2">
            {navItems.map((item, index) => (
              <a
                key={item.id}
                href={`/${locale}#${item.id}`}
                className="terminal-menu-link"
              >
                <span className="text-[0.58rem] uppercase text-[var(--color-soft)]">
                  0{index + 1}
                </span>
                <span className="mt-1 text-[0.74rem] text-[var(--color-text)]">
                  {item.label}
                </span>
              </a>
            ))}
            <a href="mailto:panyakorn40@gmail.com" className="terminal-menu-link">
              <span className="text-[0.58rem] uppercase text-[var(--color-soft)]">
                0{navItems.length + 1}
              </span>
              <span className="mt-1 text-[0.74rem] text-[var(--color-text)]">
                {ui.contactCta}
              </span>
            </a>
          </div>
        </div>
      </details>
    </div>
  );
}

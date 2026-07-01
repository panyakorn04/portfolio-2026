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
        <div className="sticky top-0 z-40 border-b border-[rgba(111,247,166,0.08)] bg-[rgba(7,14,10,0.82)] backdrop-blur-md">
            <nav className="relative mx-auto max-w-7xl px-5 py-3 sm:px-8 sm:py-4">
                <div className="relative flex items-center justify-between gap-3 sm:gap-4">
                    <a
                        href={`/${locale}#top`}
                        className="flex items-center gap-2.5 sm:gap-3"
                    >
                        <span className="grid size-9 place-items-center rounded-xl border border-[rgba(111,247,166,0.2)] bg-[rgba(111,247,166,0.08)] text-[0.68rem] font-semibold text-[var(--color-accent)] shadow-[inset_0_1px_0_rgba(111,247,166,0.08)] transition-all duration-200 hover:border-[rgba(111,247,166,0.35)] hover:bg-[rgba(111,247,166,0.12)] sm:size-10 sm:rounded-xl sm:text-xs">
                            PB
                        </span>
                        <div className="hidden sm:block">
                            <p className="text-sm font-semibold text-[var(--color-text)]">
                                Panyakorn Boonyong
                            </p>
                            <p className="text-[0.72rem] text-[var(--color-soft)]">
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

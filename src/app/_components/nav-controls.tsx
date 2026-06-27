"use client";

import Link from "next/link";

import { articleDirectoryCopy } from "../_data/articles";
import type { Locale, PortfolioDictionary } from "../_data/portfolio";
import { useActiveSection } from "../_hooks/use-active-section";
import MobileNav from "./mobile-nav";
import ReadingProgress from "./reading-progress";

type NavControlsProps = {
  alternateLocale: Locale;
  locale: Locale;
  navItems: PortfolioDictionary["navItems"];
  ui: Pick<
    PortfolioDictionary["ui"],
    "brandRole" | "closeMenuLabel" | "contactCta" | "languageLabel" | "menuLabel"
  >;
};

export default function NavControls({
  alternateLocale,
  locale,
  navItems,
  ui,
}: NavControlsProps) {
  const activeSectionId = useActiveSection(navItems.map((item) => item.id));
  const activeItem = navItems.find((item) => item.id === activeSectionId);
  const articleLabel = articleDirectoryCopy[locale].navLabel;

  return (
    <>
      <ReadingProgress activeLabel={activeItem?.label} />

      <div className="hidden items-center gap-3 md:flex">
        <div className="flex items-center gap-1 rounded-full border border-[var(--color-line)] bg-[rgba(8,16,12,0.72)] p-1 shadow-[inset_0_1px_0_rgba(111,247,166,0.04)]">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`/${locale}#${item.id}`}
              aria-current={activeSectionId === item.id ? "location" : undefined}
              className={`rounded-full border px-3 py-2 text-[0.7rem] uppercase tracking-[0.04em] ${
                activeSectionId === item.id
                  ? "border-[rgba(111,247,166,0.18)] bg-[linear-gradient(180deg,rgba(111,247,166,0.16),rgba(111,247,166,0.08))] text-[var(--color-text)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                  : "border-transparent text-[var(--color-soft)] hover:border-[rgba(111,247,166,0.12)] hover:bg-[rgba(111,247,166,0.08)] hover:text-[var(--color-accent)]"
              }`}
            >
              {item.label}
            </a>
          ))}
        </div>
        <Link
          href={`/${locale}/articles`}
          className="rounded-full border border-[var(--color-line)] bg-[rgba(8,16,12,0.72)] px-3 py-2 text-[0.7rem] uppercase tracking-[0.04em] text-[var(--color-soft)] transition-colors hover:border-[rgba(111,247,166,0.18)] hover:text-[var(--color-accent)]"
        >
          {articleLabel}
        </Link>
      </div>

      <MobileNav
        activeSectionId={activeSectionId}
        alternateLocale={alternateLocale}
        locale={locale}
        navItems={navItems}
        ui={ui}
      />
    </>
  );
}

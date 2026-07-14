"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useActiveSection } from "../hooks/use-active-section";
import { articleDirectoryCopy } from "../lib/articles";
import type { Locale, PortfolioDictionary } from "../lib/portfolio";
import MobileNav from "./mobile-nav";
import ReadingProgress from "./reading-progress";
import { buttonBase, buttonVariants } from "./ui/button";

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
  const sectionIds = useMemo(() => navItems.map((item) => item.id), [navItems]);
  const activeSectionId = useActiveSection(sectionIds);
  const articleLabel = articleDirectoryCopy[locale].navLabel;

  return (
    <>
      <ReadingProgress />

      <div className="hidden items-center gap-3 md:flex">
        <div className="flex items-center gap-1 rounded-full border border-[var(--color-line)] bg-[var(--surface)] p-1 shadow-[var(--shadow-panel)] backdrop-blur-2xl">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`/${locale}#${item.id}`}
              aria-current={activeSectionId === item.id ? "location" : undefined}
              className={`whitespace-nowrap rounded-full border px-3 py-2 text-[0.7rem] uppercase tracking-[0.04em] transition-all duration-200 ${
                activeSectionId === item.id
                  ? "border-[var(--accent-border)] bg-[var(--accent-dim)] text-[var(--color-text)] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
                  : "border-transparent text-[var(--color-soft)] hover:border-[var(--color-line)] hover:bg-[var(--surface-hover)] hover:text-[var(--color-text)]"
              }`}
            >
              {item.label}
            </a>
          ))}
        </div>
        <Link
          href={`/${locale}/articles`}
          className={`${buttonBase} ${buttonVariants.chip} px-3 py-2 text-[0.7rem]`}
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

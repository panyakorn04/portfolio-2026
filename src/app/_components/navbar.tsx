"use client";

import Link from "next/link";
import { useState } from "react";

import type { Locale, PortfolioDictionary } from "../_data/portfolio";

export default function Navbar({
  locale,
  dictionary,
}: {
  locale: Locale;
  dictionary: Pick<PortfolioDictionary, "ui" | "navItems">;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const t = dictionary.ui;
  const alternateLocale: Locale = locale === "en" ? "th" : "en";

  return (
    <nav className="relative z-20 mx-auto max-w-7xl px-5 py-4 sm:px-8">
      <div className="relative z-30 flex items-center justify-between">
        <Link href={`/${locale}#top`} className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-sm border border-[var(--color-line-strong)] bg-[var(--color-panel)] text-xs font-semibold text-[var(--color-accent)]">
            PB
          </span>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold uppercase text-[var(--color-text)]">
              Panyakorn Boonyong
            </p>
            <p className="text-xs text-[var(--color-soft)]">{t.brandRole}</p>
          </div>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {dictionary.navItems.map((item) => (
            <Link
              key={item.id}
              href={`/${locale}#${item.id}`}
              className="text-sm uppercase text-[var(--color-soft)] transition hover:text-[var(--color-accent)]"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/${alternateLocale}#top`}
            onClick={() => setIsMenuOpen(false)}
            className="terminal-button"
          >
            {t.languageLabel}
          </Link>
          <a
            href="mailto:panyakorn40@gmail.com"
            className="terminal-button hidden sm:inline-flex"
          >
            {t.contactCta}
          </a>
          <button
            type="button"
            aria-label={isMenuOpen ? t.closeMenuLabel : t.menuLabel}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            onClick={() => setIsMenuOpen((open) => !open)}
            className="terminal-button md:hidden"
          >
            {isMenuOpen ? t.closeMenuLabel : t.menuLabel}
          </button>
        </div>
      </div>

      <div className="md:hidden">
        <button
          type="button"
          aria-label={t.closeMenuLabel}
          onClick={() => setIsMenuOpen(false)}
          className={`terminal-menu-backdrop ${isMenuOpen ? "is-open" : ""}`}
        />
        <div
          id="mobile-menu"
          className={`terminal-menu-drawer ${isMenuOpen ? "is-open" : ""}`}
        >
          <div className="mb-3 flex items-center justify-between border-b border-[var(--color-line)] pb-2.5">
            <p className="terminal-label">{t.menuLabel}</p>
            <span className="text-[0.58rem] uppercase text-[var(--color-soft)]">
              session://nav
            </span>
          </div>

          <div className="grid gap-2">
            {dictionary.navItems.map((item, index) => (
              <Link
                key={item.id}
                href={`/${locale}#${item.id}`}
                onClick={() => setIsMenuOpen(false)}
                className="terminal-menu-link"
              >
                <span className="text-[0.58rem] uppercase text-[var(--color-soft)]">
                  0{index + 1}
                </span>
                <span className="mt-1 text-[0.74rem] text-[var(--color-text)]">
                  {item.label}
                </span>
              </Link>
            ))}
            <a
              href="mailto:panyakorn40@gmail.com"
              onClick={() => setIsMenuOpen(false)}
              className="terminal-menu-link"
            >
              <span className="text-[0.58rem] uppercase text-[var(--color-soft)]">
                0{dictionary.navItems.length + 1}
              </span>
              <span className="mt-1 text-[0.74rem] text-[var(--color-text)]">
                {t.contactCta}
              </span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { articleDirectoryCopy } from "../_data/articles";
import type { Locale, PortfolioDictionary } from "../_data/portfolio";
import { Button, buttonBase, buttonVariants, buttonSizes } from "./button";

type MobileNavProps = {
  activeSectionId: string | null;
  alternateLocale: Locale;
  locale: Locale;
  navItems: PortfolioDictionary["navItems"];
  ui: Pick<
    PortfolioDictionary["ui"],
    "closeMenuLabel" | "contactCta" | "languageLabel" | "menuLabel"
  >;
};

export default function MobileNav({
  activeSectionId,
  alternateLocale,
  locale,
  navItems,
  ui,
}: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const articleLabel = articleDirectoryCopy[locale].navLabel;
  const actionButtonClass = `${buttonBase} ${buttonVariants.action} px-[0.92rem] py-[0.68rem] text-[0.66rem] tabular-nums sm:px-[0.9rem] sm:py-[0.68rem] sm:text-[0.7rem]`;

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  function closeMenu() {
    setIsOpen(false);
  }

  function toggleMenu() {
    setIsOpen((current) => !current);
  }

  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      <a
        href={`/${alternateLocale}#top`}
        className={`${actionButtonClass} px-[0.78rem] sm:px-[0.9rem]`}
      >
        {ui.languageLabel}
      </a>
      <a
        href="mailto:panyakorn40@gmail.com"
        className={`${actionButtonClass} hidden sm:inline-flex`}
      >
        {ui.contactCta}
      </a>

      <div className="relative md:hidden">
        {/* Hamburger toggle button */}
        <Button
          type="button"
          aria-controls="mobile-menu"
          aria-label={isOpen ? ui.closeMenuLabel : ui.menuLabel}
          aria-expanded={isOpen}
          variant="action"
          className="h-11 w-11 p-0 text-foreground hover:border-(--color-accent) hover:text-(--color-accent) motion-reduce:transition-none"
          onClick={toggleMenu}
        >
          <span className="sr-only">{ui.menuLabel}</span>
          <span className="sr-only">{ui.closeMenuLabel}</span>
          <span
            aria-hidden="true"
            className="relative inline-flex h-[0.64rem] w-[0.82rem] items-center justify-center"
          >
            <span
              className={`absolute h-[1.5px] w-full rounded-full bg-current transition-all duration-200 motion-reduce:transition-none ${
                isOpen ? "top-[calc(50%-0.75px)] rotate-45" : "top-0"
              }`}
            />
            <span
              className={`absolute top-[calc(50%-0.75px)] h-[1.5px] w-full rounded-full bg-current transition-all duration-200 motion-reduce:transition-none ${
                isOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`absolute h-[1.5px] w-full rounded-full bg-current transition-all duration-200 motion-reduce:transition-none ${
                isOpen ? "top-[calc(50%-0.75px)] -rotate-45" : "bottom-0"
              }`}
            />
          </span>
        </Button>

        {/* Backdrop */}
        <button
          type="button"
          aria-label={ui.closeMenuLabel}
          className={`fixed inset-0 z-20 cursor-default border-0 bg-[rgba(5,11,8,0.72)] transition-opacity duration-180 ease-in-out motion-reduce:transition-none ${
            isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
          onClick={closeMenu}
        />

        {/* Drawer — slides in from the left */}
        <div
          id="mobile-menu"
          className={`absolute right-0 top-full z-30 mt-3 min-w-50 rounded-[1.35rem] border border-(--color-line-strong) bg-(--color-panel) py-[0.85rem] px-[0.9rem] shadow-[0_16px_48px_rgba(0,0,0,0.32)] transition-all duration-220 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
            isOpen
              ? "opacity-100 pointer-events-auto translate-x-0"
              : "opacity-0 pointer-events-none -translate-x-4"
          }`}
        >
          <div className="mb-3 flex items-center justify-between border-b border-(--color-line) pb-2.5">
            <p className="font-mono text-[0.58rem] uppercase tracking-[0.06em] tabular-nums text-(--color-soft)">
              {ui.menuLabel}
            </p>
            <span className="text-[0.58rem] uppercase text-(--color-soft)">
              session://nav
            </span>
          </div>

          <div className="grid gap-2">
            {navItems.map((item, index) => (
              <a
                key={item.id}
                href={`/${locale}#${item.id}`}
                aria-current={activeSectionId === item.id ? "location" : undefined}
                className={`flex flex-col rounded-[1.15rem] border py-[0.85rem] px-[0.9rem] font-mono tabular-nums transition-colors motion-reduce:transition-none hover:border-(--color-accent) hover:text-(--color-accent) ${
                  activeSectionId === item.id
                    ? "border-(--color-line-strong) bg-linear-to-b from-[rgba(111,247,166,0.14)] to-[rgba(111,247,166,0.05)]"
                    : "border-(--color-line) bg-[rgba(10,20,16,0.65)]"
                }`}
                onClick={closeMenu}
              >
                <span className="text-[0.58rem] uppercase text-(--color-soft)">
                  0{index + 1}
                </span>
                <span className="mt-1 text-[0.74rem] text-foreground">{item.label}</span>
              </a>
            ))}
            <Link
              href={`/${locale}/articles`}
              className="flex flex-col rounded-[1.15rem] border border-(--color-line) bg-[rgba(10,20,16,0.65)] py-[0.85rem] px-[0.9rem] font-mono tabular-nums transition-colors motion-reduce:transition-none hover:border-(--color-accent) hover:text-(--color-accent)"
              onClick={closeMenu}
            >
              <span className="text-[0.58rem] uppercase text-(--color-soft)">
                0{navItems.length + 1}
              </span>
              <span className="mt-1 text-[0.74rem] text-foreground">{articleLabel}</span>
            </Link>
            <a
              href="mailto:panyakorn40@gmail.com"
              className="flex flex-col rounded-[1.15rem] border border-(--color-line) bg-[rgba(10,20,16,0.65)] py-[0.85rem] px-[0.9rem] font-mono tabular-nums transition-colors motion-reduce:transition-none hover:border-(--color-accent) hover:text-(--color-accent)"
              onClick={closeMenu}
            >
              <span className="text-[0.58rem] uppercase text-(--color-soft)">
                0{navItems.length + 2}
              </span>
              <span className="mt-1 text-[0.74rem] text-foreground">{ui.contactCta}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

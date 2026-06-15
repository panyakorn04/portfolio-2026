"use client";

import { useEffect, useState } from "react";

import type { PortfolioDictionary } from "../_data/portfolio";
import { useReadingProgress } from "../_hooks/use-reading-progress";

// Approximate navbar height on mobile (py-3 + h-9 content ≈ 60px)
const NAV_HEIGHT_PX = 64;

export default function ReadingProgress({
  activeLabel,
}: {
  activeLabel?: PortfolioDictionary["navItems"][number]["label"];
}) {
  const progress = useReadingProgress();
  const [pastNav, setPastNav] = useState(false);

  useEffect(() => {
    function check() {
      setPastNav(window.scrollY > NAV_HEIGHT_PX);
    }
    check();
    window.addEventListener("scroll", check, { passive: true });
    return () => window.removeEventListener("scroll", check);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-50" aria-hidden="true">
      <div className="h-[2px] bg-[rgba(111,247,166,0.08)]">
        <div
          className="h-full w-full origin-left bg-[linear-gradient(90deg,rgba(111,247,166,0.72),rgba(166,255,210,0.96))] shadow-[0_0_18px_rgba(111,247,166,0.28)]"
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>
      <div
        className={`ml-auto mt-[0.65rem] mr-4 flex w-fit items-center gap-[0.42rem] rounded-full border border-[rgba(111,247,166,0.12)] bg-[rgba(8,16,12,0.72)] px-[0.62rem] py-[0.38rem] backdrop-blur-[10px] max-sm:mr-3 max-sm:mt-2 max-sm:px-[0.56rem] max-sm:py-[0.32rem] max-sm:text-[0.52rem] ${
          pastNav
            ? "max-sm:translate-y-0 max-sm:opacity-100"
            : "max-sm:-translate-y-1 max-sm:opacity-0"
        }`}
      >
        <span className="h-[0.42rem] w-[0.42rem] rounded-full bg-[var(--color-accent)] shadow-[0_0_0_0_rgba(111,247,166,0.34)] animate-[terminal-progress-pulse_1800ms_ease_infinite] motion-reduce:animate-none" />
        <span className="font-mono text-[0.56rem] uppercase tracking-[0.06em] text-[var(--color-soft)] max-sm:text-[0.52rem]">
          {activeLabel ?? "Overview"}
        </span>
      </div>
    </div>
  );
}

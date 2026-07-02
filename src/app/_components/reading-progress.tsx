"use client";

import { useEffect } from "react";

import { useReadingProgress } from "../_hooks/use-reading-progress";

const NAV_HEIGHT_PX = 64;

export default function ReadingProgress() {
  const progress = useReadingProgress();

  useEffect(() => {
    function check() {
      // keep for future label visibility toggle
      window.scrollY > NAV_HEIGHT_PX;
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
    </div>
  );
}

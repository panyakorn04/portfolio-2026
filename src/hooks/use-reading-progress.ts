"use client";

import { useEffect, useState } from "react";

export function useReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let animationFrame: number | null = null;

    function updateProgress() {
      const documentElement = document.documentElement;
      const scrollTop = documentElement.scrollTop || document.body.scrollTop;
      const scrollHeight = documentElement.scrollHeight - documentElement.clientHeight;

      if (scrollHeight <= 0) {
        setProgress(0);
        return;
      }

      const nextProgress = Math.min(Math.max(scrollTop / scrollHeight, 0), 1);
      setProgress(nextProgress);
    }

    function scheduleUpdate() {
      if (animationFrame !== null) return;
      animationFrame = window.requestAnimationFrame(() => {
        animationFrame = null;
        updateProgress();
      });
    }

    updateProgress();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate, { passive: true });

    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      if (animationFrame !== null) window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  return progress;
}

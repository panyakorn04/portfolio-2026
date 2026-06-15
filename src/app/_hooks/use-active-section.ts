"use client";

import { useEffect, useState } from "react";

export function useActiveSection(sectionIds: string[]) {
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);

  useEffect(() => {
    if (sectionIds.length === 0) {
      return;
    }

    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element instanceof HTMLElement);

    if (sections.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((first, second) => second.intersectionRatio - first.intersectionRatio);

        const nextSectionId = visibleEntries[0]?.target.id;

        if (nextSectionId) {
          setActiveSectionId(nextSectionId);
        }
      },
      {
        rootMargin: "-18% 0px -54% 0px",
        threshold: [0.12, 0.24, 0.4, 0.58],
      },
    );

    sections.forEach((section) => {
      observer.observe(section);
    });

    function handleScroll() {
      const viewportPivot = window.innerHeight * 0.28;
      const nextVisibleSection = sections.find((section) => {
        const bounds = section.getBoundingClientRect();

        return bounds.top <= viewportPivot && bounds.bottom >= viewportPivot;
      });

      if (nextVisibleSection) {
        setActiveSectionId(nextVisibleSection.id);
        return;
      }

      if (window.scrollY < 120) {
        setActiveSectionId(null);
      }
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [sectionIds]);

  return activeSectionId;
}

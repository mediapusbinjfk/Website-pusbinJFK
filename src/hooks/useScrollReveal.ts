"use client";

import { useEffect, useRef } from "react";

/**
 * Smooth scroll-reveal with per-element stagger.
 *
 * Mark sections with data-reveal="section".
 * Children with data-reveal="item" inside each section will be
 * staggered automatically (60ms apart).
 *
 * Plain .scroll-reveal still works as a full-section reveal.
 */
export function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    /* ── Stagger items inside a section ── */
    const applyStagger = (section: HTMLElement) => {
      const items = Array.from(
        section.querySelectorAll<HTMLElement>("[data-reveal='item']")
      );
      items.forEach((el, i) => {
        el.style.animationDelay = `${i * 60}ms`;
      });
    };

    /* ── IntersectionObserver ── */
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;

          if (el.dataset.reveal === "section") {
            applyStagger(el);
            // Reveal section wrapper first, then cascade to children
            el.classList.add("revealed");
            el.querySelectorAll<HTMLElement>("[data-reveal='item']")
              .forEach((child) => child.classList.add("revealed"));
          } else {
            el.classList.add("revealed");
          }
          io.unobserve(el);
        });
      },
      // Pre-load 80px before element enters viewport for seamless feel
      { threshold: 0.05, rootMargin: "0px 0px -60px 0px" }
    );

    const observe = (root: Element) => {
      // Observe both legacy scroll-reveal and new data-reveal sections
      root.querySelectorAll<HTMLElement>(
        ".scroll-reveal:not(.revealed), [data-reveal='section']:not(.revealed)"
      ).forEach((el) => io.observe(el));
    };

    observe(container);

    const mo = new MutationObserver(() => observe(container));
    mo.observe(container, { childList: true, subtree: true });

    // Fallback for above-the-fold elements
    const fallback = setTimeout(() => {
      container.querySelectorAll<HTMLElement>(
        ".scroll-reveal:not(.revealed), [data-reveal='section']:not(.revealed)"
      ).forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight + 100) {
          if (el.dataset.reveal === "section") {
            applyStagger(el);
            el.querySelectorAll<HTMLElement>("[data-reveal='item']")
              .forEach((child) => child.classList.add("revealed"));
          }
          el.classList.add("revealed");
        }
      });
    }, 150);

    return () => {
      io.disconnect();
      mo.disconnect();
      clearTimeout(fallback);
    };
  }, []);

  return ref;
}

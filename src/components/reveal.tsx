"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * One reveal pass for the whole app: any element with `data-reveal` fades + rises
 * into place. Robust by design — elements already in view reveal immediately (the
 * entrance, works even where IntersectionObserver is throttled), the rest reveal on
 * scroll via IO, and a safety-net timer guarantees nothing stays hidden if IO never
 * fires. CSS lives in globals.css, gated behind `.js` + reduced-motion. Re-runs per route.
 */
export function ScrollReveal() {
  const pathname = usePathname();
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not(.in)"));
    if (els.length === 0) return;
    const reveal = (el: Element) => el.classList.add("in");
    const inView = (el: HTMLElement) => {
      const r = el.getBoundingClientRect();
      return r.bottom > 0 && r.top < window.innerHeight * 0.92;
    };

    // Reveal anything already on-screen immediately, before rAF/IO, so above-the-fold
    // content (e.g. the hero headline) never sits hidden waiting on hydration.
    for (const el of els) if (inView(el)) reveal(el);

    let io: IntersectionObserver | null = null;
    const raf = requestAnimationFrame(() => {
      if (typeof IntersectionObserver !== "undefined") {
        io = new IntersectionObserver(
          (entries) => {
            for (const e of entries) {
              if (e.isIntersecting) {
                reveal(e.target);
                io!.unobserve(e.target);
              }
            }
          },
          { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
        );
      }
      for (const el of els) {
        if (!io || inView(el)) reveal(el);
        else io.observe(el);
      }
    });

    const fallback = window.setTimeout(() => els.forEach(reveal), 2500);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(fallback);
      io?.disconnect();
    };
  }, [pathname]);
  return null;
}

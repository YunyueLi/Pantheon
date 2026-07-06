"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * One reveal pass for the whole app: any element with `data-reveal` fades + rises
 * into place. Robust by design — elements already in view reveal immediately (the
 * entrance, works even where IntersectionObserver is throttled), the rest reveal on
 * scroll via IO, and a safety-net timer guarantees nothing stays hidden if IO never
 * fires. A MutationObserver re-scans when `[data-reveal]` nodes mount without a route
 * change (leaderboard filters, gender toggle, search) so re-rendered content can't get
 * stuck at opacity 0. CSS lives in globals.css, gated behind `.js` + reduced-motion.
 */
export function ScrollReveal() {
  const pathname = usePathname();
  useEffect(() => {
    const reveal = (el: Element) => el.classList.add("in");
    const inView = (el: HTMLElement) => {
      const r = el.getBoundingClientRect();
      return r.bottom > 0 && r.top < window.innerHeight * 0.92;
    };

    let io: IntersectionObserver | null = null;
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

    // Reveal in-view elements now (getBoundingClientRect flushes layout, so this works
    // for freshly-mounted nodes too); hand the rest to IO to reveal on scroll.
    const scan = () => {
      for (const el of document.querySelectorAll<HTMLElement>("[data-reveal]:not(.in)")) {
        if (!io || inView(el)) reveal(el);
        else io.observe(el);
      }
    };
    scan();

    // Re-scan only when nodes carrying `[data-reveal]` actually mount — ignore the
    // churn of tooltips, dropdowns and other portals so an idle hover doesn't schedule
    // work. Coalesce a burst (hydration, a filter re-render) into one scan per frame.
    let scheduled = false;
    const carriesReveal = (n: Node) =>
      n.nodeType === 1 &&
      ((n as Element).matches?.("[data-reveal]") || (n as Element).querySelector?.("[data-reveal]") != null);
    const mo = new MutationObserver((muts) => {
      if (scheduled) return;
      for (const m of muts) {
        for (const n of m.addedNodes) {
          if (!carriesReveal(n)) continue;
          scheduled = true;
          requestAnimationFrame(() => {
            scheduled = false;
            scan();
          });
          return;
        }
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    const fallback = window.setTimeout(() => {
      document.querySelectorAll<HTMLElement>("[data-reveal]:not(.in)").forEach(reveal);
    }, 2500);
    return () => {
      clearTimeout(fallback);
      io?.disconnect();
      mo.disconnect();
    };
  }, [pathname]);
  return null;
}

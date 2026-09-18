"use client";

import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

/*
  Page-wide scroll animations:
  .gsap-reveal        - subtle fade-up on entering the viewport (elements already in view are not hidden)
  [data-fx="line"]    - line "draws" in from the left (scaleX)
  [data-fx="pop"]     - element pops in (scale + fade)
  [data-fx="float"]   - decor floats gently up and down
  [data-fx="breathe"] - decor slowly "breathes" (scale)
*/
export function Reveal() {
  useGSAP(() => {
    // Web fonts can re-wrap text after the first measurement; re-measure pinned sections once they are in
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    if (prefersReducedMotion()) return;
    const vh = window.innerHeight;

    const els = gsap.utils
      .toArray<HTMLElement>(".gsap-reveal")
      .filter((el) => el.getBoundingClientRect().top > vh * 0.9);
    if (els.length) {
      gsap.set(els, { opacity: 0, y: 20 });
      ScrollTrigger.batch(els, {
        start: "top 90%",
        once: true,
        onEnter: (batch) => {
          gsap.to(batch, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out", stagger: 0.07, overwrite: true });
          const bars = batch.flatMap((el) => Array.from(el.querySelectorAll<HTMLElement>(".eyebrow-bar")));
          if (bars.length) {
            gsap.from(bars, { scaleX: 0, transformOrigin: "left center", duration: 0.7, ease: "power2.out", delay: 0.15 });
          }
        },
      });
    }

    const lines = gsap.utils.toArray<HTMLElement>("[data-fx='line']");
    if (lines.length) {
      gsap.set(lines, { scaleX: 0, transformOrigin: "left center" });
      ScrollTrigger.batch(lines, {
        start: "top 85%",
        once: true,
        onEnter: (batch) => gsap.to(batch, { scaleX: 1, duration: 1.1, ease: "power2.out", stagger: 0.1, overwrite: true }),
      });
    }

    const pops = gsap.utils.toArray<HTMLElement>("[data-fx='pop']");
    if (pops.length) {
      gsap.set(pops, { scale: 0.92, autoAlpha: 0, transformOrigin: "center" });
      ScrollTrigger.batch(pops, {
        start: "top 88%",
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, { scale: 1, autoAlpha: 1, duration: 0.6, ease: "power2.out", stagger: 0.1, delay: 0.25, overwrite: true }),
      });
    }

    gsap.utils.toArray<HTMLElement>("[data-fx='float']").forEach((el, i) => {
      gsap.to(el, { y: -12, duration: 5 + (i % 3), ease: "sine.inOut", yoyo: true, repeat: -1 });
    });

    gsap.utils.toArray<HTMLElement>("[data-fx='breathe']").forEach((el, i) => {
      gsap.to(el, { scale: 1.05, transformOrigin: "center", duration: 7 + i, ease: "sine.inOut", yoyo: true, repeat: -1 });
    });
  });
  return null;
}

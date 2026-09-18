"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { PRELOADER_DONE_EVENT } from "@/components/Preloader";

/*
  Úvodná sekvencia hero (štartuje po preloaderi), parallax telefónu a jemný pohyb dekoru.
  Rešpektuje prefers-reduced-motion.
*/
export function HeroMotion({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(ref);
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Stránka otvorená v skrytom tabe (rAF stojí) – intro preskočíme, obsah ostane viditeľný
        if (document.visibilityState !== "visible") return;

        const tl = gsap.timeline({ defaults: { ease: "power2.out" }, paused: true });
        // h1 a browser vizuál sú LCP kandidáti – animujú sa len posunom (bez opacity), aby LCP ostalo skoré
        tl.from(q("[data-hero='decor'], [data-hero='route']"), { autoAlpha: 0, duration: 1.4, ease: "power2.out" }, 0)
          .from(q("[data-hero='copy'] > :not(h1)"), { y: 26, autoAlpha: 0, duration: 0.8, stagger: 0.09 }, 0.1)
          .from(q("[data-hero='copy'] > h1"), { y: 26, duration: 0.8 }, 0.15)
          .from(q("[data-hero='browser']"), { y: 56, duration: 1.1 }, 0.5)
          .from(q("[data-hero='phone']"), { y: 90, rotate: 2.5, autoAlpha: 0, duration: 1.1 }, 0.7)
          .from(q("[data-hero='label'], [data-hero='caption']"), { y: 10, autoAlpha: 0, duration: 0.6, stagger: 0.12 }, 1.2);

        // Intro štartuje až po preloaderi (ak nebol zobrazený, flag je nastavený hneď)
        const start = () => tl.play();
        if (window.__adosPreloaderDone) start();
        else window.addEventListener(PRELOADER_DONE_EVENT, start, { once: true });

        // Bloby jemne plávajú
        gsap.to(q("[data-hero-blob]"), {
          y: -18,
          x: 10,
          duration: 7,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          stagger: { each: 1.2, from: "random" },
        });

        // Trasy: bodky pomaly „pochodujú" po ceste – jediný pohyb dekoru v hero
        q<SVGPathElement>("[data-hero='route'] path").forEach((path) => {
          gsap.to(path, { strokeDashoffset: -22, duration: 2.4, ease: "none", repeat: -1 });
        });

        // Parallax: telefón sa pri scrolle hýbe pomalšie než browser
        gsap.to(q("[data-hero='phone-wrap']"), {
          y: -56,
          ease: "none",
          scrollTrigger: {
            trigger: q("[data-hero='visual']")[0],
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });

        return () => window.removeEventListener(PRELOADER_DONE_EVENT, start);
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="contents">
      {children}
    </div>
  );
}

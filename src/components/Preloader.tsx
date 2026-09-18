"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { BRAND, BRAND_MARK_PATHS } from "@/lib/brand";

export const PRELOADER_DONE_EVENT = "ados:preloader-done";

declare global {
  interface Window {
    __adosPreloaderDone?: boolean;
  }
}

function markDone() {
  window.__adosPreloaderDone = true;
  window.dispatchEvent(new Event(PRELOADER_DONE_EVENT));
}

/*
  Preloader: the Alma mark (two palms and a person) is drawn on the tile, the wordmark appears, a progress bar runs at the bottom,
  the overlay fades out and only then does the hero intro start (HeroMotion listens for PRELOADER_DONE_EVENT).
  Shown on every load of the home page (desktop and mobile); skipped with prefers-reduced-motion.
*/
export function Preloader() {
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(true);

  // Decide before the first client render, so there is no flash
  useLayoutEffect(() => {
    // Home page only, visible tab, no reduced motion
    const skip = pathname !== "/" || prefersReducedMotion() || document.visibilityState !== "visible";
    if (skip) {
      setActive(false);
      markDone();
    }
  }, [pathname]);

  useGSAP(
    () => {
      if (!active || !ref.current) return;
      const root = ref.current;
      const paths = gsap.utils.toArray<SVGGeometryElement>(".pre-path", root);
      if (!paths.length) return;
      paths.forEach((p) => {
        const len = p.getTotalLength();
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
      });
      document.body.style.overflow = "hidden";

      const finish = () => {
        document.body.style.overflow = "";
        setActive(false);
        markDone();
        ScrollTrigger.refresh();
      };

      const tl = gsap.timeline({ defaults: { ease: "power2.out" }, onComplete: finish });
      // Safety net: if the animation fails to finish for any reason, the preloader ends itself after 3 s
      let done = false;
      const guard = window.setTimeout(() => {
        if (!done) {
          tl.kill();
          finish();
        }
      }, 3000);
      tl.eventCallback("onComplete", () => {
        done = true;
        window.clearTimeout(guard);
        finish();
      });
      // Initial states are also set in inline styles (before hydration the overlay is empty, not "finished")
      tl.fromTo(root.querySelector(".pre-tile"), { scale: 0.85, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.35 }, 0)
        .to(paths, { strokeDashoffset: 0, duration: 0.5, ease: "sine.inOut", stagger: 0.08 }, 0.1)
        .fromTo(
          root.querySelectorAll(".pre-word"),
          { y: 10, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.4, stagger: 0.06 },
          0.3,
        )
        .fromTo(root.querySelector(".pre-bar"), { scaleX: 0 }, { scaleX: 1, duration: 0.8, ease: "sine.inOut" }, 0)
        .to(root.querySelector(".pre-inner"), { y: -24, autoAlpha: 0, duration: 0.3, ease: "power2.in" }, 0.85)
        .to(root, { autoAlpha: 0, duration: 0.5, ease: "power2.inOut" }, 0.95);

      return () => {
        window.clearTimeout(guard);
        document.body.style.overflow = "";
      };
    },
    { scope: ref, dependencies: [active] },
  );

  if (!active) return null;

  return (
    <div
      ref={ref}
      role="status"
      aria-label="Načítava sa stránka"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-bg-page"
    >
      <div className="pre-inner flex flex-col items-center gap-5">
        <span
          className="pre-tile flex size-16 items-center justify-center rounded-[18px] bg-[#0d7f81] text-white"
          style={{ opacity: 0, transform: "scale(0.85)" }}
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 24 24"
            className="size-10"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle
              className="pre-path"
              cx={BRAND_MARK_PATHS.circle.cx}
              cy={BRAND_MARK_PATHS.circle.cy}
              r={BRAND_MARK_PATHS.circle.r}
              style={{ strokeDasharray: 40, strokeDashoffset: 40 }}
            />
            <path className="pre-path" d={BRAND_MARK_PATHS.left} style={{ strokeDasharray: 40, strokeDashoffset: 40 }} />
            <path className="pre-path" d={BRAND_MARK_PATHS.right} style={{ strokeDasharray: 40, strokeDashoffset: 40 }} />
          </svg>
        </span>
        <p className="flex items-baseline gap-[0.3em] text-h3 font-semibold tracking-[-0.01em] text-text-primary">
          <span className="pre-word" style={{ opacity: 0 }}>
            {BRAND.brand}
          </span>
          <span className="pre-word text-accent-text" style={{ opacity: 0 }}>
            {BRAND.segment}
          </span>
        </p>
      </div>
      <span aria-hidden="true" className="pre-bar absolute bottom-0 left-0 h-0.5 w-full origin-left bg-accent"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}

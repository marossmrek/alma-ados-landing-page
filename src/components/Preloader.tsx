"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

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
  Preloader: EKG čiara z loga sa nakreslí, objaví sa wordmark, dole beží progress linka,
  overlay sa vytratí (fade-out) a až potom štartuje hero intro (HeroMotion počúva PRELOADER_DONE_EVENT).
  Zobrazí sa pri každom načítaní domovskej stránky (desktop aj mobil); pri prefers-reduced-motion sa preskočí.
*/
export function Preloader() {
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(true);

  // Rozhodnutie pred prvým vykreslením na klientovi – bez bliknutia
  useLayoutEffect(() => {
    // Len domovská stránka, viditeľný tab, bez reduced motion
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
      const path = root.querySelector<SVGPathElement>(".pre-path");
      if (!path) return;
      const len = path.getTotalLength();
      gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
      document.body.style.overflow = "hidden";

      const finish = () => {
        document.body.style.overflow = "";
        setActive(false);
        markDone();
        ScrollTrigger.refresh();
      };

      const tl = gsap.timeline({ defaults: { ease: "power2.out" }, onComplete: finish });
      // Poistka: keby animácia z akéhokoľvek dôvodu nedobehla, preloader sa po 3 s ukončí sám
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
      // Východiskové stavy sú aj v inline štýloch (pred hydratáciou je overlay prázdny, nie „hotový")
      tl.to(path, { strokeDashoffset: 0, duration: 0.55, ease: "sine.inOut" }, 0.05)
        .fromTo(root.querySelector(".pre-dot"), { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.25 }, 0.55)
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
        <svg viewBox="0 0 18 18" className="h-16 w-16 text-accent" fill="none" aria-hidden="true">
          <path
            className="pre-path"
            d="M16.5 9H13.5L11.25 15.75L6.75 2.25L4.5 9H1.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ strokeDasharray: 40, strokeDashoffset: 40 }}
          />
          <circle
            className="pre-dot"
            cx="16.5"
            cy="9"
            r="1.1"
            fill="currentColor"
            style={{ opacity: 0, transformOrigin: "16.5px 9px", transform: "scale(0)" }}
          />
        </svg>
        <p className="flex items-baseline gap-1.5 text-h3 text-text-primary">
          <span className="pre-word" style={{ opacity: 0 }}>
            ADOS
          </span>
          <span className="pre-word text-accent-text" style={{ opacity: 0 }}>
            Sestra
          </span>
        </p>
      </div>
      <span aria-hidden="true" className="pre-bar absolute bottom-0 left-0 h-0.5 w-full origin-left bg-accent"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}

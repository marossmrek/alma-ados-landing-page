"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

/*
  Vízia: jemný „priebeh" v slučke – ikona kroku sa mäkko rozsvieti (svetlý prstenec),
  šípka sa na chvíľu zafarbí a posunie o pár px. Nič sa nemení na kartách ani na texte.
  Rešpektuje prefers-reduced-motion.
*/
export function FlowMotion({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const icons = gsap.utils.toArray<HTMLElement>(".flow-icon", ref.current);
      const arrows = gsap.utils.toArray<HTMLElement>(".flow-arrow", ref.current);
      if (!icons.length) return;

      const mm = gsap.matchMedia();
      mm.add({ desktop: "(min-width: 1024px)", mobile: "(max-width: 1023px)" }, (ctx) => {
        const { desktop } = ctx.conditions as { desktop: boolean };
        const step = 2.4;
        const tl = gsap.timeline({ repeat: -1, repeatDelay: 4, delay: 2 });

        icons.forEach((icon, i) => {
          const t = i * step;
          tl.to(
            icon,
            { boxShadow: "0 0 0 6px rgba(13,127,129,0.12)", color: "var(--color-accent)", duration: 1.1, ease: "sine.inOut" },
            t,
          ).to(
            icon,
            { boxShadow: "0 0 0 0 rgba(13,127,129,0)", color: "var(--color-accent-text)", duration: 1.3, ease: "sine.inOut" },
            t + 1.4,
          );
          if (arrows[i]) {
            tl.to(
              arrows[i],
              { [desktop ? "x" : "y"]: 3, color: "var(--color-accent)", duration: 0.8, yoyo: true, repeat: 1, ease: "sine.inOut" },
              t + 1.2,
            );
          }
        });
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

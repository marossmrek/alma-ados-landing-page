"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { cx } from "@/lib/cx";

type Ring = { size: number; left?: string; right?: string; top?: string; bottom?: string; opacity: number; dashed?: boolean };

/*
  Concentric rings from Figma (AI › Decor, Kontakt › Decor) as SVG; the group only "breathes" slowly.
  `mobile` is a separate, smaller set for < 640 px.
*/
export function DecorRings({
  rings,
  mobile,
  spin = false,
  className,
}: {
  rings: Ring[];
  mobile?: Ring[];
  /* slow rotation of the dashed rings (alternating direction) */
  spin?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      if (spin) {
        gsap.utils.toArray<SVGSVGElement>("svg", ref.current).forEach((svg, i) => {
          gsap.to(svg, {
            rotation: i % 2 ? -360 : 360,
            transformOrigin: "center",
            duration: 90 - (i % 3) * 20,
            ease: "none",
            repeat: -1,
          });
        });
      }
      gsap.utils.toArray<HTMLElement>(".rings-set", ref.current).forEach((set) => {
        gsap.to(set, { scale: 1.04, transformOrigin: "center", duration: 8, ease: "sine.inOut", yoyo: true, repeat: -1 });
      });
    },
    { scope: ref, dependencies: [spin] },
  );

  const renderSet = (set: Ring[], cls: string) => (
    <div className={cx("rings-set absolute inset-0", cls)}>
      {set.map((r, i) => (
        <svg
          key={i}
          viewBox="0 0 100 100"
          className="absolute text-accent"
          style={{ width: r.size, height: r.size, left: r.left, right: r.right, top: r.top, bottom: r.bottom, opacity: r.opacity }}
        >
          <circle
            cx="50"
            cy="50"
            r="49.6"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.35"
            strokeDasharray={r.dashed ? "2.5 3.5" : undefined}
          />
        </svg>
      ))}
    </div>
  );

  return (
    <div ref={ref} aria-hidden="true" className={cx("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      {renderSet(rings, mobile ? "hidden sm:block" : "")}
      {mobile && renderSet(mobile, "sm:hidden")}
    </div>
  );
}

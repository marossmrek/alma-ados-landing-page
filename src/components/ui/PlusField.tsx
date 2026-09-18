"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { cx } from "@/lib/cx";

const COLS = 6;
const ROWS = 16;
const STEP = 26;

/* Dekoratívne pole krížikov (Figma „Plus field") – krížiky náhodne „blikajú" a pole jemne pláva */
export function PlusField({ className }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null);
  const plusses: { x: number; y: number }[] = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) plusses.push({ x: 20 + c * (STEP + 14), y: 14 + r * STEP });
  }

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const items = gsap.utils.toArray<SVGPathElement>("path", ref.current);
      gsap.set(items, { opacity: 0.25 });
      gsap.to(items, {
        opacity: 1,
        duration: 1.2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        stagger: { each: 0.07, from: "random", repeat: -1, yoyo: true },
      });
      gsap.to(ref.current, { y: -14, duration: 7, ease: "sine.inOut", yoyo: true, repeat: -1 });
    },
    { scope: ref },
  );

  return (
    <svg
      ref={ref}
      aria-hidden="true"
      viewBox={`0 0 ${20 + (COLS - 1) * (STEP + 14) + 20} ${ROWS * STEP}`}
      className={cx("pointer-events-none absolute w-[120px] select-none text-accent opacity-40 lg:w-[170px] lg:opacity-80 xl:w-[220px] xl:opacity-100", className)}
      style={{
        maskImage: "radial-gradient(ellipse 60% 55% at 50% 50%, #000 25%, transparent 78%)",
        WebkitMaskImage: "radial-gradient(ellipse 60% 55% at 50% 50%, #000 25%, transparent 78%)",
      }}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    >
      {plusses.map((p, i) => (
        <path key={i} d={`M${p.x - 4} ${p.y}H${p.x + 4}M${p.x} ${p.y - 4}V${p.y + 4}`} />
      ))}
    </svg>
  );
}

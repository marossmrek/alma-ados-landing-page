"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { cx } from "@/lib/cx";

/* Slovenský zápis desatinných čísel (čiarka) */
export function fmt(n: number, decimals: number) {
  return n.toFixed(decimals).replace(".", ",");
}

/* Číslo, ktoré sa k novej hodnote „dopočíta" (GSAP), pri reduced motion sa len prepne */
export function Counter({
  value,
  className,
  decimals = 0,
  duration = 0.45,
}: {
  value: number;
  className?: string;
  decimals?: number;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const shown = useRef(value);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      shown.current = value;
      el.textContent = fmt(value, decimals);
      return;
    }
    const obj = { v: shown.current };
    const tween = gsap.to(obj, {
      v: value,
      duration,
      ease: "power2.out",
      onUpdate: () => {
        el.textContent = fmt(obj.v, decimals);
      },
      onComplete: () => {
        shown.current = value;
      },
    });
    return () => {
      tween.kill();
      shown.current = obj.v;
    };
  }, [value, decimals, duration]);
  return (
    <span ref={ref} className={cx("tabular-nums", className)}>
      {fmt(value, decimals)}
    </span>
  );
}

"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { cx } from "@/lib/cx";

/* Slovak decimal notation (comma separator) */
export function fmt(n: number, decimals: number) {
  return n.toFixed(decimals).replace(".", ",");
}

/* Number that counts up to the new value (GSAP); with reduced motion it just switches */
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

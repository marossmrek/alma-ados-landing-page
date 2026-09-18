"use client";

import Link from "next/link";
import type { MouseEvent } from "react";
import { cx } from "@/lib/cx";
import { scrollToTop } from "@/lib/scroll";
import { BRAND } from "@/lib/brand";
import { BrandMark } from "@/components/ui/BrandMark";

/*
  "Alma ADOS" wordmark: tile with the mark + text. "Alma" in text color, "ADOS" in accent color,
  Inter 600, letter-spacing −0.01em, 9 px gap at a 26 px tile.
*/
export function Logo({
  size = "L",
  onDark = false,
  className,
}: {
  size?: "L" | "S";
  onDark?: boolean;
  className?: string;
}) {
  const large = size === "L";
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // On the home page the logo smoothly scrolls back to the top
    if (window.location.pathname !== "/" || e.metaKey || e.ctrlKey) return;
    e.preventDefault();
    scrollToTop();
  };
  return (
    <Link
      href="/"
      onClick={handleClick}
      aria-label={`${BRAND.name}, na začiatok stránky`}
      className={cx("focus-ring inline-flex items-center rounded-8", large ? "gap-[11px]" : "gap-[9px]", className)}
    >
      <BrandMark size={large ? 32 : 26} variant="tile" />
      <span
        className={cx(
          "flex items-baseline gap-[0.3em] whitespace-nowrap font-semibold tracking-[-0.01em]",
          large ? "text-h4" : "text-label-m",
          onDark ? "text-text-inverse" : "text-text-primary",
        )}
      >
        {BRAND.brand}{" "}
        <span className={onDark ? "text-accent-on-dark" : "text-accent-text"}>{BRAND.segment}</span>
      </span>
    </Link>
  );
}

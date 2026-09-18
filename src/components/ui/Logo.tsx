"use client";

import Link from "next/link";
import type { MouseEvent } from "react";
import { cx } from "@/lib/cx";
import { scrollToTop } from "@/lib/scroll";

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
    // Na domovskej stránke logo plynulo vráti na začiatok
    if (window.location.pathname !== "/" || e.metaKey || e.ctrlKey) return;
    e.preventDefault();
    scrollToTop();
  };
  return (
    <Link
      href="/"
      onClick={handleClick}
      aria-label="ADOS Sestra, na začiatok stránky"
      className={cx("focus-ring inline-flex items-center rounded-8", large ? "gap-2.5" : "gap-2", className)}
    >
      <span
        aria-hidden="true"
        className={cx(
          "flex shrink-0 items-center justify-center bg-accent text-text-inverse",
          large ? "size-8 rounded-[9px]" : "size-7 rounded-8",
        )}
      >
        <svg
          viewBox="0 0 18 18"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={large ? "size-[18px]" : "size-4"}
        >
          <path d="M16.5 9H13.5L11.25 15.75L6.75 2.25L4.5 9H1.5" />
        </svg>
      </span>
      <span
        className={cx(
          "flex items-baseline whitespace-nowrap",
          large ? "gap-1.5 text-h4" : "gap-[5px] text-label-m",
          onDark ? "text-text-inverse" : "text-text-primary",
        )}
      >
        ADOS <span className={onDark ? "text-accent-on-dark" : "text-accent-text"}>Sestra</span>
      </span>
    </Link>
  );
}

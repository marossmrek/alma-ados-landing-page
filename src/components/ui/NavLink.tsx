"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { MouseEvent } from "react";
import { cx } from "@/lib/cx";
import { handleAnchorClick } from "@/lib/scroll";

export function NavLink({
  href,
  active = false,
  className,
  children,
  onClick,
}: {
  href: string;
  active?: boolean;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const router = useRouter();
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.();
    handleAnchorClick(e, href, router);
  };
  return (
    <Link
      href={href}
      onClick={handleClick}
      aria-current={active ? "true" : undefined}
      className={cx(
        "focus-ring relative inline-flex rounded-8 px-3 py-2 text-label-m whitespace-nowrap transition-colors after:absolute after:bottom-1 after:left-3 after:right-3 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-accent after:transition-transform after:duration-200 hover:after:scale-x-100",
        active ? "bg-bg-muted text-text-primary" : "text-text-secondary hover:text-text-primary",
        className,
      )}
    >
      {children}
    </Link>
  );
}

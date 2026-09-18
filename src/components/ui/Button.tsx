"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ComponentPropsWithoutRef, MouseEvent } from "react";
import { cx } from "@/lib/cx";
import { handleAnchorClick } from "@/lib/scroll";

type Variant = "primary" | "secondary" | "ghost" | "inverse";
type Size = "L" | "M";

const base =
  "group focus-ring inline-flex items-center justify-center gap-2 rounded-12 font-medium whitespace-nowrap transition-[background-color,color,border-color,transform] duration-150 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40 aria-disabled:pointer-events-none aria-disabled:opacity-40";

const variants: Record<Variant, string> = {
  primary: "bg-accent text-text-inverse hover:bg-accent-strong",
  secondary:
    "bg-bg-surface text-text-primary border border-border-default hover:bg-bg-muted",
  ghost: "text-text-primary hover:bg-bg-muted",
  inverse: "bg-text-inverse text-text-primary hover:bg-bg-muted",
};

const sizes: Record<Size, string> = {
  L: "px-6 py-3.5 text-[16px] leading-[1.3]",
  M: "px-[18px] py-2.5 text-[14px] leading-[1.3]",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  arrow?: boolean;
  /* Pri kotve: prvok, ktorý má po doscrollovaní dostať fokus (napr. pole formulára) */
  focusTarget?: string;
  className?: string;
  children: React.ReactNode;
};

type ButtonAsButton = CommonProps &
  Omit<ComponentPropsWithoutRef<"button">, keyof CommonProps> & { href?: undefined };
type ButtonAsLink = CommonProps &
  Omit<ComponentPropsWithoutRef<"a">, keyof CommonProps> & { href: string };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button(props: ButtonProps) {
  const router = useRouter();
  const { variant = "primary", size = "L", arrow = false, focusTarget, className, children, ...rest } = props;
  const cls = cx(base, variants[variant], sizes[size], className);
  const content = (
    <>
      <span>{children}</span>
      {arrow && (
        <span aria-hidden="true" className="translate-y-px transition-transform duration-200 group-hover:translate-x-0.5">
          →
        </span>
      )}
    </>
  );
  if ("href" in rest && typeof rest.href === "string") {
    const { href, onClick, ...anchor } = rest as ButtonAsLink;
    const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
      onClick?.(e);
      handleAnchorClick(e, href, router, focusTarget);
    };
    return (
      <Link href={href} className={cls} onClick={handleClick} {...anchor}>
        {content}
      </Link>
    );
  }
  const button = rest as ButtonAsButton;
  return (
    <button type={button.type ?? "button"} className={cls} {...button}>
      {content}
    </button>
  );
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ComponentPropsWithoutRef, MouseEvent } from "react";
import { handleAnchorClick } from "@/lib/scroll";

/* Anchor link that scrolls smoothly, also when coming from subpages */
export function AnchorLink({ href, onClick, children, ...rest }: { href: string } & ComponentPropsWithoutRef<"a">) {
  const router = useRouter();
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    handleAnchorClick(e, href, router);
  };
  return (
    <Link href={href} onClick={handleClick} {...rest}>
      {children}
    </Link>
  );
}

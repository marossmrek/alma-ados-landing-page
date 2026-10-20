"use client";

import { Button, type ButtonProps } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { cx } from "@/lib/cx";
import { BROCHURE } from "@/lib/brochure";

/*
  "Stiahnuť produktovú brožúru" as a Button link with the download attribute: the browser saves the PDF
  (and simply opens it where the attribute is ignored, e.g. some mobile browsers). Next Link leaves
  clicks on download links to the browser; prefetch is off so the PDF is never fetched in the background.
*/
export function BrochureButton({
  variant = "secondary",
  size = "L",
  compact = false,
  iconOnly = false,
  className,
  onClick,
}: {
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  /* Desktop header: icon + short label only, the full label and size stay in the tooltip and for screen readers */
  compact?: boolean;
  /* Mobile header: square button with the icon only */
  iconOnly?: boolean;
  className?: string;
  onClick?: () => void;
}) {
  const full = `${BROCHURE.label} (${BROCHURE.meta})`;
  if (iconOnly) {
    return (
      <Button
        href={BROCHURE.href}
        download
        variant={variant}
        size="icon"
        className={className}
        onClick={onClick}
        aria-label={full}
        title={full}
      >
        <Icon name="download" className="size-5" />
      </Button>
    );
  }
  return (
    <Button
      href={BROCHURE.href}
      download
      variant={variant}
      size={size}
      className={className}
      onClick={onClick}
      aria-label={full}
      title={compact ? full : undefined}
    >
      {/* flex-wrap: on narrow phones the size note drops under the label instead of overflowing the button */}
      <span className={cx("inline-flex items-center justify-center gap-x-2 gap-y-0.5", compact ? "flex-nowrap" : "flex-wrap")}>
        <Icon name="download" className={cx("shrink-0", size === "M" ? "size-4" : "size-5")} />
        <span>{compact ? BROCHURE.shortLabel : BROCHURE.label}</span>
        {!compact && <span className="text-caption text-text-tertiary">{BROCHURE.meta}</span>}
      </span>
    </Button>
  );
}

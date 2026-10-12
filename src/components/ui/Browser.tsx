import { cx } from "@/lib/cx";
import { BRAND } from "@/lib/brand";

/*
  Browser frame for web app screenshots: the chrome bar is drawn here, the screenshot goes in as children.
  Bar sizes follow the frame width (container query units), so the hero, the scrolly panels and
  the small cards share one look at any size.
*/
export function BrowserFrame({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cx(
        "@container overflow-hidden rounded-12 bg-bg-surface ring-1 ring-border-default",
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="flex h-[max(18px,3.2cqw)] items-center gap-[max(3px,0.5cqw)] border-b border-border-default bg-bg-muted px-[max(8px,1.4cqw)]"
      >
        <span className="size-[max(5px,0.75cqw)] rounded-full bg-text-tertiary/35" />
        <span className="size-[max(5px,0.75cqw)] rounded-full bg-text-tertiary/35" />
        <span className="size-[max(5px,0.75cqw)] rounded-full bg-text-tertiary/35" />
        <span className="mx-[max(6px,4cqw)] flex h-[62%] flex-1 items-center justify-center rounded-full bg-bg-surface text-[max(8px,1.15cqw)] leading-none text-text-secondary">
          {BRAND.mockAddress}
        </span>
      </div>
      <div className="relative">{children}</div>
    </div>
  );
}

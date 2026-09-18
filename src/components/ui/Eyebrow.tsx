import { cx } from "@/lib/cx";

export function Eyebrow({
  variant = "light",
  className,
  children,
}: {
  variant?: "light" | "dark";
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <p className={cx("flex items-center gap-2.5", className)}>
      <span aria-hidden="true" className="eyebrow-bar h-0.5 w-5 shrink-0 bg-accent" />
      <span
        className={cx(
          "text-eyebrow whitespace-nowrap",
          variant === "dark" ? "text-text-inverse-muted" : "text-accent-text",
        )}
      >
        {children}
      </span>
    </p>
  );
}

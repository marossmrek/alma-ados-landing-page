import { cx } from "@/lib/cx";

export function Chip({
  variant = "light",
  className,
  children,
}: {
  variant?: "light" | "dark";
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-full border px-3.5 py-2 text-label-s whitespace-nowrap",
        variant === "dark"
          ? "bg-bg-dark-elevated border-border-dark text-text-inverse"
          : "bg-bg-surface border-border-default text-text-primary",
        className,
      )}
    >
      {children}
    </span>
  );
}

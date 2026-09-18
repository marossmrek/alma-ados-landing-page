import { cx } from "@/lib/cx";
import { Icon } from "@/components/ui/Icon";

export function CheckItem({
  variant = "light",
  className,
  children,
}: {
  variant?: "light" | "dark";
  className?: string;
  children: React.ReactNode;
}) {
  const dark = variant === "dark";
  return (
    <li className={cx("flex items-start gap-3", className)}>
      <span
        className={cx(
          "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full",
          dark ? "bg-bg-dark text-accent" : "bg-accent-soft text-accent-text",
        )}
      >
        <Icon name="check" className="size-3.5" />
      </span>
      <span className={cx("text-body-m", dark ? "text-text-inverse" : "text-text-primary")}>
        {children}
      </span>
    </li>
  );
}

import { cx } from "@/lib/cx";
import { Icon, type IconName } from "@/components/ui/Icon";

export function FlowNode({
  icon,
  title,
  description,
  variant = "light",
  layout = "vertical",
  className,
}: {
  icon: IconName;
  title: string;
  description: string;
  variant?: "light" | "dark";
  layout?: "vertical" | "horizontal";
  className?: string;
}) {
  const dark = variant === "dark";
  const horizontal = layout === "horizontal";
  return (
    <div
      className={cx(
        "flow-card flex rounded-16 border transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_14px_32px_-14px_rgba(20,23,31,0.18)]",
        horizontal ? "flex-row items-start gap-3.5 p-4" : "flex-col gap-4 p-5",
        dark ? "bg-bg-dark-elevated border-border-dark" : "bg-bg-surface border-border-default",
        className,
      )}
    >
      <span
        className={cx(
          "flow-icon flex size-9 shrink-0 items-center justify-center rounded-[10px]",
          dark ? "bg-bg-dark text-text-inverse" : "bg-accent-soft text-accent-text",
        )}
      >
        <Icon name={icon} className="size-[18px]" />
      </span>
      <div className={cx("flex flex-col gap-1", horizontal ? "min-w-0 flex-1" : "w-full")}>
        <p className={cx("text-label-m", dark ? "text-text-inverse" : "text-text-primary")}>{title}</p>
        <p className={cx("text-body-s", dark ? "text-text-inverse-muted" : "text-text-secondary")}>
          {description}
        </p>
      </div>
    </div>
  );
}

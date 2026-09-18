import { cx } from "@/lib/cx";

export function StepCard({
  number,
  title,
  description,
  variant = "light",
  className,
}: {
  number: string;
  title: string;
  description: string;
  variant?: "light" | "dark";
  className?: string;
}) {
  const dark = variant === "dark";
  return (
    <article
      className={cx(
        "flex flex-col gap-5 rounded-16 border p-7 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_14px_32px_-14px_rgba(20,23,31,0.18)]",
        dark ? "bg-bg-dark-elevated border-border-dark" : "bg-bg-surface border-border-default",
        className,
      )}
    >
      <p className={cx("text-h3", dark ? "text-accent-on-dark" : "text-accent-text")} aria-hidden="true">
        {number}
      </p>
      <div className="flex flex-col gap-2">
        <h3 className={cx("text-h4", dark ? "text-text-inverse" : "text-text-primary")}>
          <span className="sr-only">Krok {number}: </span>
          {title}
        </h3>
        <p className={cx("text-body-m", dark ? "text-text-inverse-muted" : "text-text-secondary")}>
          {description}
        </p>
      </div>
    </article>
  );
}

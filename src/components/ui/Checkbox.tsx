import type { ComponentPropsWithoutRef } from "react";
import { cx } from "@/lib/cx";

export function Checkbox({
  label,
  error,
  className,
  id,
  ...rest
}: { label: React.ReactNode; error?: string; className?: string } & ComponentPropsWithoutRef<"input">) {
  const inputId = id ?? rest.name;
  return (
    <div className={cx("flex flex-col gap-2", className)}>
    <label htmlFor={inputId} className="group flex cursor-pointer items-start gap-3">
      <span className="relative mt-0.5 flex size-5 shrink-0 items-center justify-center">
        <input
          id={inputId}
          type="checkbox"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={cx(
            "peer focus-ring absolute inset-0 size-5 cursor-pointer appearance-none rounded-[6px] border bg-bg-surface transition-colors checked:border-accent checked:bg-accent",
            error ? "border-status-danger" : "border-border-default",
          )}
          {...rest}
        />
        <svg
          aria-hidden="true"
          viewBox="0 0 12 12"
          className="pointer-events-none relative size-3 text-text-inverse opacity-0 transition-opacity peer-checked:opacity-100"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M2 6.5 4.8 9.2 10 3.5" />
        </svg>
      </span>
      <span className="text-body-s text-text-secondary">{label}</span>
    </label>
    {error && (
      <p id={`${inputId}-error`} className="text-caption text-status-danger">
        {error}
      </p>
    )}
    </div>
  );
}

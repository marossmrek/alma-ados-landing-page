import type { ComponentPropsWithoutRef } from "react";
import { cx } from "@/lib/cx";

type FieldProps = {
  label: string;
  help?: string;
  error?: string;
  className?: string;
};

const fieldBase =
  "w-full rounded-12 border bg-bg-surface px-3.5 py-3 text-body-m text-text-primary placeholder:text-text-tertiary outline-none transition-[border-color,box-shadow] focus:border-2 focus:border-accent focus:px-[13px] focus:py-[11px] focus:shadow-[0_0_0_4px_rgba(15,139,141,0.18)]";

export function Input({
  label,
  help,
  error,
  className,
  id,
  ...rest
}: FieldProps & ComponentPropsWithoutRef<"input">) {
  const inputId = id ?? rest.name;
  const describedBy = error ? `${inputId}-error` : help ? `${inputId}-help` : undefined;
  return (
    <div className={cx("flex flex-col gap-2", className)}>
      <label htmlFor={inputId} className="text-label-s text-text-primary">
        {label}
      </label>
      <input
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={cx(fieldBase, error ? "border-status-danger" : "border-border-default")}
        {...rest}
      />
      {error ? (
        <p id={`${inputId}-error`} className="text-caption text-status-danger">
          {error}
        </p>
      ) : help ? (
        <p id={`${inputId}-help`} className="text-caption text-text-tertiary">
          {help}
        </p>
      ) : null}
    </div>
  );
}

export function Textarea({
  label,
  help,
  error,
  className,
  id,
  ...rest
}: FieldProps & ComponentPropsWithoutRef<"textarea">) {
  const inputId = id ?? rest.name;
  const describedBy = error ? `${inputId}-error` : help ? `${inputId}-help` : undefined;
  return (
    <div className={cx("flex flex-col gap-2", className)}>
      <label htmlFor={inputId} className="text-label-s text-text-primary">
        {label}
      </label>
      <textarea
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={cx(fieldBase, "min-h-[120px] resize-y", error ? "border-status-danger" : "border-border-default")}
        {...rest}
      />
      {error ? (
        <p id={`${inputId}-error`} className="text-caption text-status-danger">
          {error}
        </p>
      ) : help ? (
        <p id={`${inputId}-help`} className="text-caption text-text-tertiary">
          {help}
        </p>
      ) : null}
    </div>
  );
}

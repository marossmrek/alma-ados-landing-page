import { cx } from "@/lib/cx";

export function SegmentedGroup({
  label,
  name,
  options,
  defaultValue,
  help,
  error,
  required,
  onChange,
  className,
}: {
  label: string;
  name: string;
  options: { value: string; label: string }[];
  defaultValue?: string;
  help?: string;
  error?: string;
  required?: boolean;
  onChange?: () => void;
  className?: string;
}) {
  return (
    <fieldset
      className={cx("flex flex-col gap-2", className)}
      aria-invalid={error ? true : undefined}
      aria-describedby={error ? `${name}-error` : undefined}
      onChange={onChange}
    >
      <legend className="mb-2 text-label-s text-text-primary">{label}</legend>
      <div
        className={cx(
          "flex w-full gap-1 rounded-[10px] border bg-bg-muted p-1",
          error ? "border-status-danger" : "border-border-default",
        )}
      >
        {options.map((o) => (
          <SegmentedOption
            key={o.value}
            name={name}
            value={o.value}
            required={required}
            defaultChecked={o.value === defaultValue}
          >
            {o.label}
          </SegmentedOption>
        ))}
      </div>
      {error ? (
        <p id={`${name}-error`} className="text-caption text-status-danger">
          {error}
        </p>
      ) : (
        help && <p className="text-caption text-text-tertiary">{help}</p>
      )}
    </fieldset>
  );
}

export function SegmentedOption({
  name,
  value,
  defaultChecked,
  required,
  children,
}: {
  name: string;
  value: string;
  defaultChecked?: boolean;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="relative min-w-0 flex-1 cursor-pointer">
      <input
        type="radio"
        name={name}
        value={value}
        required={required}
        defaultChecked={defaultChecked}
        className="peer sr-only"
      />
      <span className="flex items-center justify-center rounded-8 px-3.5 py-2.5 text-label-m whitespace-nowrap text-text-secondary transition-colors peer-checked:bg-bg-surface peer-checked:text-text-primary peer-checked:shadow-segment peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent">
        {children}
      </span>
    </label>
  );
}

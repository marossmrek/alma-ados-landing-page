import { cx } from "@/lib/cx";

/* Label over real screenshots: the data shown belongs to a fictional demo agency */
export function PreviewLabel({
  className,
  children = "Ukážkové údaje",
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-8 bg-bg-dark px-3 py-1.5 text-caption whitespace-nowrap text-text-inverse",
        className,
      )}
    >
      {children}
    </span>
  );
}

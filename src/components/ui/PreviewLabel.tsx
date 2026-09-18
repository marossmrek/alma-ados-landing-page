import { cx } from "@/lib/cx";

export function PreviewLabel({
  className,
  children = "Koncept pripravovaného produktu · ukážkové údaje",
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-2 rounded-8 bg-bg-dark py-1.5 pl-2.5 pr-3 text-caption whitespace-nowrap",
        className,
      )}
    >
      <span className="font-semibold tracking-[0.06em] text-status-warning-on-dark">NÁHĽAD</span>
      <span className="text-text-inverse">{children}</span>
    </span>
  );
}

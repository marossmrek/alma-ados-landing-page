import { Eyebrow } from "@/components/ui/Eyebrow";
import { cx } from "@/lib/cx";

/* Section header: Eyebrow + H2 on the left (640), lead on the right (440), bottom-aligned */
export function SectionHeader({
  eyebrow,
  title,
  lead,
  variant = "light",
  className,
}: {
  eyebrow: string;
  title: React.ReactNode;
  lead: React.ReactNode;
  variant?: "light" | "dark";
  className?: string;
}) {
  const dark = variant === "dark";
  return (
    <div className={cx("flex w-full flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-10", className)}>
      <div className="flex max-w-[640px] flex-col gap-4 lg:gap-5">
        <Eyebrow variant={variant} className="gsap-reveal">
          {eyebrow}
        </Eyebrow>
        <h2 className={cx("gsap-reveal text-mobile-h2 lg:text-h2", dark ? "text-text-inverse" : "text-text-primary")}>
          {title}
        </h2>
      </div>
      <p
        className={cx(
          "gsap-reveal max-w-[440px] text-body-m lg:text-body-l",
          dark ? "text-text-inverse-muted" : "text-text-secondary",
        )}
      >
        {lead}
      </p>
    </div>
  );
}

import { Eyebrow } from "@/components/ui/Eyebrow";
import { cx } from "@/lib/cx";

/* Hlavička sekcie: Eyebrow + H2 vľavo (640), lead vpravo (440), zarovnané dole */
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

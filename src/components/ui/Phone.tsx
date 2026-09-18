import { cx } from "@/lib/cx";

/* Phone frame (Figma "Phone"): dark frame 320 × 670, screen 300 × 651 with a 250/541 aspect ratio */
export function PhoneFrame({
  className,
  bezel = "regular",
  children,
}: {
  className?: string;
  bezel?: "regular" | "thin";
  children: React.ReactNode;
}) {
  return (
    <div
      className={cx(
        "relative w-full rounded-[12.4%/5.9%] bg-bg-dark shadow-[0_29px_58px_-14px_rgba(20,23,31,0.18)] ring-1 ring-inset ring-white/10",
        bezel === "thin" ? "p-[2%]" : "p-[3%]",
        className,
      )}
    >
      <div className="relative aspect-[250/541] w-full overflow-hidden rounded-[10%/4.6%] bg-bg-surface">
        {children}
      </div>
    </div>
  );
}

import { cx } from "@/lib/cx";
import { BRAND_MARK_PATHS, markStrokeWidth } from "@/lib/brand";

/*
  Znak Alma: dve dlane držiace človeka.
  tile  = biely znak na teal dlaždici (primárna podoba)
  soft  = znak #0A6466 na #E3F3F2
  dark  = znak #5FC0C1 na #141B24
  line  = samotný znak, farba cez currentColor (bez dlaždice)
  size  = strana dlaždice v px; pri „line" veľkosť znaku. Zaoblenie ≈ 28 % strany.
  Znak sa nikdy nedeformuje, neotáča a nemá tieň ani gradient.
*/
export type BrandMarkVariant = "tile" | "soft" | "dark" | "line";

const TILE: Record<Exclude<BrandMarkVariant, "line">, string> = {
  tile: "bg-[#0d7f81] text-white",
  soft: "bg-[#e3f3f2] text-[#0a6466]",
  dark: "bg-[#141b24] text-[#5fc0c1]",
};

export function BrandMarkGlyph({
  size,
  strokeWidth,
  className,
}: {
  size: number;
  strokeWidth?: number;
  className?: string;
}) {
  const { circle, left, right } = BRAND_MARK_PATHS;
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth ?? markStrokeWidth(size)}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cx("shrink-0", className)}
    >
      <circle cx={circle.cx} cy={circle.cy} r={circle.r} />
      <path d={left} />
      <path d={right} />
    </svg>
  );
}

export function BrandMark({
  size = 26,
  variant = "tile",
  className,
}: {
  size?: number;
  variant?: BrandMarkVariant;
  className?: string;
}) {
  if (variant === "line") return <BrandMarkGlyph size={size} className={className} />;
  // znak zaberá ~62 % dlaždice (26 px dlaždica → 16 px znak)
  const glyph = Math.round(size * 0.62);
  return (
    <span
      aria-hidden="true"
      className={cx("inline-flex shrink-0 items-center justify-center", TILE[variant], className)}
      style={{ width: size, height: size, borderRadius: Math.round(size * 0.28) }}
    >
      <BrandMarkGlyph size={glyph} strokeWidth={markStrokeWidth(size)} />
    </span>
  );
}

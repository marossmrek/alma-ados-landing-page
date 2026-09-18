import { cx } from "@/lib/cx";
import { BRAND_MARK_PATHS, markStrokeWidth } from "@/lib/brand";

/*
  Alma mark: two palms holding a person.
  tile  = white mark on a teal tile (primary form)
  soft  = #0A6466 mark on #E3F3F2
  dark  = #5FC0C1 mark on #141B24
  line  = the bare mark, colored via currentColor (no tile)
  size  = tile side in px; for "line" the mark size. Corner radius ≈ 28 % of the side.
  The mark is never distorted or rotated and has no shadow or gradient.
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
  // the mark takes ~62 % of the tile (26 px tile → 16 px mark)
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

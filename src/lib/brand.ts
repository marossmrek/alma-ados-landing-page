/*
  Brand: single source of truth for the name and addresses.
  The product is called "Alma ADOS": brand "Alma", segment "ADOS".
*/
export const BRAND = {
  /** Full product name */
  name: "Alma ADOS",
  /** Brand (first part of the wordmark, text color) */
  brand: "Alma",
  /** Segment (second part of the wordmark, accent color) */
  segment: "ADOS",
  /** Public site origin (canonical URL, OG image); NEXT_PUBLIC_SITE_URL overrides it */
  siteUrl: "https://adosalma.sk",
  /** App address in mockups */
  appHost: "app.adosalma.sk",
  /** Text in the browser mockup's address bar */
  conceptUrl: "app.adosalma.sk · koncept",
} as const;

/* Mark: two palms holding a person, 24 × 24 grid, stroke via currentColor */
export const BRAND_MARK_PATHS = {
  circle: { cx: 12, cy: 8.5, r: 3 },
  left: "M4 9v4a5 5 0 0 0 5 5",
  right: "M20 9v4a5 5 0 0 1-5 5",
} as const;

/* Stroke width by rendered mark size (px) */
export function markStrokeWidth(size: number) {
  return size >= 32 ? 1.75 : size > 16 ? 2 : 2.4;
}

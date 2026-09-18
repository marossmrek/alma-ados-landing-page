/*
  Značka: jediný zdroj pravdy pre názov a adresy.
  Produkt sa volá „Alma ADOS": značka „Alma", segment „ADOS".
*/
export const BRAND = {
  /** Celý názov produktu */
  name: "Alma ADOS",
  /** Značka (prvá časť wordmarku, farba textu) */
  brand: "Alma",
  /** Segment (druhá časť wordmarku, accent farba) */
  segment: "ADOS",
  /** Adresa aplikácie v mockupoch (doména sa ešte doladí) */
  appHost: "app.alma.sk",
  /** Text v adresnom riadku mockupu prehliadača */
  conceptUrl: "app.alma.sk · koncept",
} as const;

/* Znak: dve dlane držiace človeka, 24 × 24 grid, stroke cez currentColor */
export const BRAND_MARK_PATHS = {
  circle: { cx: 12, cy: 8.5, r: 3 },
  left: "M4 9v4a5 5 0 0 0 5 5",
  right: "M20 9v4a5 5 0 0 1-5 5",
} as const;

/* Hrúbka ťahu podľa vykreslenej veľkosti znaku (px) */
export function markStrokeWidth(size: number) {
  return size >= 32 ? 1.75 : size > 16 ? 2 : 2.4;
}

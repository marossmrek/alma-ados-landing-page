/*
  Product brochure (PDF) served from public/. The URL is stable: a new version replaces the file in place,
  the link never changes. After replacing the file, update `meta` to the real size
  (`ls -l public/alma-ados-produktova-brozura.pdf`, bytes / 1 000 000, one decimal).
*/
export const BROCHURE = {
  href: "/alma-ados-produktova-brozura.pdf",
  label: "Stiahnuť produktovú brožúru",
  /* Desktop header, where the full label does not fit next to the navigation */
  shortLabel: "Brožúra",
  meta: "PDF · 10,7 MB",
} as const;

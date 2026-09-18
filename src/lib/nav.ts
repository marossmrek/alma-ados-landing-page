/*
  Kotvy sú absolútne („/#…"), aby fungovali aj z podstránok (/dakujeme, /ochrana-osobnych-udajov).
  Názvy: podľa miesta, kde sa systém používa – terén (sestry) a kancelária (vedenie ADOS).
*/
export const NAV_LINKS = [
  { href: "/#produkt", label: "Ako to funguje" },
  { href: "/#pre-sestry", label: "V teréne" },
  { href: "/#pre-ados", label: "V kancelárii" },
  { href: "/#kalkulacka", label: "Kalkulačka" },
  { href: "/#pilotny-program", label: "Pilotný program" },
] as const;

/* Mobilné menu má rovnaké položky ako web; kontakt je vždy cez CTA „Zapojiť sa" */
export const MOBILE_NAV_LINKS = NAV_LINKS;

export const SECTION_IDS = ["produkt", "pre-sestry", "pre-ados", "kalkulacka", "pilotny-program", "faq", "kontakt"] as const;

export const CONTACT = {
  company: "thunderstruck s.r.o.",
  email: "maros.smrek@thunderstruck.studio",
  phone: "+421 910 967 473",
  phoneHref: "tel:+421910967473",
} as const;

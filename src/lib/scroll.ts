import { gsap, prefersReducedMotion } from "@/lib/gsap";

/* Výška kompaktnej navigácie + medzera – cieľ kotvy sa zastaví tesne pod ňou */
const NAV_OFFSET = 64;

export function isHashHref(href: string) {
  return /^\/?#/.test(href);
}

export function hashId(href: string) {
  return href.replace(/^\/?#/, "");
}

/* Kotva patrí tejto stránke? („#x" vždy, „/#x" len na domovskej) */
export function isLocalHash(href: string) {
  if (!isHashHref(href)) return false;
  if (href.startsWith("/") && window.location.pathname !== "/") return false;
  return true;
}

function focusElement(el: HTMLElement) {
  if (!el.hasAttribute("tabindex")) {
    el.setAttribute("tabindex", "-1");
    el.style.outline = "none";
  }
  el.focus({ preventScroll: true });
}

/*
  Plynulý scroll na sekciu (GSAP ScrollToPlugin) + presun fokusu.
  focusSelector: prvok, ktorý má dostať fokus (napr. prvé pole formulára);
  použije sa len pri presnom ukazovateli (myš), na dotyku by otvoril klávesnicu.
*/
export function scrollToTarget(href: string, focusSelector?: string) {
  const el = document.getElementById(hashId(href));
  if (!el) return false;
  const y = Math.max(0, el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET);

  const finish = () => {
    history.replaceState(null, "", `#${el.id}`);
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const focusEl = focusSelector && finePointer ? document.querySelector<HTMLElement>(focusSelector) : null;
    focusElement(focusEl ?? el);
  };

  if (prefersReducedMotion()) {
    window.scrollTo({ top: y });
    finish();
    return true;
  }
  gsap.to(window, {
    scrollTo: { y, autoKill: false },
    duration: 0.9,
    ease: "power2.inOut",
    overwrite: "auto",
    onComplete: finish,
  });
  return true;
}

/* Kotva z podstránky: cieľ si zapamätáme, prejdeme na domovskú bez hashu (bez natívneho skoku)
   a po načítaní doscrollujeme plynulo (HashScroll). */
const PENDING_KEY = "ados-scroll-target";

export function rememberTarget(href: string, focusSelector?: string) {
  try {
    sessionStorage.setItem(PENDING_KEY, JSON.stringify({ id: hashId(href), focus: focusSelector ?? null }));
  } catch {
    /* private mode */
  }
}

/* Len prečíta (nezmaže) – v dev StrictMode beží efekt dvakrát, zmazanie robíme až pri použití */
export function peekPendingTarget(): { id: string; focus: string | null } | null {
  try {
    const raw = sessionStorage.getItem(PENDING_KEY);
    return raw ? (JSON.parse(raw) as { id: string; focus: string | null }) : null;
  } catch {
    return null;
  }
}

export function clearPendingTarget() {
  try {
    sessionStorage.removeItem(PENDING_KEY);
  } catch {
    /* private mode */
  }
}

type Router = { push: (href: string) => void };

/* Spoločný handler pre všetky kotvy (NavLink, Button, AnchorLink) */
export function handleAnchorClick(
  e: { defaultPrevented: boolean; button: number; metaKey: boolean; ctrlKey: boolean; shiftKey: boolean; altKey: boolean; preventDefault: () => void },
  href: string,
  router: Router,
  focusSelector?: string,
) {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  if (!isHashHref(href)) return;
  if (isLocalHash(href)) {
    if (scrollToTarget(href, focusSelector)) e.preventDefault();
    return;
  }
  // „/#x" z podstránky
  e.preventDefault();
  rememberTarget(href, focusSelector);
  router.push("/");
}

export function scrollToTop() {
  const finish = () => {
    history.replaceState(null, "", window.location.pathname);
    document.getElementById("top")?.focus({ preventScroll: true });
  };
  if (prefersReducedMotion()) {
    window.scrollTo({ top: 0 });
    finish();
    return;
  }
  gsap.to(window, { scrollTo: { y: 0, autoKill: false }, duration: 0.8, ease: "power2.inOut", overwrite: "auto", onComplete: finish });
}

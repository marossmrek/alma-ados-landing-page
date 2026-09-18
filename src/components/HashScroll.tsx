"use client";

import { useEffect } from "react";
import { ScrollTrigger } from "@/lib/gsap";
import { clearPendingTarget, hashId, peekPendingTarget, scrollToTarget } from "@/lib/scroll";
import { PRELOADER_DONE_EVENT } from "@/components/Preloader";

/*
  Po príchode na domovskú stránku s cieľom kotvy (z podstránky cez sessionStorage,
  alebo priamo s #hash v URL) doscrolluje plynulo na sekciu – až po preloaderi.
*/
export function HashScroll() {
  useEffect(() => {
    const pending = peekPendingTarget();
    const id = pending?.id ?? (window.location.hash ? hashId(window.location.hash) : null);
    if (!id || !document.getElementById(id)) return;

    let timer = 0;
    const go = () => {
      ScrollTrigger.refresh();
      timer = window.setTimeout(() => {
        clearPendingTarget();
        scrollToTarget(`#${id}`, pending?.focus ?? undefined);
      }, 150);
    };
    if (window.__adosPreloaderDone) go();
    else window.addEventListener(PRELOADER_DONE_EVENT, go, { once: true });
    return () => {
      window.removeEventListener(PRELOADER_DONE_EVENT, go);
      window.clearTimeout(timer);
    };
  }, []);
  return null;
}

"use client";

import { useEffect } from "react";
import { ScrollTrigger } from "@/lib/gsap";
import { clearPendingTarget, hashId, peekPendingTarget, scrollToTarget } from "@/lib/scroll";
import { PRELOADER_DONE_EVENT } from "@/components/Preloader";

/*
  On arriving at the home page with an anchor target (from a subpage via sessionStorage,
  or directly with a #hash in the URL) scrolls smoothly to the section, only after the preloader.
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

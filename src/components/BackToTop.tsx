"use client";

import { useState } from "react";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "@/lib/gsap";
import { scrollToTop } from "@/lib/scroll";
import { cx } from "@/lib/cx";
import { Icon } from "@/components/ui/Icon";

/* Šípka „Späť hore" – zobrazí sa po odscrolovaní cca jednej obrazovky */
export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useGSAP(() => {
    ScrollTrigger.create({
      start: () => window.innerHeight * 0.8,
      end: "max",
      onToggle: (self) => setVisible(self.isActive),
    });
  });

  const scrollTop = () => scrollToTop();

  return (
    <button
      type="button"
      onClick={scrollTop}
      aria-label="Späť hore"
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      className={cx(
        "focus-ring fixed bottom-4 right-4 z-40 flex size-11 items-center justify-center rounded-full border border-border-default bg-bg-surface text-text-primary shadow-[0_8px_24px_-8px_rgba(20,23,31,0.25)] transition-[opacity,transform,background-color,color,border-color] duration-300 hover:border-accent hover:bg-accent hover:text-text-inverse lg:bottom-6 lg:right-6",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0",
      )}
    >
      <Icon name="arrow-down" className="size-5 rotate-180" />
    </button>
  );
}

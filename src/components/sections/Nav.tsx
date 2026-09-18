"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { cx } from "@/lib/cx";
import { Logo } from "@/components/ui/Logo";
import { NavLink } from "@/components/ui/NavLink";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { NAV_LINKS, MOBILE_NAV_LINKS, SECTION_IDS, CONTACT } from "@/lib/nav";
import { handleAnchorClick } from "@/lib/scroll";
import { useRouter } from "next/navigation";

export function Nav() {
  const headerRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [compact, setCompact] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  useGSAP(
    () => {
      // Kompaktný variant po scrolle > 80 px
      ScrollTrigger.create({
        start: 80,
        end: "max",
        onToggle: (self) => setCompact(self.isActive),
      });

      // Progress linka (scroll celej stránky)
      gsap.set(progressRef.current, { scaleX: 0, transformOrigin: "left center" });
      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          gsap.set(progressRef.current, { scaleX: self.progress });
        },
      });

      // Aktívna kotva podľa sekcie vo viewporte
      SECTION_IDS.forEach((id) => {
        const el = document.getElementById(id);
        if (!el) return;
        ScrollTrigger.create({
          trigger: el,
          start: "top 45%",
          end: "bottom 45%",
          // Prepočítať až po pinoch sekcií (pin-spacer posúva všetko pod sebou)
          refreshPriority: -1,
          onToggle: (self) => {
            if (self.isActive) setActive(id);
          },
        });
      });
    },
    { scope: headerRef },
  );

  // Zamknutie scrollu + Escape pre mobilné menu
  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const activeHref = active ? `/#${active}` : null;

  return (
    <header
      ref={headerRef}
      className={cx(
        "sticky top-0 z-50 w-full bg-bg-page transition-[padding,box-shadow,border-color] duration-200",
        compact
          ? "border-b border-border-default py-2.5 shadow-nav lg:py-3"
          : "border-b border-border-subtle py-4 lg:py-5",
      )}
    >
      <div className="relative mx-auto flex w-full max-w-[1440px] items-center justify-between px-6 lg:px-10 xl:px-[120px]">
        <div className="lg:hidden">
          <Logo size="S" />
        </div>
        <div className="hidden lg:block">
          <Logo size="L" />
        </div>

        <nav aria-label="Hlavná navigácia" className="hidden items-start gap-1 lg:flex">
          {NAV_LINKS.map((l) => (
            <NavLink key={l.href} href={l.href} active={activeHref === l.href}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          {!compact && <Badge variant="status">Vo vývoji · 2027</Badge>}
          <Button href="/#kontakt" focusTarget="#pilot-form [name='meno']" size="M" arrow={compact}>
            Zapojiť sa do pilotu
          </Button>
        </div>

        <div className="flex items-center gap-3 lg:hidden">
          <Button href="/#kontakt" focusTarget="#pilot-form [name='meno']" size="M">
            Zapojiť sa
          </Button>
          <button
            type="button"
            aria-label="Otvoriť menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen(true)}
            className="focus-ring flex size-10 flex-col items-end justify-center gap-[6px] rounded-[10px] pr-2 transition-colors hover:bg-bg-muted"
          >
            <span aria-hidden="true" className="h-[1.5px] w-[18px] rounded-full bg-text-primary" />
            <span aria-hidden="true" className="h-[1.5px] w-[11px] rounded-full bg-text-primary" />
          </button>
        </div>
      </div>

      <div
        ref={progressRef}
        aria-hidden="true"
        className={cx(
          "absolute -bottom-px left-0 h-0.5 w-full bg-accent transition-opacity duration-200",
          compact ? "opacity-100" : "opacity-0",
        )}
      />

      {/* Mobilné menu – overlay podľa 🧪 Stavy · navigácia */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        hidden={!menuOpen}
        className="fixed inset-0 z-[60] flex flex-col bg-bg-page lg:hidden"
      >
        <div className="flex items-center justify-between border-b border-border-subtle px-6 py-4">
          <Logo size="S" />
          <button
            type="button"
            aria-label="Zavrieť menu"
            onClick={() => setMenuOpen(false)}
            className="focus-ring flex size-10 items-center justify-center rounded-[10px] transition-colors hover:bg-bg-muted"
          >
            <svg
              viewBox="0 0 20 20"
              className="size-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M5 5l10 10M15 5L5 15" />
            </svg>
          </button>
        </div>
        <div className="flex flex-1 flex-col gap-8 overflow-y-auto px-6 pb-8 pt-6">
          <nav aria-label="Mobilná navigácia">
            <ul>
              {MOBILE_NAV_LINKS.map((l) => {
                const isActive = activeHref === l.href;
                return (
                  <li key={l.href} className="border-b border-border-default">
                    <a
                      href={l.href}
                      onClick={(e) => {
                        setMenuOpen(false);
                        handleAnchorClick(e, l.href, router);
                      }}
                      aria-current={isActive ? "true" : undefined}
                      className={cx(
                        "focus-ring flex items-center justify-between rounded-8 py-[18px] text-h4",
                        isActive ? "text-accent-text" : "text-text-primary",
                      )}
                    >
                      {l.label}
                      <Icon
                        name="arrow-right"
                        className={cx("size-[18px]", isActive ? "text-accent" : "text-text-tertiary")}
                      />
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="flex-1" />
          <div className="flex flex-col items-start gap-4">
            <Badge variant="status">Vo vývoji · Plánované spustenie 2027</Badge>
            <Button
              href="/#kontakt"
              focusTarget="#pilot-form [name='meno']"
              arrow
              className="w-full"
              onClick={() => setMenuOpen(false)}
            >
              Chcem sa zapojiť do pilotného programu
            </Button>
            <a href={`mailto:${CONTACT.email}`} className="focus-ring rounded-[4px] text-body-s text-text-secondary">
              {CONTACT.email}
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

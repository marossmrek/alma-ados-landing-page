"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { reserveTimelineHeight } from "@/lib/timeline";
import { cx } from "@/lib/cx";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PreviewLabel } from "@/components/ui/PreviewLabel";
import { PhoneFrame } from "@/components/ui/Phone";
import { BrowserFrame } from "@/components/ui/Browser";
import { Badge } from "@/components/ui/Badge";
import { Chip } from "@/components/ui/Chip";
import { Icon } from "@/components/ui/Icon";

/*
  One visit in five steps, the same for any procedure: four screens of the nurse app, then the web in the office.
  Steps are numbered, not timed, so the section reads as "how a visit is documented", not as one particular morning.
*/
const STOPS = [
  {
    step: "01",
    title: "Plán návštev",
    text: "Sestra má v telefóne svoje návštevy na deň aj na týždeň: poradie, pacientov a plánované výkony.",
    steps: ["Plán na deň a týždeň", "Poradie návštev", "Plánované výkony"],
    device: "phone",
    screen: "/images/phone-plan-2610.png",
    alt: "Aplikácia pre sestry, Plán návštev: dnešné návštevy v poradí s časmi, pacientmi a výkonmi",
  },
  {
    step: "02",
    title: "Pred návštevou",
    text: "Detail návštevy ukáže, čo sa dnes očakáva: výkony, posledné merania, upozornenia k pacientovi a platnosť indikácie.",
    steps: ["Očakávané výkony", "Upozornenia k pacientovi", "Navigácia"],
    device: "phone",
    screen: "/images/phone-visit-detail-2610.png",
    alt: "Aplikácia pre sestry: detail návštevy pred začatím s plánovanými výkonmi, poslednými meraniami a tlačidlom Začať návštevu",
  },
  {
    step: "03",
    title: "Zápis výkonov",
    text: "Počas návštevy sestra odškrtne vykonané výkony a doplní dekurz. Priebeh môže povedať hlasom cez Nadiktovať a aplikácia ukáže, čo ešte chýba.",
    steps: ["Vykonané výkony", "Dekurz", "Nadiktovať"],
    device: "phone",
    screen: "/images/phone-visit-ongoing-2610.png",
    alt: "Aplikácia pre sestry: prebiehajúca návšteva s výkonmi, dekurzom a tlačidlami Nadiktovať a Dokončiť návštevu",
  },
  {
    step: "04",
    title: "Formulár výkonu",
    text: "Každý výkon má svoj formulár s údajmi, ktoré k nemu patria. Pri preväze rany napríklad rozmery porovnané s minulým preväzom. Uloží sa aj bez signálu.",
    steps: ["Údaje podľa výkonu", "Porovnanie s minulou návštevou", "Aj bez signálu"],
    device: "phone",
    screen: "/images/phone-wound-2610.png",
    alt: "Aplikácia pre sestry: formulár výkonu preväz rany s rozmermi z minulého preväzu a poklesom plochy rany",
  },
  {
    step: "05",
    title: "Kancelária má prehľad",
    text: "Dokončené návštevy prichádzajú do Vykazovania. Kancelária ich skontroluje a zo schválených pripraví podklady pre poisťovne.",
    steps: ["Návštevy na kontrolu", "Upozornenia", "Podklady pre poisťovne"],
    device: "web",
    screen: "/images/web-reporting-2610.png",
    alt: "Webová aplikácia, Vykazovanie: návštevy čakajúce na kontrolu s výkonmi a stavom kontroly",
  },
] as const;

type Stop = (typeof STOPS)[number];
const PHONE_STOPS = STOPS.filter((s) => s.device === "phone");
const WEB_STOP = STOPS.find((s) => s.device === "web")!;

const FEATURES = [
  "Denný plán",
  "Pacienti",
  "Navigácia",
  "Návštevy",
  "Dokumentácia",
  "Rany",
  "Merania",
  "Hlasový zápis",
  "Offline režim",
];

/* Device: phone with three screens (crossfade), swapped for the web view at the last stop */
function DeviceStack({
  active,
  phoneClassName,
  phoneSizes,
  webSizes,
  bezel,
}: {
  active: number;
  phoneClassName?: string;
  phoneSizes: string;
  webSizes: string;
  bezel?: "regular" | "thin";
}) {
  const webActive = STOPS[active].device === "web";
  return (
    <div className="grid w-full place-items-center">
      <div className={cx("day-phone col-start-1 row-start-1", phoneClassName)} aria-hidden={webActive}>
        <PhoneFrame bezel={bezel}>
          {PHONE_STOPS.map((s, i) => (
            <div key={s.screen} className="scrolly-screen absolute inset-0" aria-hidden={i !== active}>
              <Image src={s.screen} alt={s.alt} fill sizes={phoneSizes} className="object-cover" />
            </div>
          ))}
        </PhoneFrame>
      </div>
      <div
        className="day-web col-start-1 row-start-1 w-full rounded-12 shadow-[0_24px_48px_-12px_rgba(20,23,31,0.18)]"
        aria-hidden={!webActive}
      >
        <BrowserFrame>
          <Image
            src={WEB_STOP.screen}
            alt={WEB_STOP.alt}
            width={2400}
            height={1633}
            sizes={webSizes}
            className="h-auto w-full"
          />
        </BrowserFrame>
      </div>
    </div>
  );
}

/* Compact timeline (mobile): step numbers in a row, the active one highlighted */
function TimeRow({ active }: { active: number }) {
  return (
    <ol className="flex w-full items-center gap-1.5" aria-hidden="true">
      {STOPS.map((s, i) => (
        <li key={s.step} className={cx("flex items-center gap-1.5", i < STOPS.length - 1 && "min-w-0 flex-1")}>
          <span
            className={cx(
              "shrink-0 rounded-full px-1.5 py-0.5 text-label-s tabular-nums transition-colors duration-300 sm:px-2",
              i === active ? "bg-accent text-text-inverse" : i < active ? "text-accent-text" : "text-text-secondary",
            )}
          >
            {s.step}
          </span>
          {i < STOPS.length - 1 && (
            <span className={cx("h-px min-w-1.5 flex-1", i < active ? "bg-accent" : "bg-border-default")} />
          )}
        </li>
      ))}
    </ol>
  );
}

function StopCard({ s, isActive, compact = false }: { s: Stop; isActive: boolean; compact?: boolean }) {
  // Compact (mobile) cards keep everything expanded: only one card is visible at a time and the
  // pinned panel needs a constant height, so nothing may grow after ScrollTrigger measured it.
  const expanded = isActive || compact;
  return (
    <article
      className={cx(
        "scrolly-card flex gap-4 rounded-16 transition-[background-color,box-shadow,border-color] duration-300",
        compact ? "p-3" : "p-4",
        isActive
          ? "border border-border-default bg-bg-surface shadow-[0_8px_24px_-8px_rgba(0,0,0,0.06)]"
          : "border border-transparent bg-bg-muted",
      )}
      aria-current={isActive ? "step" : undefined}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <h3 className={cx("flex items-baseline gap-3", compact ? "text-label-m" : "text-h4")}>
          {compact && <span className="text-accent-text tabular-nums">{s.step}</span>}
          <span className={isActive ? "text-text-primary" : "text-text-secondary"}>{s.title}</span>
        </h3>
        {compact && <p className="text-body-s text-text-secondary">{s.text}</p>}
        {/* Desktop: text and steps expand only for the active stop, so five stops fit a laptop screen.
          Collapsed content stays in the accessibility tree (no aria-hidden), it is only visually folded. */}
        <div
          data-steps
          className="grid transition-[grid-template-rows,opacity] duration-300 motion-reduce:transition-none"
          style={{ gridTemplateRows: expanded ? "1fr" : "0fr", opacity: expanded ? 1 : 0 }}
        >
          <div className="flex flex-col gap-3 overflow-hidden">
            {!compact && <p className="text-body-m text-text-secondary">{s.text}</p>}
            <ul className="flex flex-wrap gap-1.5 lg:gap-2">
              {s.steps.map((t) => (
                <li
                  key={t}
                  className="inline-flex items-center gap-1.5 rounded-full border border-accent bg-accent-soft py-1 pl-2 pr-2.5 text-label-s text-accent-text lg:py-1.5 lg:pl-2.5 lg:pr-3"
                >
                  <Icon name="check" className="size-3" strokeWidth={2.25} />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </article>
  );
}

export function FieldDay() {
  const panelRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useGSAP(
    () => {
      const panel = panelRef.current;
      if (!panel) return;
      const mm = gsap.matchMedia();

      // Note: the matchMedia callback runs only when at least one condition matches, hence the "mobile" one too
      mm.add(
        {
          desktop: "(min-width: 1024px)",
          mobile: "(max-width: 1023px)",
          reduce: "(prefers-reduced-motion: reduce)",
        },
        (ctx) => {
          const { desktop, reduce } = ctx.conditions as { desktop: boolean; mobile: boolean; reduce: boolean };
          const root = desktop ? ".scrolly-desktop" : ".scrolly-mobile";
          const screens = gsap.utils.toArray<HTMLElement>(`${root} .scrolly-screen`, panel);
          const phone = panel.querySelector<HTMLElement>(`${root} .day-phone`);
          const web = panel.querySelector<HTMLElement>(`${root} .day-web`);
          const progress = panel.querySelector<HTMLElement>(`${root} .day-progress`);
          if (!screens.length || !phone || !web) return;

          if (reduce) {
            // No pin and no animation: first screen, stops stacked below each other
            gsap.set(screens, { autoAlpha: 0 });
            gsap.set(screens[0], { autoAlpha: 1 });
            gsap.set(web, { autoAlpha: 0 });
            if (progress) gsap.set(progress, { scaleY: 0 });
            setActive(0);
            return;
          }

          // Desktop: reserve the tallest timeline state so the pinned panel never grows after measuring
          const list = desktop ? panel.querySelector<HTMLElement>(`${root} ol`) : null;
          const reserve = () => {
            if (list) reserveTimelineHeight(list);
          };
          reserve();
          ScrollTrigger.addEventListener("refreshInit", reserve);

          gsap.set(screens, { autoAlpha: 0, y: 16 });
          gsap.set(screens[0], { autoAlpha: 1, y: 0 });
          gsap.set(web, { autoAlpha: 0, y: 16, scale: 0.98 });
          if (progress) gsap.set(progress, { scaleY: 0, transformOrigin: "top center" });

          // Pin the panel (desktop and mobile) + scrub: screens, device swap and day progress
          const tl = gsap.timeline({
            defaults: { ease: "sine.inOut" },
            scrollTrigger: {
              trigger: panel,
              start: () => {
                if (!desktop) {
                  const fit = window.innerHeight - panel.offsetHeight - 12;
                  return `top ${Math.max(64, Math.min(96, fit))}px`;
                }
                const free = window.innerHeight - panel.offsetHeight;
                return `top ${Math.max(88, free / 2)}px`;
              },
              end: desktop ? "+=2500" : "+=1900",
              pin: true,
              pinSpacing: true,
              scrub: 0.6,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                const p = self.progress;
                setActive(Math.min(STOPS.length - 1, Math.floor(p * STOPS.length)));
              },
            },
          });

          // Equal segments per stop; each switch is centered on the boundary where setActive changes the card
          const seg = 0.6;
          const total = STOPS.length * seg;
          for (let i = 1; i < screens.length; i++) {
            const at = i * seg - 0.15;
            tl.to(screens[i - 1], { autoAlpha: 0, y: -12, duration: 0.3 }, at).to(
              screens[i],
              { autoAlpha: 1, y: 0, duration: 0.3 },
              at,
            );
          }
          const toWeb = PHONE_STOPS.length * seg;
          tl.to(phone, { autoAlpha: 0, y: -16, scale: 0.96, duration: 0.3 }, toWeb - 0.2)
            .to(web, { autoAlpha: 1, y: 0, scale: 1, duration: 0.35 }, toWeb - 0.15)
            .to({}, { duration: 0.2 }, total - 0.2);
          if (progress) tl.to(progress, { scaleY: 1, duration: total, ease: "none" }, 0);

          return () => ScrollTrigger.removeEventListener("refreshInit", reserve);
        },
      );
    },
    { scope: panelRef },
  );

  return (
    <section id="pre-sestry" aria-label="Priebeh návštevy" className="bg-bg-surface py-12 lg:py-32">
      <div className="container-page flex flex-col gap-10 lg:gap-16">
        <SectionHeader
          eyebrow="V teréne"
          title="Dokumentácia vzniká pri pacientovi, nie večer v kancelárii."
          lead="Takto prebieha návšteva s Alma ADOS pri akomkoľvek výkone: záznam vzniká počas návštevy na telefóne a kancelária ho má k dispozícii priebežne, bez zbytočného prepisovania."
        />

        {/* Scrolly panel: block wrapper so the pin-spacer is not a flex item */}
        <div className="w-full">
          {/* The pinned element is an unstyled wrapper; the gray panel inside keeps its natural height */}
          <div ref={panelRef} className="w-full">
            <div className="w-full rounded-[20px] bg-bg-muted p-4 sm:p-6 lg:rounded-[24px] lg:px-14 lg:py-10">
              {/* Desktop: pinned device on the left, timeline with stops on the right */}
              <div className="scrolly-desktop hidden lg:flex lg:flex-row lg:items-center lg:gap-14">
                <div className="flex w-[460px] shrink-0 flex-col items-center gap-4">
                  <div className="flex w-full items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-2 rounded-8 bg-bg-surface py-1.5 pl-2.5 pr-3 text-label-s text-text-primary ring-1 ring-border-default">
                      <span className="tabular-nums">Krok {active + 1} z {STOPS.length}</span>
                      <span className="text-text-tertiary">·</span>
                      <span className="text-text-secondary">{STOPS[active].device === "web" ? "Kancelária" : "V teréne"}</span>
                    </span>
                    <PreviewLabel />
                  </div>
                  <div className="flex min-h-[560px] w-full items-center">
                    <DeviceStack
                      active={active}
                      phoneClassName="w-[264px]"
                      phoneSizes="264px"
                      webSizes="460px"
                    />
                  </div>
                </div>

                <ol className="relative flex min-w-0 flex-1 flex-col gap-2.5">
                  {/* Vertical axis and its progress */}
                  <span aria-hidden="true" className="absolute bottom-7 left-[71px] top-7 w-[2px] rounded-full bg-border-default" />
                  <span aria-hidden="true" className="day-progress absolute bottom-7 left-[71px] top-7 w-[2px] rounded-full bg-accent" />
                  {STOPS.map((s, i) => {
                    const isActive = i === active;
                    const done = i < active;
                    return (
                      <li key={s.step} className="grid grid-cols-[52px_24px_1fr] gap-x-2">
                        <span
                          className={cx(
                            "mt-[18px] text-label-m tabular-nums transition-colors duration-300",
                            isActive ? "text-accent-text" : "text-text-secondary",
                          )}
                        >
                          {s.step}
                        </span>
                        <span className="relative flex justify-center">
                          <span
                            aria-hidden="true"
                            className={cx(
                              "relative z-10 mt-[22px] size-3 rounded-full ring-4 ring-bg-muted transition-colors duration-300",
                              isActive || done ? "bg-accent" : "bg-border-default",
                            )}
                          />
                        </span>
                        <StopCard s={s} isActive={isActive} />
                      </li>
                    );
                  })}
                </ol>
              </div>

              {/* Mobile: pinned device on top, timeline and a single stop below it (all stops stacked with reduced motion) */}
              <div className="scrolly-mobile relative flex flex-col items-center gap-2.5 lg:hidden">
                {/* Tiny corner tag: sits in the free corner of the gray panel, never over the device */}
                <span
                  className={cx(
                    "absolute left-0 top-0 z-10 flex max-w-[64px] flex-col rounded-8 bg-bg-dark px-1.5 py-1 text-[9px] leading-[12px] text-text-inverse transition-opacity duration-300",
                    STOPS[active].device === "web" && "opacity-0",
                  )}
                >
                  <span>Ukážkové</span>
                  <span>údaje</span>
                </span>
                {/* Device height follows the viewport so the pinned panel (incl. step chips) fits short phones.
                  svh (not vh): mobile Chrome resizes vh when its toolbar collapses, which would grow the panel
                  after ScrollTrigger measured it and make it overlap the content below. */}
                <div className="flex min-h-[min(400px,42vh)] w-full max-w-[360px] items-center supports-[height:1svh]:min-h-[min(400px,42svh)]">
                  <DeviceStack
                    active={active}
                    phoneClassName="w-[min(188px,19vh)] supports-[height:1svh]:w-[min(188px,19svh)]"
                    phoneSizes="188px"
                    webSizes="360px"
                    bezel="thin"
                  />
                </div>
                <TimeRow active={active} />
                <ol className={cx("w-full", reduced ? "flex flex-col gap-3" : "grid")}>
                  {STOPS.map((s, i) => {
                    const isActive = reduced || i === active;
                    return (
                      <li
                        key={s.step}
                        aria-hidden={!isActive}
                        className={cx(
                          !reduced && "col-start-1 row-start-1 transition-opacity duration-300",
                          !reduced && (isActive ? "opacity-100" : "pointer-events-none opacity-0"),
                        )}
                      >
                        <StopCard s={s} isActive={isActive} compact />
                      </li>
                    );
                  })}
                </ol>
              </div>

              <p className="sr-only" aria-live="polite">
                Krok {active + 1}: {STOPS[active].title}
              </p>
            </div>
          </div>
        </div>

        {/* Proposed features */}
        <div className="flex flex-col items-start gap-5 lg:gap-6">
          <Badge variant="status" className="gsap-reveal">
            Navrhované funkcie · vo vývoji
          </Badge>
          <ul className="flex flex-wrap gap-2">
            {FEATURES.map((f) => (
              <li key={f} className="gsap-reveal">
                <Chip>{f}</Chip>
              </li>
            ))}
          </ul>
          <p className="gsap-reveal text-body-s text-text-secondary">
            Aplikácia pre sestry beží na iOS aj Androide. Tieto funkcie dnes testujeme a dolaďujeme, ich
            finálnu podobu nastavíme podľa skúseností pilotných partnerov, vrátane práce bez signálu.
          </p>
        </div>
      </div>
    </section>
  );
}

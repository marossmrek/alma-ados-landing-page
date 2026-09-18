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
import { Badge } from "@/components/ui/Badge";
import { Chip } from "@/components/ui/Chip";
import { Icon } from "@/components/ui/Icon";

/* One day of a nurse in four stops. The first three on the phone in the field, the fourth on the web in the office. */
const STOPS = [
  {
    time: "07:30",
    title: "Denný plán",
    text: "Ráno sestra vidí trasu, poradie návštev a plánovanú starostlivosť. Potrebné informácie má na jednom mieste.",
    steps: ["Denný plán návštev", "Informácie o pacientovi", "Plánovaná starostlivosť"],
    device: "phone",
    screen: "/images/phone-plan.png",
    alt: "Obrazovka mobilnej aplikácie: dnešný plán návštev s mapou trasy a ďalšou zastávkou",
  },
  {
    time: "09:10",
    title: "Návšteva",
    text: "Pri pacientovi má sestra plán starostlivosti pred sebou a zapisuje priamo, čo urobila.",
    steps: ["Navigácia k pacientovi", "Vykonané úkony", "Merania"],
    device: "phone",
    screen: "/images/phone-visit.png",
    alt: "Obrazovka mobilnej aplikácie: prebiehajúca návšteva u pacienta so zoznamom výkonov",
  },
  {
    time: "09:25",
    title: "Dokumentácia na mieste",
    text: "Rana, poznámky, výnimky. Hlasom alebo klávesnicou, aj bez signálu. Návšteva sa uzavrie jedným krokom.",
    steps: ["Dokumentácia rany", "Hlasový zápis", "Dokončenie návštevy"],
    device: "phone",
    screen: "/images/phone-wound.png",
    alt: "Obrazovka mobilnej aplikácie: dokumentácia rany s rozmermi, ošetrením a fotodokumentáciou",
  },
  {
    time: "16:00",
    title: "Kancelária má prehľad",
    text: "Návštevy, vykonaná starostlivosť a dokumentácia sú priebežne dostupné v systéme na kontrolu a ďalšie spracovanie.",
    steps: ["Kontrola záznamov", "Výnimky na doplnenie", "Podklady na vykazovanie"],
    device: "web",
    screen: "/images/dashboard-v2.png",
    alt: "Webový prehľad pre vedúcu sestru a administratívu: schvaľovanie návštev s tabuľkou a detailom pacienta",
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
        className="day-web col-start-1 row-start-1 w-full overflow-hidden rounded-12 bg-bg-surface shadow-[0_24px_48px_-12px_rgba(20,23,31,0.18)] ring-1 ring-border-default"
        aria-hidden={!webActive}
      >
        <Image
          src={WEB_STOP.screen}
          alt={WEB_STOP.alt}
          width={2400}
          height={1588}
          sizes={webSizes}
          className="h-auto w-full"
        />
      </div>
    </div>
  );
}

/* Compact timeline (mobile): four times in a row, the active one highlighted */
function TimeRow({ active }: { active: number }) {
  return (
    <ol className="flex w-full items-center gap-1.5" aria-hidden="true">
      {STOPS.map((s, i) => (
        <li key={s.time} className={cx("flex items-center gap-1.5", i < STOPS.length - 1 && "min-w-0 flex-1")}>
          <span
            className={cx(
              "shrink-0 rounded-full px-1.5 py-0.5 text-label-s tabular-nums transition-colors duration-300 sm:px-2",
              i === active ? "bg-accent text-text-inverse" : i < active ? "text-accent-text" : "text-text-secondary",
            )}
          >
            {s.time}
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
  // Compact (mobile) cards keep their chips expanded: only one card is visible at a time and the
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
          {compact && <span className="text-accent-text tabular-nums">{s.time}</span>}
          <span className={isActive ? "text-text-primary" : "text-text-secondary"}>{s.title}</span>
        </h3>
        <p className={cx("text-text-secondary", compact ? "text-body-s" : "text-body-m")}>{s.text}</p>
        {/* Steps expand only for the active stop, so the pinned panel stays short */}
        <div
          data-steps
          className="grid transition-[grid-template-rows,opacity] duration-300 motion-reduce:transition-none"
          style={{ gridTemplateRows: expanded ? "1fr" : "0fr", opacity: expanded ? 1 : 0 }}
          aria-hidden={!expanded}
        >
          <ul className="flex flex-wrap gap-1.5 overflow-hidden lg:gap-2">
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
              end: desktop ? "+=2000" : "+=1500",
              pin: true,
              pinSpacing: true,
              scrub: 0.6,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                const p = self.progress;
                setActive(p < 0.2 ? 0 : p < 0.5 ? 1 : p < 0.8 ? 2 : 3);
              },
            },
          });

          // Switch times match the 0.2 / 0.5 / 0.8 thresholds of the total 2.4 duration
          tl.to(screens[0], { autoAlpha: 0, y: -12, duration: 0.3 }, 0.35)
            .to(screens[1], { autoAlpha: 1, y: 0, duration: 0.3 }, 0.35)
            .to(screens[1], { autoAlpha: 0, y: -12, duration: 0.3 }, 1.05)
            .to(screens[2], { autoAlpha: 1, y: 0, duration: 0.3 }, 1.05)
            .to(phone, { autoAlpha: 0, y: -16, scale: 0.96, duration: 0.3 }, 1.8)
            .to(web, { autoAlpha: 1, y: 0, scale: 1, duration: 0.35 }, 1.85)
            .to({}, { duration: 0.2 }, 2.2);
          if (progress) tl.to(progress, { scaleY: 1, duration: 2.4, ease: "none" }, 0);

          return () => ScrollTrigger.removeEventListener("refreshInit", reserve);
        },
      );
    },
    { scope: panelRef },
  );

  return (
    <section id="pre-sestry" aria-label="Jeden deň sestry" className="bg-bg-surface py-12 lg:py-32">
      <div className="container-page flex flex-col gap-10 lg:gap-16">
        <SectionHeader
          eyebrow="V teréne"
          title="Jeden deň sestry. Od ranného plánu po hotové podklady."
          lead="Takto by vyzeral bežný deň s Alma ADOS: dokumentácia vzniká počas návštev na telefóne a kancelária ju má k dispozícii priebežne, bez zbytočného prepisovania."
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
                      <Icon name="clock" className="size-4 text-accent" />
                      <span className="tabular-nums">{STOPS[active].time}</span>
                      <span className="text-text-tertiary">·</span>
                      <span className="text-text-secondary">{STOPS[active].device === "web" ? "Kancelária" : "V teréne"}</span>
                    </span>
                    <PreviewLabel>Koncept · ukážkové údaje</PreviewLabel>
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
                      <li key={s.time} className="grid grid-cols-[52px_24px_1fr] gap-x-2">
                        <span
                          className={cx(
                            "mt-[18px] text-label-m tabular-nums transition-colors duration-300",
                            isActive ? "text-accent-text" : "text-text-secondary",
                          )}
                        >
                          {s.time}
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
              <div className="scrolly-mobile flex flex-col items-center gap-2.5 lg:hidden">
                {/* Device height follows the viewport so the pinned panel (incl. step chips) fits short phones */}
                <div className="relative flex min-h-[min(400px,42vh)] w-full max-w-[360px] items-center">
                  <DeviceStack
                    active={active}
                    phoneClassName="w-[min(188px,19vh)]"
                    phoneSizes="188px"
                    webSizes="360px"
                    bezel="thin"
                  />
                  {/* Floats over the device, takes no height; the web mockup carries its own label */}
                  <PreviewLabel
                    className={cx(
                      "absolute bottom-2 left-1/2 -translate-x-1/2 transition-opacity duration-300",
                      STOPS[active].device === "web" && "opacity-0",
                    )}
                  >
                    Koncept · ukážkové údaje
                  </PreviewLabel>
                </div>
                <TimeRow active={active} />
                <ol className={cx("w-full", reduced ? "flex flex-col gap-3" : "grid")}>
                  {STOPS.map((s, i) => {
                    const isActive = reduced || i === active;
                    return (
                      <li
                        key={s.time}
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
                {STOPS[active].time}: {STOPS[active].title}
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
            Tieto funkcie sú vo fáze návrhu a vývoja. Ich rozsah a finálnu podobu chceme nastaviť podľa
            skúseností pilotných partnerov, vrátane práce bez signálu, ktorú v teréne považujeme za
            nevyhnutnú.
          </p>
        </div>
      </div>
    </section>
  );
}

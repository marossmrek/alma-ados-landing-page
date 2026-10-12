"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { reserveTimelineHeight } from "@/lib/timeline";
import { cx } from "@/lib/cx";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PreviewLabel } from "@/components/ui/PreviewLabel";
import { BrowserFrame } from "@/components/ui/Browser";
import { PlusField } from "@/components/ui/PlusField";
import { Badge } from "@/components/ui/Badge";
import { Chip } from "@/components/ui/Chip";
import { Counter } from "@/components/ui/Counter";
import { Icon } from "@/components/ui/Icon";

/*
  Head nurse overview in three stops. Same language as "Priebeh návštevy" (FieldDay):
  pinned panel, timeline, screenshot spotlight switched by scroll.
  Area coordinates are in the 1200 × 816 space of the Vykazovanie screenshot (2400 × 1633 at 2×).
*/
type Rect = { x: number; y: number; w: number; h: number };

const STOPS = [
  {
    time: "08:00",
    title: "Čo prišlo z terénu",
    text: "Návštevy zapísané v teréne prichádzajú priebežne do Vykazovania. Vedúca sestra vidí, čo čaká na kontrolu a pri ktorých návštevách je upozornenie.",
    steps: ["Návštevy na kontrolu", "Plán a skutočnosť výkonov", "Upozornenia"],
    tooltip: "82 návštev čaká na kontrolu",
    tooltipShort: "82 na kontrolu",
    rects: [
      { x: 214, y: 86, w: 164, h: 34 },
      { x: 232, y: 151, w: 146, h: 32 },
    ] as Rect[],
    counts: { caka: 82, upozornenie: 4, vratene: 0, schvalene: 128 },
  },
  {
    time: "10:30",
    title: "Kontrola a schválenie",
    text: "Hodnoty mimo normy a chýbajúce údaje systém zvýrazní. Vedúca sestra návštevu skontroluje, schváli alebo vráti sestre na doplnenie.",
    steps: ["Hodnoty mimo normy", "Kontrola návštevy", "Vrátiť na doplnenie"],
    tooltip: "Hodnota mimo normy · skontrolovať",
    tooltipShort: "Mimo normy",
    rects: [
      { x: 218, y: 404, w: 956, h: 151 },
      { x: 380, y: 151, w: 107, h: 32 },
    ] as Rect[],
    counts: { caka: 80, upozornenie: 2, vratene: 1, schvalene: 129 },
  },
  {
    time: "15:00",
    title: "Podklady pre poisťovne",
    text: "Zo schválených návštev Alma pripraví podklady na vykazovanie zdravotným poisťovniam v časti Export pre poisťovne.",
    steps: ["Schválené návštevy", "Export pre poisťovne", "Podklady na vykazovanie"],
    tooltip: "Export pre poisťovne zo schválených návštev",
    tooltipShort: "Export pre poisťovne",
    rects: [
      { x: 384, y: 86, w: 126, h: 34 },
      { x: 568, y: 151, w: 96, h: 32 },
    ] as Rect[],
    counts: { caka: 54, upozornenie: 0, vratene: 1, schvalene: 157 },
  },
] as const;

type Stop = (typeof STOPS)[number];

const COUNTERS = [
  { key: "caka", label: "Čakajú na kontrolu", labelShort: "Na kontrolu" },
  { key: "upozornenie", label: "S upozornením", labelShort: "S upozornením" },
  { key: "vratene", label: "Vrátené sestre", labelShort: "Vrátené sestre" },
  { key: "schvalene", label: "Schválené v októbri", labelShort: "Schválené" },
] as const;

const PLANNED = [
  "Plánovanie návštev a zastupovanie",
  "Kontrola a schvaľovanie návštev",
  "Podklady pre poisťovne",
  "Štatistiky",
  "Nový pacient z dokumentu (AI)",
];

const W = 1200;
const H = 816;

/* Dashboard with spotlight: the mask darkens everything except the active stop's areas */
function Dashboard({ active, tipId, sizes }: { active: number; tipId: string; sizes: string }) {
  const stop = STOPS[active];
  const first = stop.rects[0];
  return (
    <BrowserFrame className="w-full shadow-[0_24px_48px_-12px_rgba(20,23,31,0.14)]">
      <div className="relative w-full" style={{ aspectRatio: `${W} / ${H}` }}>
        <Image
          src="/images/web-reporting-2610.png"
          alt="Webová aplikácia Alma ADOS, Vykazovanie: návštevy čakajúce na kontrolu, filtre podľa stavu a návštevy s hodnotou mimo normy. Ukážkové údaje."
          width={2400}
          height={1633}
          sizes={sizes}
          className="pointer-events-none absolute inset-0 h-auto w-full"
        />
        <div className="office-spot pointer-events-none absolute inset-0" aria-hidden="true">
          <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="absolute inset-0 size-full">
            <defs>
              <mask id={`${tipId}-mask`}>
                <rect x="0" y="0" width={W} height={H} fill="white" />
                {stop.rects.map((r, i) => (
                  <rect
                    key={i}
                    x={r.x}
                    y={r.y}
                    width={r.w}
                    height={r.h}
                    rx="10"
                    fill="black"
                    className="office-rect"
                  />
                ))}
              </mask>
            </defs>
            <rect x="0" y="0" width={W} height={H} fill="#14181f" fillOpacity="0.5" mask={`url(#${tipId}-mask)`} />
            {stop.rects.map((r, i) => (
              <rect
                key={i}
                x={r.x}
                y={r.y}
                width={r.w}
                height={r.h}
                rx="10"
                fill="none"
                stroke="#0f8b8d"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
                className="office-rect"
              />
            ))}
          </svg>
          <span
            id={tipId}
            role="tooltip"
            className="office-rect absolute inline-flex max-w-[88%] -translate-y-full items-center whitespace-nowrap rounded-full bg-accent px-2.5 py-1 text-caption text-text-inverse lg:px-3 lg:py-1.5 lg:text-label-s shadow-[0_8px_24px_-8px_rgba(0,0,0,0.3)]"
            style={{ left: `${(first.x / W) * 100}%`, top: `calc(${(first.y / H) * 100}% - 8px)` }}
          >
            <span className="lg:hidden">{stop.tooltipShort}</span>
            <span className="hidden lg:inline">{stop.tooltip}</span>
          </span>
        </div>
      </div>
    </BrowserFrame>
  );
}

/* Status counts (same filters as in the screenshot) that change with the stops, so the screen is not just an image */
function DayCounters({ active, compact = false }: { active: number; compact?: boolean }) {
  const c = STOPS[active].counts;
  return (
    <dl className={cx("grid w-full", compact ? "grid-cols-2 gap-1.5" : "grid-cols-4 gap-2")}>
      {COUNTERS.map((k) => {
        const v = c[k.key];
        return (
          <div
            key={k.key}
            className={cx(
              "flex rounded-10 border bg-bg-surface transition-colors duration-300",
              compact ? "flex-row items-baseline justify-between gap-2 px-2.5 py-1.5" : "flex-col gap-0.5 px-3 py-2",
              v > 0 ? "border-border-default" : "border-transparent",
            )}
          >
            <dt className={cx("text-text-tertiary", compact ? "min-w-0 truncate text-[11px] leading-4" : "text-caption")}>
              {compact ? k.labelShort : k.label}
            </dt>
            <dd
              className={cx(
                "transition-colors duration-300",
                compact ? "shrink-0 text-label-m tabular-nums" : "text-h4",
                v > 0 ? "text-text-primary" : "text-text-tertiary",
              )}
            >
              <Counter value={v} duration={0.6} />
            </dd>
          </div>
        );
      })}
    </dl>
  );
}

function TimeRow({ active }: { active: number }) {
  return (
    <ol className="flex w-full items-center justify-center gap-2" aria-hidden="true">
      {STOPS.map((s, i) => (
        <li key={s.time} className="flex items-center gap-2">
          <span
            className={cx(
              "rounded-full px-2 py-0.5 text-label-s tabular-nums transition-colors duration-300",
              i === active ? "bg-accent text-text-inverse" : i < active ? "text-accent-text" : "text-text-secondary",
            )}
          >
            {s.time}
          </span>
          {i < STOPS.length - 1 && (
            <span className={cx("h-px w-6 sm:w-10", i < active ? "bg-accent" : "bg-border-default")} />
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
        "flex gap-4 rounded-16 transition-[background-color,box-shadow,border-color] duration-300",
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

export function OfficeDay() {
  const panelRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [reduced, setReduced] = useState(false);
  const tipId = useId();

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useGSAP(
    () => {
      const panel = panelRef.current;
      if (!panel) return;
      const mm = gsap.matchMedia();

      mm.add(
        {
          desktop: "(min-width: 1024px)",
          mobile: "(max-width: 1023px)",
          reduce: "(prefers-reduced-motion: reduce)",
        },
        (ctx) => {
          const { desktop, reduce } = ctx.conditions as { desktop: boolean; mobile: boolean; reduce: boolean };
          const root = desktop ? ".office-desktop" : ".office-mobile";
          const progress = panel.querySelector<HTMLElement>(`${root} .office-progress`);

          if (reduce) {
            if (progress) gsap.set(progress, { scaleY: 0 });
            setActive(0);
            return;
          }
          if (progress) gsap.set(progress, { scaleY: 0, transformOrigin: "top center" });

          // Desktop: reserve the tallest timeline state so the pinned panel never grows after measuring
          const list = desktop ? panel.querySelector<HTMLElement>(`${root} ol`) : null;
          const reserve = () => {
            if (list) reserveTimelineHeight(list);
          };
          reserve();
          ScrollTrigger.addEventListener("refreshInit", reserve);

          const tl = gsap.timeline({
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
              end: desktop ? "+=1500" : "+=1100",
              pin: true,
              pinSpacing: true,
              scrub: 0.6,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                const p = self.progress;
                setActive(p < 0.3 ? 0 : p < 0.66 ? 1 : 2);
              },
            },
          });
          tl.to({}, { duration: 1 });
          if (progress) tl.to(progress, { scaleY: 1, duration: 1, ease: "none" }, 0);

          return () => ScrollTrigger.removeEventListener("refreshInit", reserve);
        },
      );
    },
    { scope: panelRef },
  );

  return (
    <section id="pre-ados" aria-label="Prehľad pre vedúcu sestru" className="relative overflow-hidden">
      <PlusField className="bottom-[-10px] left-[-30px] h-[230px] lg:bottom-[40px] lg:left-[-50px] lg:h-[320px] xl:bottom-[60px] xl:left-[-70px] xl:h-[460px]" />
      <div className="container-page relative flex flex-col gap-10 py-12 lg:gap-16 lg:py-32">
        <SectionHeader
          eyebrow="V kancelárii"
          title="Prehľad pre vedúcu sestru. Od návštev až po podklady pre vykazovanie."
          lead="Webová časť dáva vedúcej sestre a administratíve prehľad o návštevách, dokumentácii a údajoch, ktoré si vyžadujú kontrolu. Na jednom mieste vidia, čo sa deje v teréne a čo je pripravené na ďalšie spracovanie."
        />

        {/* Pinned panel: dashboard on the left (on top on mobile), timeline on the right */}
        <div className="w-full">
          {/* The pinned element is an unstyled wrapper; the gray panel inside keeps its natural height */}
          <div ref={panelRef} className="w-full">
            <div className="w-full rounded-[20px] bg-bg-muted p-3 sm:p-6 lg:rounded-[24px] lg:px-10 lg:py-10">
              {/* Desktop */}
              <div className="office-desktop hidden lg:grid lg:grid-cols-[1fr_430px] lg:items-center lg:gap-10">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between gap-4">
                    <span className="inline-flex items-center gap-2 rounded-8 bg-bg-surface py-1.5 pl-2.5 pr-3 text-label-s text-text-primary ring-1 ring-border-default">
                      <Icon name="clock" className="size-4 text-accent" />
                      <span className="tabular-nums">{STOPS[active].time}</span>
                      <span className="text-text-tertiary">·</span>
                      <span className="text-text-secondary">Kancelária</span>
                    </span>
                    <PreviewLabel />
                  </div>
                  <Dashboard active={active} tipId={`${tipId}-d`} sizes="(min-width: 1280px) 720px, 60vw" />
                  <DayCounters active={active} />
                </div>

                <ol className="relative flex min-w-0 flex-col gap-2.5">
                  <span aria-hidden="true" className="absolute bottom-7 left-[71px] top-7 w-[2px] rounded-full bg-border-default" />
                  <span aria-hidden="true" className="office-progress absolute bottom-7 left-[71px] top-7 w-[2px] rounded-full bg-accent" />
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

              {/* Mobile */}
              <div className="office-mobile flex flex-col items-center gap-2.5 lg:hidden">
                <Dashboard active={active} tipId={`${tipId}-m`} sizes="100vw" />
                <DayCounters active={active} compact />
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

        {/* Other areas of the web part */}
        <div className="flex flex-col items-start gap-5 lg:gap-6">
          <Badge variant="status" className="gsap-reveal">
            Ďalej plánujeme · vo vývoji
          </Badge>
          <ul className="flex flex-wrap gap-2">
            {PLANNED.map((f) => (
              <li key={f} className="gsap-reveal">
                <Chip>{f}</Chip>
              </li>
            ))}
          </ul>
          <p className="gsap-reveal max-w-[72ch] text-body-s text-text-secondary">
            Tieto časti webovej aplikácie dnes testujeme a dolaďujeme s pilotnými partnermi. Priame prepojenie
            s poisťovňami nie je súčasťou prvej verzie, podklady pre vykazovanie áno.
          </p>
        </div>
      </div>
    </section>
  );
}

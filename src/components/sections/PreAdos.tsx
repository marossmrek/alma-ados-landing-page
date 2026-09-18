"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { cx } from "@/lib/cx";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PreviewLabel } from "@/components/ui/PreviewLabel";
import { PlusField } from "@/components/ui/PlusField";
import { Badge } from "@/components/ui/Badge";
import { Chip } from "@/components/ui/Chip";
import { Counter } from "@/components/ui/Counter";
import { Icon } from "@/components/ui/Icon";

/*
  Prehľad pre vedúcu sestru v troch zastávkach. Rovnaký jazyk ako „Jeden deň sestry":
  pripnutý panel, časová os, spotlight na dashboarde sa prepína scrollom.
  Súradnice oblastí sú v priestore mockupu 1200 × 794 (Figma „Browser · Backoffice").
*/
type Rect = { x: number; y: number; w: number; h: number };

const STOPS = [
  {
    time: "08:00",
    title: "Čo prišlo z terénu",
    text: "Návštevy a záznamy z terénu sú priebežne dostupné v systéme. Vedúca vidí ich stav a položky, ktoré si vyžadujú pozornosť.",
    steps: ["Prehľad návštev", "Stav záznamov", "Výnimky"],
    tooltip: "7 záznamov na kontrolu",
    rects: [
      { x: 216, y: 146, w: 430, h: 33 },
      { x: 12, y: 144, w: 170, h: 29 },
    ] as Rect[],
    counts: { caka: 7, schvalene: 0, vratene: 0, export: 0 },
  },
  {
    time: "10:30",
    title: "Kontrola a výnimky",
    text: "Neúplné alebo problémové záznamy systém zvýrazní. Vedúca ich môže skontrolovať a podľa potreby vrátiť sestre na doplnenie.",
    steps: ["Zvýraznené výnimky", "Kontrola záznamu", "Vrátiť na doplnenie"],
    tooltip: "Skontrolovať · chýba zápis S/O",
    rects: [
      { x: 217, y: 351, w: 558, h: 96 },
      { x: 795, y: 222, w: 380, h: 549 },
    ] as Rect[],
    counts: { caka: 1, schvalene: 5, vratene: 1, export: 0 },
  },
  {
    time: "15:00",
    title: "Podklady pre poisťovňu",
    text: "Skontrolované údaje sú pripravené na ďalšie spracovanie a slúžia ako podklad pre vykazovanie zdravotným poisťovniam.",
    steps: ["Skontrolované údaje", "Podklady pre vykazovanie", "Ďalšie spracovanie"],
    tooltip: "Podklady pre vykazovanie · 6 skontrolovaných návštev",
    rects: [
      { x: 12, y: 318, w: 170, h: 30 },
      { x: 990, y: 53, w: 186, h: 37 },
    ] as Rect[],
    counts: { caka: 0, schvalene: 6, vratene: 1, export: 6 },
  },
] as const;

type Stop = (typeof STOPS)[number];

const COUNTERS = [
  { key: "caka", label: "Na kontrolu" },
  { key: "schvalene", label: "Skontrolované dnes" },
  { key: "vratene", label: "Vrátené sestre" },
  { key: "export", label: "Pripravené na vykazovanie" },
] as const;

const PLANNED = [
  "Plánovanie sestier a návštev",
  "Problémy a výnimky",
  "Prehľad prevádzky",
];

const W = 1200;
const H = 794;

/* Dashboard so spotlightom: maska stmaví všetko okrem oblastí aktívnej zastávky */
function Dashboard({ active, tipId, sizes }: { active: number; tipId: string; sizes: string }) {
  const stop = STOPS[active];
  const first = stop.rects[0];
  return (
    <div
      className="relative w-full overflow-hidden rounded-12 bg-bg-surface shadow-[0_24px_48px_-12px_rgba(20,23,31,0.14)] ring-1 ring-border-default"
      style={{ aspectRatio: `${W} / ${H}` }}
    >
      <Image
        src="/images/dashboard-alma.png"
        alt="Koncept webového prehľadu pre vedúcu sestru a administratívu: schvaľovanie návštev s tabuľkou návštev a detailom pacienta. Štítok Náhľad: koncept pripravovaného produktu, ukážkové údaje."
        width={2400}
        height={1588}
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
          {stop.tooltip}
        </span>
      </div>
    </div>
  );
}

/* Stav dňa: čísla, ktoré sa so zastávkami menia (dashboard tak nie je len obrázok) */
function DayCounters({ active, compact = false }: { active: number; compact?: boolean }) {
  const c = STOPS[active].counts;
  return (
    <dl className={cx("grid w-full gap-2", compact ? "grid-cols-2" : "grid-cols-4")}>
      {COUNTERS.map((k) => {
        const v = c[k.key];
        return (
          <div
            key={k.key}
            className={cx(
              "flex flex-col gap-0.5 rounded-10 border bg-bg-surface px-3 py-2 transition-colors duration-300",
              v > 0 ? "border-border-default" : "border-transparent",
            )}
          >
            <dt className="text-caption text-text-tertiary">{k.label}</dt>
            <dd className={cx("text-h4 transition-colors duration-300", v > 0 ? "text-text-primary" : "text-text-tertiary")}>
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
  return (
    <article
      className={cx(
        "flex gap-4 rounded-16 p-4 transition-[background-color,box-shadow,border-color] duration-300",
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
          className="grid transition-[grid-template-rows,opacity] duration-300 motion-reduce:transition-none"
          style={{ gridTemplateRows: isActive ? "1fr" : "0fr", opacity: isActive ? 1 : 0 }}
          aria-hidden={!isActive}
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

export function PreAdos() {
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

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: panel,
              start: () => {
                if (!desktop) {
                  const fit = window.innerHeight - panel.offsetHeight - 12;
                  return `top ${Math.max(72, Math.min(96, fit))}px`;
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

        {/* Pripnutý panel: dashboard vľavo (hore na mobile), časová os vpravo */}
        <div className="w-full">
          <div
            ref={panelRef}
            className="w-full rounded-[20px] bg-bg-muted p-4 sm:p-6 lg:rounded-[24px] lg:px-10 lg:py-10"
          >
            {/* Desktop */}
            <div className="office-desktop hidden lg:grid lg:grid-cols-[1fr_380px] lg:items-center lg:gap-10">
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

            {/* Mobil */}
            <div className="office-mobile flex flex-col items-center gap-3 lg:hidden">
              <PreviewLabel>Koncept · ukážkové údaje</PreviewLabel>
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

        {/* Ďalšie oblasti webovej časti */}
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
            Rozsah webovej časti nastavíme s pilotnými partnermi. Priame prepojenie s poisťovňami nie je súčasťou
            prvej verzie, podklady pre vykazovanie áno.
          </p>
        </div>
      </div>
    </section>
  );
}

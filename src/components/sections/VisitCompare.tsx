"use client";

import { useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { cx } from "@/lib/cx";
import { Icon, type IconName } from "@/components/ui/Icon";

/*
  One visit, two paths. The "Dnes" / "S Alma ADOS" toggle rewrites the same five steps:
  what we are validating with agencies today (without claiming how every ADOS works) and how it should run with the product.
  The summary lists qualitative goals, not measured results.
*/
type Mode = "today" | "product";

const STEPS: {
  icon: IconName;
  title: string;
  today: { text: string; tag: string };
  product: { text: string; tag: string };
}[] = [
  {
    icon: "calendar",
    title: "Naplánovať",
    today: { text: "Ako vzniká rozpis návštev a ako sa zmeny dostávajú k sestrám, sa medzi agentúrami líši. Zisťujeme, kde koordinácia stojí najviac času.", tag: "koordinácia" },
    product: { text: "Plán s trasami má sestra v telefóne. Zmenu vidí hneď, bez volania.", tag: "v telefóne" },
  },
  {
    icon: "map-pin",
    title: "Navštíviť",
    today: { text: "Overujeme, aké informácie o pacientovi má sestra pri návšteve poruke a čo si musí dohľadávať inde.", tag: "informácie" },
    product: { text: "Plán starostlivosti aj história pacienta sú pri nej. Navigácia až k dverám.", tag: "pri pacientovi" },
  },
  {
    icon: "file-text",
    title: "Zdokumentovať",
    today: { text: "Pýtame sa, kedy a kde dnes vzniká záznam z návštevy a koľko času zaberá mimo pacienta.", tag: "čas na zápis" },
    product: { text: "Zápis hlasom alebo klávesnicou ešte u pacienta. Fotka rany je súčasťou záznamu.", tag: "hneď" },
  },
  {
    icon: "check-circle",
    title: "Skontrolovať",
    today: { text: "Zaujíma nás, ako vedúca sestra dnes zisťuje úplnosť záznamov a ako rieši chýbajúce údaje.", tag: "úplnosť" },
    product: { text: "Záznam je pripravený na kontrolu. Neúplné alebo problémové návštevy systém zvýrazní.", tag: "na kontrolu" },
  },
  {
    icon: "upload",
    title: "Pripraviť na vykázanie",
    today: { text: "Overujeme, ako vznikajú podklady pre poisťovne a či sa pri tom údaje zadávajú opakovane.", tag: "podklady" },
    product: { text: "Schválené výkony sa pripravia do podkladov jedným krokom. Bez zbytočného prepisovania údajov.", tag: "jeden export" },
  },
];

const SUMMARY: { label: string; today: string; product: string }[] = [
  { label: "Čas strávený dokumentáciou", today: "Zisťujeme, koľko", product: "Chceme znížiť" },
  { label: "Telefonáty kvôli koordinácii", today: "Zisťujeme, ako často", product: "Chceme obmedziť" },
  { label: "Opakované zadávanie údajov", today: "Zisťujeme, kde", product: "Chceme minimalizovať" },
];

const MODES: { id: Mode; label: string }[] = [
  { id: "today", label: "Dnes" },
  { id: "product", label: "S Alma ADOS" },
];


export function VisitCompare() {
  const ref = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLButtonElement[]>([]);
  const [mode, setMode] = useState<Mode>("today");
  const first = useRef(true);
  const today = mode === "today";

  const { contextSafe } = useGSAP({ scope: ref });

  // After toggling, the step texts swap subtly (fade + shift); no animation with reduced motion
  useLayoutEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (prefersReducedMotion()) return;
    const run = contextSafe(() => {
      const items = gsap.utils.toArray<HTMLElement>(".vc-swap", ref.current);
      gsap.fromTo(items, { autoAlpha: 0, y: 6 }, { autoAlpha: 1, y: 0, duration: 0.35, stagger: 0.04, ease: "power2.out", overwrite: true });
    });
    run();
  }, [mode, contextSafe]);

  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight" && e.key !== "Home" && e.key !== "End") return;
    e.preventDefault();
    const next = e.key === "Home" ? 0 : e.key === "End" ? MODES.length - 1 : (i + (e.key === "ArrowRight" ? 1 : -1) + MODES.length) % MODES.length;
    setMode(MODES[next].id);
    tabsRef.current[next]?.focus();
  };

  return (
    <div ref={ref} className="flex w-full flex-col gap-6 lg:gap-8">
      {/* Toggle */}
      <div className="gsap-reveal flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <div className="flex flex-col gap-1">
          <h3 className="text-h4 text-text-primary">Jedna návšteva, dve cesty</h3>
          <p className="text-body-s text-text-secondary">
            Čo dnes overujeme s agentúrami a ako by to malo bežať s Alma ADOS.
          </p>
        </div>
        <div role="tablist" aria-label="Priebeh návštevy" className="flex w-full gap-1 rounded-[10px] border border-border-default bg-bg-muted p-1 sm:w-auto">
          {MODES.map((m, i) => {
            const selected = mode === m.id;
            return (
              <button
                key={m.id}
                ref={(el) => {
                  if (el) tabsRef.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`vc-tab-${m.id}`}
                aria-selected={selected}
                aria-controls="vc-panel"
                tabIndex={selected ? 0 : -1}
                onClick={() => setMode(m.id)}
                onKeyDown={(e) => onKey(e, i)}
                className={cx(
                  "focus-ring flex flex-1 items-center justify-center whitespace-nowrap rounded-8 px-4 py-2.5 text-label-m transition-colors sm:min-w-[150px]",
                  selected ? "bg-bg-surface text-text-primary shadow-segment" : "text-text-secondary hover:text-text-primary",
                )}
              >
                {m.label}
              </button>
            );
          })}
        </div>
      </div>

      <div id="vc-panel" role="tabpanel" aria-labelledby={`vc-tab-${mode}`} className="flex w-full flex-col gap-6 lg:gap-8">
        {/* Desktop: row of cards with arrows */}
        <ol className="hidden w-full lg:flex lg:flex-row lg:items-stretch">
          {STEPS.map((s, i) => {
            const v = s[mode];
            return (
              <li key={s.title} className="contents">
                <div
                  className={cx(
                    "flow-card gsap-reveal flex min-w-0 flex-1 flex-col gap-4 self-stretch rounded-16 border p-5 transition-colors duration-300",
                    today ? "border-border-default bg-bg-subtle" : "border-border-default bg-bg-surface",
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={cx(
                        "flow-icon flex size-9 shrink-0 items-center justify-center rounded-[10px] transition-colors duration-300",
                        today ? "bg-bg-muted text-text-tertiary" : "bg-accent-soft text-accent-text",
                      )}
                    >
                      <Icon name={s.icon} className="size-[18px]" />
                    </span>
                    <span
                      className={cx(
                        "vc-swap inline-flex items-center rounded-full px-2.5 py-1 text-caption font-medium whitespace-nowrap",
                        today ? "bg-status-warning-soft text-status-warning" : "bg-accent-soft text-accent-text",
                      )}
                    >
                      {v.tag}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-label-m text-text-primary">{s.title}</p>
                    <p className="vc-swap text-body-s text-text-secondary">{v.text}</p>
                  </div>
                </div>
                {i < STEPS.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="flow-arrow gsap-reveal flex size-10 shrink-0 items-center justify-center self-center text-text-tertiary"
                  >
                    <Icon name="arrow-right" className="size-[18px]" />
                  </span>
                )}
              </li>
            );
          })}
        </ol>

        {/* Mobile and tablet: vertical flow with a line */}
        <ol className="flex flex-col lg:hidden">
          {STEPS.map((s, i) => {
            const v = s[mode];
            return (
              <li key={s.title} className="gsap-reveal relative flex gap-4 pb-5 last:pb-0">
                {i < STEPS.length - 1 && (
                  <span aria-hidden="true" className="absolute bottom-0 left-[17px] top-10 w-0.5 rounded-full bg-border-default" />
                )}
                <span
                  className={cx(
                    "flow-icon relative z-10 flex size-9 shrink-0 items-center justify-center rounded-[10px] transition-colors duration-300",
                    today ? "bg-bg-muted text-text-tertiary" : "bg-accent-soft text-accent-text",
                  )}
                >
                  <Icon name={s.icon} className="size-[18px]" />
                </span>
                <div className="flex min-w-0 flex-1 flex-col gap-1 pt-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-label-m text-text-primary">{s.title}</p>
                    <span
                      className={cx(
                        "vc-swap inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-caption font-medium whitespace-nowrap",
                        today ? "bg-status-warning-soft text-status-warning" : "bg-accent-soft text-accent-text",
                      )}
                    >
                      {v.tag}
                    </span>
                  </div>
                  <p className="vc-swap text-body-s text-text-secondary">{v.text}</p>
                </div>
              </li>
            );
          })}
        </ol>

        {/* Summary: three areas, toggling turns the question into a goal */}
        <div
          className={cx(
            "gsap-reveal flex flex-col gap-3 rounded-16 border p-4 transition-colors duration-300 lg:gap-4 lg:p-5",
            today ? "border-border-default bg-bg-subtle" : "border-accent/30 bg-accent-soft/60",
          )}
        >
          <dl className="grid gap-3 sm:grid-cols-3 lg:gap-4">
          {SUMMARY.map((m) => {
            const v = m[mode];
            return (
              <div key={m.label} className="flex flex-col gap-0.5">
                <dt className="text-caption text-text-tertiary">{m.label}</dt>
                <dd className={cx("vc-swap text-h4 transition-colors duration-300", today ? "text-text-primary" : "text-accent-text")}>
                  {v}
                </dd>
              </div>
            );
          })}
          </dl>
          <p className="text-caption text-text-tertiary">
            Ciele, nie namerané výsledky.
          </p>
        </div>
      </div>
    </div>
  );
}

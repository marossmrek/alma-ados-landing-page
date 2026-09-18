"use client";

import { useId, useState } from "react";
import { cx } from "@/lib/cx";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Counter } from "@/components/ui/Counter";

/* Udalosť pre formulár: predvyplní počet sestier podľa kalkulačky */
export const PREFILL_EVENT = "ados:prefill-pocet-sestier";
export function pocetSestierBucket(n: number) {
  return n <= 3 ? "1-3" : n <= 8 ? "4-8" : "9+";
}

const WORK_DAYS = 21; // pracovných dní v mesiaci
const SAVED_SHARE = 0.6; // konzervatívny predpoklad: 60 % zápisov vznikne priamo pri návšteve

const INPUTS = [
  { key: "sestry", label: "Sestry v teréne", min: 1, max: 20, step: 1, unit: (v: number) => (v === 1 ? "sestra" : v < 5 ? "sestry" : "sestier") },
  { key: "navstevy", label: "Návštevy na sestru za deň", min: 3, max: 14, step: 1, unit: (v: number) => (v === 1 ? "návšteva" : v < 5 ? "návštevy" : "návštev") },
  { key: "minuty", label: "Minúty dopisovania po jednej návšteve", min: 3, max: 25, step: 1, unit: () => "min" },
] as const;

type Key = (typeof INPUTS)[number]["key"];
type Values = Record<Key, number>;

const DEFAULTS: Values = { sestry: 5, navstevy: 8, minuty: 12 };

function hodiny(n: number) {
  const r = Math.round(n);
  return r === 1 ? "hodina" : r < 5 ? "hodiny" : "hodín";
}

function Slider({
  id,
  label,
  min,
  max,
  step,
  value,
  unit,
  onChange,
}: {
  id: string;
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  unit: string;
  onChange: (v: number) => void;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="text-label-m text-text-primary">
          {label}
        </label>
        <output htmlFor={id} className="whitespace-nowrap text-label-m text-accent-text tabular-nums">
          {value} {unit}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="range-accent focus-ring"
        style={{ "--range-pct": `${pct}%` } as React.CSSProperties}
      />
      <div className="flex justify-between text-caption text-text-tertiary tabular-nums" aria-hidden="true">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}

export function Kalkulacka() {
  const baseId = useId();
  const [v, setV] = useState<Values>(DEFAULTS);

  const hoursMonth = (v.sestry * v.navstevy * v.minuty * WORK_DAYS) / 60;
  const daysMonth = hoursMonth / 8;
  const hoursPerNurseWeek = (v.navstevy * v.minuty * 5) / 60;
  const saved = hoursMonth * SAVED_SHARE;

  const prefill = () => {
    window.dispatchEvent(new CustomEvent(PREFILL_EVENT, { detail: pocetSestierBucket(v.sestry) }));
  };

  return (
    <section id="kalkulacka" aria-label="Kalkulačka času" className="bg-bg-surface py-12 lg:py-32">
      <div className="container-page flex flex-col gap-10 lg:gap-16">
        <SectionHeader
          eyebrow="Kalkulačka"
          title="Koľko času dnes berie dopisovanie dokumentácie po návštevách?"
          lead="Zadajte približné čísla vašej ADOS. Skutočné hodnoty chceme zmerať v pilote."
        />

        <div className="gsap-reveal grid gap-3 rounded-[20px] border border-border-default bg-bg-surface p-3 shadow-[0_24px_48px_-12px_rgba(20,23,31,0.08)] lg:grid-cols-[1fr_440px] lg:rounded-[24px]">
          {/* Vstupy */}
          <div className="flex flex-col gap-7 p-3 pt-5 sm:p-5 lg:gap-8 lg:p-7">
            {INPUTS.map((i) => (
              <Slider
                key={i.key}
                id={`${baseId}-${i.key}`}
                label={i.label}
                min={i.min}
                max={i.max}
                step={i.step}
                value={v[i.key]}
                unit={i.unit(v[i.key])}
                onChange={(n) => setV((s) => ({ ...s, [i.key]: n }))}
              />
            ))}
            <p className="text-caption text-text-tertiary">
              Počítame s {WORK_DAYS} pracovnými dňami v mesiaci a 8-hodinovým dňom. Minúty po návšteve sú čas, ktorý
              dnes sestra trávi prepisovaním zápisov mimo pacienta.
            </p>
          </div>

          {/* Výsledok */}
          <div className="flex flex-col gap-6 rounded-[14px] bg-bg-dark p-6 text-text-inverse sm:p-8 lg:rounded-[16px]" aria-live="polite">
            <div className="flex flex-col gap-1">
              <p className="text-label-s text-text-inverse-muted">Dopisovanie dokumentácie dnes</p>
              <p className="flex items-baseline gap-2">
                <Counter value={hoursMonth} className="text-mobile-h2 lg:text-h2" />
                <span className="text-body-l text-text-inverse-muted">{hodiny(hoursMonth)} mesačne</span>
              </p>
            </div>

            <dl className="grid grid-cols-2 gap-4 border-t border-border-dark pt-5">
              <div className="flex flex-col gap-1">
                <dt className="text-caption text-text-inverse-muted">Pracovných dní mesačne</dt>
                <dd className="text-h4">
                  ≈ <Counter value={daysMonth} decimals={1} />
                </dd>
              </div>
              <div className="flex flex-col gap-1">
                <dt className="text-caption text-text-inverse-muted">Na jednu sestru týždenne</dt>
                <dd className="text-h4">
                  <Counter value={hoursPerNurseWeek} decimals={1} /> h
                </dd>
              </div>
            </dl>

            <div className="flex flex-col gap-2 rounded-12 border border-accent-on-dark/30 bg-white/[0.04] p-4">
              <p className="flex items-center gap-2 text-label-s text-accent-on-dark">
                <Icon name="clock" className="size-4" />
                Ak by 60 % zápisov vzniklo priamo pri návšteve
              </p>
              <p className="flex items-baseline gap-2">
                <Counter value={saved} className="text-h3" />
                <span className="text-body-m text-text-inverse-muted">{hodiny(saved)} mesačne späť</span>
              </p>
              <p className="text-caption text-text-inverse-muted">
                Konzervatívny predpoklad. Či je reálny, overíme s pilotnými partnermi v teréne.
              </p>
            </div>

            <div className="mt-auto flex flex-col gap-3">
              <Button href="#kontakt" variant="inverse" arrow focusTarget="#pilot-form [name='meno']" onClick={prefill}>
                Overiť to v pilote
              </Button>
              <p className="text-caption text-text-inverse-muted">
                Počet sestier vám vo formulári predvyplníme.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

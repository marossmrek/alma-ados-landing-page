"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { cx } from "@/lib/cx";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { DecorRings } from "@/components/ui/DecorRings";

const TRANSCRIPT =
  "„Pacient bez teploty, TK 135/85, rana na pravom predkolení preväzovaná podľa plánu, bez známok infekcie. Inzulín podaný…“";

const TYPING = 3; // prepis sa píše 3 s (celá simulácia ~6 s)
const RECORDING_LENGTH = 14; // dĺžka „nahrávky" na časomiere (Figma 00:14)

const ROWS = [
  { label: "Krvný tlak", value: "135/85 mmHg" },
  { label: "Teplota", value: "bez zvýšenej teploty" },
  { label: "Rana", value: "pravé predkolenie · preväz podľa plánu · bez známok infekcie" },
  { label: "Inzulín", value: "podaný" },
];

/* Výšky stĺpcov waveformu 1:1 z Figmy (60 stĺpcov). Prehraná časť je accent, zvyšok border/dark. */
const WAVE = [8, 14, 22, 30, 18, 40, 26, 12, 34, 20, 44, 28, 16, 36, 24, 10, 30, 42, 20, 14, 26, 38, 18, 8, 22, 32, 16, 40, 24, 12, 28, 20, 36, 14, 8, 30, 22, 44, 18, 26, 12, 34, 20, 8, 16, 28, 38, 22, 10, 30, 18, 24, 40, 14, 26, 8, 20, 32, 16, 12];

type Status = "idle" | "playing" | "done";

function formatTime(s: number) {
  const sec = Math.max(0, Math.floor(s));
  return `${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(sec % 60).padStart(2, "0")}`;
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 14 14" className="size-3.5" fill="currentColor" aria-hidden="true">
      <path d="M4 2.5v9l7.5-4.5L4 2.5z" />
    </svg>
  );
}

export function AiDokumentacia() {
  const scope = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const statusRef = useRef<Status>("idle");
  const [status, setStatusState] = useState<Status>("idle");
  const setStatus = (s: Status) => {
    statusRef.current = s;
    setStatusState(s);
  };

  const q = (sel: string) => gsap.utils.toArray<HTMLElement>(sel, scope.current);
  const setTimer = (s: number) => q(".sim-timer").forEach((el) => (el.textContent = formatTime(s)));
  const setTranscript = (chars: number) =>
    q(".sim-transcript").forEach((el) => (el.textContent = TRANSCRIPT.slice(0, chars)));

  /* Waveform podľa priebehu: stĺpce po „playhead" sú accent, okolo playheadu sa hýbu */
  const lastHeadRef = useRef(-1);
  const setWave = (progress: number, live = true) => {
    const bars = q(".sim-bar");
    const head = Math.min(bars.length, Math.round(progress * bars.length));
    bars.forEach((b, i) => {
      b.classList.toggle("bg-accent", i < head);
      b.classList.toggle("bg-border-dark", i >= head);
    });
    if (live && head !== lastHeadRef.current && head > 0 && head < bars.length) {
      lastHeadRef.current = head;
      const around = bars.slice(Math.max(0, head - 3), head + 2);
      gsap.to(around, {
        scaleY: () => gsap.utils.random(0.45, 1.35),
        duration: 0.16,
        ease: "sine.inOut",
        yoyo: true,
        repeat: 1,
        overwrite: true,
        stagger: 0.02,
      });
    }
  };

  const setInitial = () => {
    gsap.set(q(".sim-wave"), { opacity: 0.35 });
    gsap.set(q(".sim-bar"), { scaleY: 1 });
    lastHeadRef.current = -1;
    setWave(0, false);
    setTranscript(0);
    setTimer(0);
    gsap.set(q(".sim-arrow, .sim-draft"), { opacity: 0.35 });
    gsap.set(q(".sim-placeholder"), { autoAlpha: 1 });
    gsap.set(q(".sim-value"), { autoAlpha: 0, y: 8 });
    // upozornenie ostáva v layoute (rezervované miesto), len je neviditeľné – karta pri jeho zobrazení „nepodskočí"
    gsap.set(q(".sim-warning"), { autoAlpha: 0, scale: 0.96, boxShadow: "0 0 0 0 rgba(180,87,10,0)" });
    gsap.set(q(".sim-confirm"), { scale: 1 });
  };

  const setFinal = (length: number) => {
    gsap.set(q(".sim-wave"), { opacity: 1 });
    gsap.set(q(".sim-bar"), { scaleY: 1 });
    setWave(1, false);
    setTranscript(TRANSCRIPT.length);
    setTimer(length);
    gsap.set(q(".sim-arrow, .sim-draft"), { opacity: 1 });
    gsap.set(q(".sim-placeholder"), { autoAlpha: 0 });
    gsap.set(q(".sim-value"), { autoAlpha: 1, y: 0 });
    gsap.set(q(".sim-warning"), { autoAlpha: 1, scale: 1, boxShadow: "0 0 0 0 rgba(180,87,10,0)" });
  };

  const stop = () => {
    tlRef.current?.kill();
    tlRef.current = null;
    gsap.set(q(".sim-bar"), { scaleY: 1 });
    if (statusRef.current === "playing") setStatus("done");
  };

  /* Druhá časť: AI skladá záznam (riadky po 120 ms), upozornenie, pulz tlačidla */
  const addDraftPart = (tl: gsap.core.Timeline, t1: number) => {
    const t2 = t1 + 1.5; // upozornenie krátko po poslednom riadku
    tl.to(q(".sim-arrow, .sim-draft"), { opacity: 1, duration: 0.4 }, t1)
      .to(q(".sim-placeholder"), { autoAlpha: 0, duration: 0.15, stagger: 0.12 }, t1 + 0.2)
      .to(q(".sim-value"), { autoAlpha: 1, y: 0, duration: 0.35, ease: "power2.out", stagger: 0.12 }, t1 + 0.25)
      .to(
        q(".sim-warning"),
        { autoAlpha: 1, scale: 1, boxShadow: "0 0 0 6px rgba(180,87,10,0.22)", duration: 0.45, ease: "power2.out" },
        t2,
      )
      .to(q(".sim-warning"), { boxShadow: "0 0 0 0 rgba(180,87,10,0)", duration: 0.6 }, t2 + 0.6)
      .to(q(".sim-confirm"), { scale: 1.04, duration: 0.2, yoyo: true, repeat: 1, ease: "sine.inOut" }, t2 + 0.8)
      .to({}, { duration: 0.5 }, t2 + 1.2);
    return tl;
  };

  const { contextSafe } = useGSAP(
    () => {
      setInitial();
      const demo = scope.current?.querySelector(".sim-demo") ?? scope.current;
      // Auto-spustenie (raz), keď demo príde do viewportu
      ScrollTrigger.create({
        trigger: demo,
        start: "top 72%",
        once: true,
        onEnter: () => runRef.current?.(),
      });
    },
    { scope },
  );

  const play = contextSafe(() => {
    stop();
    setInitial();
    setStatus("playing");

    if (prefersReducedMotion()) {
      // Bez animácie – rovno finálna snímka
      setFinal(RECORDING_LENGTH);
      setStatus("done");
      return;
    }

    // Prepis 3 s, časomiera 0 → 00:14, waveform podľa priebehu, potom skladanie záznamu
    const state = { p: 0 };
    const tl = gsap.timeline({ onComplete: () => setStatus("done") });
    tl.to(q(".sim-wave"), { opacity: 1, duration: 0.3 }, 0)
      .to(q(".sim-transcript"), { text: { value: TRANSCRIPT }, duration: TYPING, ease: "none" }, 0)
      .to(
        state,
        {
          p: 1,
          duration: TYPING,
          ease: "none",
          onUpdate: () => {
            setTimer(state.p * RECORDING_LENGTH);
            setWave(state.p);
          },
          onComplete: () => gsap.set(q(".sim-bar"), { scaleY: 1 }),
        },
        0,
      );
    addDraftPart(tl, TYPING);
    tlRef.current = tl;
  });

  const runRef = useRef<(() => void) | null>(null);
  useEffect(() => {
    runRef.current = play;
  });

  const playing = status === "playing";

  return (
    <section
      aria-label="Asistovaná dokumentácia"
      className="relative overflow-hidden bg-bg-dark py-12 lg:py-32"
    >
      {/* Decor – sústredné kruhy vpravo hore (Figma AI › Decor), pomaly sa otáčajú */}
      <DecorRings
        rings={[
          { size: 720, left: "calc(50% + 320px)", top: "-160px", opacity: 0.7 },
          { size: 520, left: "calc(50% + 420px)", top: "-60px", opacity: 0.55 },
          { size: 320, left: "calc(50% + 520px)", top: "40px", opacity: 0.45 },
        ]}
        mobile={[
          { size: 320, right: "-140px", top: "-120px", opacity: 0.6 },
          { size: 220, right: "-90px", top: "-70px", opacity: 0.5 },
          { size: 130, right: "-45px", top: "-25px", opacity: 0.45 },
        ]}
      />

      <div ref={scope} className="container-page relative flex flex-col items-center gap-10 lg:gap-16">
        <div className="flex w-full max-w-[800px] flex-col items-start gap-4 text-left lg:items-center lg:gap-5 lg:text-center">
          <Eyebrow variant="dark" className="gsap-reveal">
            Asistovaná dokumentácia
          </Eyebrow>
          <h2 className="gsap-reveal text-mobile-h2 text-text-inverse lg:text-h2">
            Dokumentácia hlasom,
            <br className="hidden lg:block" /> s kontrolou sestry.
          </h2>
          <p className="gsap-reveal max-w-[680px] text-body-m text-text-inverse-muted lg:text-body-l">
            Po návšteve môže sestra nadiktovať priebeh starostlivosti. AI pripraví štruktúrovaný návrh
            záznamu a upozorní na chýbajúce údaje. Sestra výsledok skontroluje, upraví a až následne
            potvrdí.
          </p>
        </div>

        {/* Demo */}
        <div className="sim-demo gsap-reveal flex w-full flex-col items-stretch gap-4 lg:flex-row lg:items-center lg:justify-center lg:gap-6">
          {/* Nahrávka */}
          <div className="flex w-full flex-col gap-5 rounded-16 border border-border-dark bg-bg-dark-elevated p-5 sm:p-6 lg:w-[520px] lg:shrink-0">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span
                  className={cx(
                    "relative flex size-9 shrink-0 items-center justify-center rounded-full bg-status-danger text-text-inverse",
                  )}
                >
                  {playing && <span aria-hidden="true" className="absolute inset-0 animate-ping-slow rounded-full bg-status-danger/50" />}
                  <Icon name="mic" className="relative size-[18px]" />
                </span>
                <div className="flex flex-col gap-0.5">
                  <p className="text-label-m text-text-inverse">Po návšteve · nahrávanie</p>
                  <p className="text-caption text-text-inverse-muted">Ján Kováč · 08:45, 25 min</p>
                </div>
              </div>
              <p className="sim-timer text-label-m tabular-nums text-text-inverse-muted" aria-live="off">
                00:00
              </p>
            </div>

            <div className="sim-wave flex h-12 w-full items-center justify-center gap-1 overflow-hidden" aria-hidden="true">
              {WAVE.map((h, i) => (
                <span
                  key={i}
                  className="sim-bar w-1 shrink-0 origin-center rounded-[2px] bg-border-dark transition-colors duration-150"
                  style={{ height: h }}
                />
              ))}
            </div>

            <div className="flex w-full flex-col gap-1.5 rounded-12 bg-bg-dark p-4">
              <p className="text-caption text-text-inverse-muted">PREPIS</p>
              <p className="sim-transcript min-h-[calc(3*1.6em)] text-body-m text-text-inverse" aria-live="off" />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={play}
                disabled={playing}
                aria-describedby="sim-note"
                className="focus-ring inline-flex items-center gap-2 rounded-full bg-accent py-2 pl-3 pr-3.5 text-label-s text-text-inverse transition-colors hover:bg-accent-strong disabled:opacity-60"
              >
                <PlayIcon />
                {playing ? "Prehráva sa…" : status === "done" ? "Prehrať znova" : "Prehrať simuláciu"}
              </button>
              <p id="sim-note" className="text-caption text-text-inverse-muted">
                ~6 s · simulácia, nie skutočná nahrávka
              </p>
            </div>
          </div>

          {/* Šípka */}
          <div className="sim-arrow flex shrink-0 flex-col items-center gap-2 self-center" aria-hidden="true">
            <span className="flex size-12 items-center justify-center rounded-full bg-accent text-text-inverse">
              <Icon name="arrow-down" className="size-[22px] lg:hidden" />
              <Icon name="arrow-right" className="hidden size-[22px] lg:block" />
            </span>
            <p className="whitespace-nowrap text-label-s text-text-inverse-muted">AI štruktúruje</p>
          </div>

          {/* Návrh záznamu */}
          <div className="sim-draft flex w-full flex-col items-start gap-5 rounded-16 border border-border-dark bg-bg-dark-elevated p-5 sm:p-6 lg:w-[560px] lg:shrink-0">
            <div className="flex w-full items-start justify-between gap-3">
              <div className="flex flex-col gap-0.5">
                <h3 className="text-h4 text-text-inverse">Návrh záznamu</h3>
                <p className="text-caption text-text-inverse-muted">Pripravené na kontrolu sestrou</p>
              </div>
              <Badge variant="onDark">
                <span className="hidden sm:inline">Návrh · nepotvrdené</span>
                <span className="sm:hidden">Nepotvrdené</span>
              </Badge>
            </div>
            <dl className="flex w-full flex-col">
              {ROWS.map((r, i) => (
                <div
                  key={r.label}
                  className={cx(
                    "flex flex-col gap-1 py-3 sm:flex-row sm:gap-4",
                    i < ROWS.length - 1 && "border-b border-border-dark",
                  )}
                >
                  <dt className="text-label-s text-text-inverse-muted sm:w-[120px] sm:shrink-0">{r.label}</dt>
                  <dd className="relative min-w-0 flex-1 text-body-m text-text-inverse">
                    <span className="sim-placeholder absolute inset-0" aria-hidden="true">
                      —
                    </span>
                    <span className="sim-value block">{r.value}</span>
                  </dd>
                </div>
              ))}
            </dl>
            <div
              className="sim-warning flex w-full items-start gap-3 rounded-12 border border-status-warning bg-status-warning/90 px-4 py-3.5"
              role="status"
            >
              <Icon name="alert-triangle" className="mt-0.5 size-5 shrink-0 text-text-inverse" />
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <p className="text-label-m text-text-inverse">Chýba údaj: čas a dávka inzulínu</p>
                <p className="text-body-s text-text-inverse-muted">
                  V nahrávke ste spomenuli podanie inzulínu, ale nie dávku ani čas. Doplňte pred potvrdením.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3" aria-hidden="true">
              <span className="sim-confirm inline-flex items-center justify-center rounded-12 bg-text-inverse px-[18px] py-2.5 text-[14px] font-medium leading-[1.3] text-text-primary">
                Skontrolovať a potvrdiť
              </span>
              <span className="text-label-m text-text-inverse-muted">Upraviť návrh</span>
            </div>
          </div>
        </div>

        <p className="sr-only" aria-live="polite">
          {status === "done" ? "Simulácia dokončená. AI pripravila návrh záznamu a upozornila na chýbajúci údaj." : ""}
        </p>

        <div className="gsap-reveal flex w-full max-w-[1000px] flex-col gap-4 rounded-16 border border-border-dark bg-bg-dark-elevated p-5 sm:flex-row sm:items-center sm:gap-4 lg:py-5 lg:pl-6 lg:pr-7">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-bg-dark text-accent">
            <Icon name="shield-check" className="size-5" />
          </span>
          <div className="flex flex-col gap-0.5">
            <p className="max-w-[72ch] text-label-m text-text-inverse">
              Návrh, nie záznam. Potvrdzuje ho sestra.
            </p>
            <p className="max-w-[72ch] text-body-s text-text-inverse-muted">
              AI nenahrádza klinické rozhodovanie a nerozhoduje o starostlivosti. Slúži na štruktúrovanie
              toho, čo sestra povie, a na upozornenie na chýbajúce údaje.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

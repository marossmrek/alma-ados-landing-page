import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PreviewLabel } from "@/components/ui/PreviewLabel";
import { HeroMotion } from "@/components/sections/HeroMotion";

/*
  Hero visual = two Figma exports cropped exactly to the mockup (Browser · Backoffice 1040 × 705,
  Phone · Sestra 296 × 622, both 2×). Shadows and rounding are in CSS so the decor stays visible underneath.
  Percentages are relative to the 1200 × 718 frame (desktop) or the 1000 × 900 mobile composition (browser 124 % wide, slightly overflowing the edges).
*/
function Route({
  d,
  viewBox,
  stops,
  className,
}: {
  d: string;
  viewBox: string;
  stops: [number, number][];
  className: string;
}) {
  return (
    <svg
      data-hero="route"
      data-hero-decor
      viewBox={viewBox}
      className={className}
      fill="none"
      overflow="visible"
      aria-hidden="true"
    >
      <path d={d} stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeDasharray="1 10" />
      {stops.map(([x, y]) => (
        <circle key={`${x}-${y}`} className="route-stop" cx={x} cy={y} r="4" fill="var(--color-bg-page)" stroke="var(--color-accent)" strokeWidth="2" />
      ))}
    </svg>
  );
}

export function Hero() {
  return (
    <section aria-label="Úvod" className="relative overflow-hidden">
      <HeroMotion>
        {/* Decor per Figma (Hero › Decor), purely decorative */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          {/* Blobs as CSS radial gradients (no network requests), values from the Figma SVG */}
          <span
            data-hero="decor"
            data-hero-blob
            className="absolute left-[calc(50%-20px)] top-[-300px] size-[1000px] rounded-full bg-[radial-gradient(circle_at_center,rgba(15,139,141,0.16)_0%,rgba(15,139,141,0.06)_45%,rgba(15,139,141,0)_70%)]"
          />
          <span
            data-hero="decor"
            data-hero-blob
            className="absolute left-[calc(50%-1080px)] top-[380px] size-[800px] rounded-full bg-[radial-gradient(circle_at_center,rgba(15,139,141,0.12)_0%,rgba(15,139,141,0.04)_45%,rgba(15,139,141,0)_70%)]"
          />
          <Route
            viewBox="0 0 462 252"
            d="M1 1C121 1 141 121 241 121C341 121 361 251 461 251"
            stops={[
              [1, 1],
              [241, 121],
            ]}
            className="absolute right-[-30px] top-[8px] h-[120px] w-[220px] lg:left-[calc(50%+340px)] lg:right-auto lg:top-[130px] lg:h-[250px] lg:w-[460px]"
          />
          <Route
            viewBox="0 0 372 162"
            d="M1 161C101 161 121 71 211 71C291 71 301 1 371 1"
            stops={[
              [211, 71],
              [371, 1],
            ]}
            className="absolute left-[-50px] top-[58%] h-[90px] w-[210px] lg:left-[calc(50%-760px)] lg:top-[400px] lg:h-[160px] lg:w-[370px]"
          />
        </div>

        <div className="container-page relative flex flex-col items-center gap-12 pb-12 pt-12 lg:gap-16 lg:pb-24 lg:pt-24">
          <div
            data-hero="copy"
            className="flex w-full max-w-[880px] flex-col items-start gap-5 text-left lg:items-center lg:gap-6 lg:text-center"
          >
            <Badge variant="status">Vo vývoji · Plánované spustenie 2027</Badge>
            <h1 className="text-mobile-h1 text-text-primary lg:text-display">
              Dokumentácia vzniká pri pacientovi,{" "}
              <br className="hidden lg:block" />
              nie večer v kancelárii.
            </h1>
            <p className="max-w-[760px] text-body-l text-text-secondary lg:text-lead">
              Vyvíjame moderný systém pre agentúry domácej ošetrovateľskej starostlivosti, ktorý
              prepája prácu sestier v teréne s plánovaním, dokumentáciou a administratívou v kancelárii.
            </p>
            <div className="flex w-full flex-col items-stretch gap-3 pt-2 lg:w-auto lg:flex-row lg:items-center">
              <Button href="#kontakt" focusTarget="#pilot-form [name='name']" arrow>
                Chcem sa zapojiť do pilotného programu
              </Button>
              <Button href="#produkt" variant="secondary">
                Pozrieť, ako to funguje
              </Button>
            </div>
            {/* TODO: "3 – 5" is a proposal, adjust to the real capacity */}
            <p className="max-w-[640px] text-body-s text-text-tertiary">
              Hľadáme 3 až 5 ADOS, ktoré s nami produkt navrhnú a overia v praxi ešte pred spustením.
            </p>
          </div>

          <figure data-hero="visual" className="flex w-full max-w-[1200px] flex-col items-center">
            <div className="relative w-full aspect-[1000/900] sm:aspect-[1200/718]">
              <div
                data-hero="browser"
                className="absolute left-[-12%] top-0 w-[124%] max-w-none overflow-hidden rounded-[14px] bg-bg-surface shadow-[0_2px_6px_rgba(20,23,31,0.06),0_24px_48px_-12px_rgba(20,23,31,0.1)] sm:left-0 sm:w-[86.667%]"
              >
                <Image
                  src="/images/hero-browser-v2.png"
                  alt="Koncept webového prehľadu pre vedúcu sestru a administratívu: dnešné návštevy, sestry v teréne, mapa trás a upozornenia"
                  width={2080}
                  height={1410}
                  priority
                  sizes="(min-width: 1280px) 1040px, 100vw"
                  className="h-auto w-full"
                />
              </div>
              <div
                data-hero="phone-wrap"
                className="absolute left-[60%] top-[1.5%] w-[40%] sm:left-[75.333%] sm:top-[13.37%] sm:w-[24.667%]"
              >
                <div
                  data-hero="phone"
                  className="overflow-hidden rounded-[12%/5.8%] shadow-[0_32px_64px_-16px_rgba(20,23,31,0.22)]"
                >
                  <Image
                    src="/images/hero-phone.png"
                    alt="Koncept mobilnej aplikácie pre sestru: detail návštevy pacienta s plánom starostlivosti"
                    width={592}
                    height={1244}
                    sizes="(min-width: 1280px) 296px, 40vw"
                    priority
                    className="h-auto w-full"
                  />
                </div>
              </div>
              <div data-hero="label" className="absolute bottom-[1%] left-[2%] sm:bottom-[4.4%] sm:left-[1.6%]">
                <PreviewLabel>
                  <span className="sm:hidden">Koncept · ukážkové údaje</span>
                  <span className="hidden sm:inline">Koncept pripravovaného produktu · ukážkové údaje</span>
                </PreviewLabel>
              </div>
            </div>
          </figure>
        </div>
      </HeroMotion>
    </section>
  );
}

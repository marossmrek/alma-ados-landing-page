import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PreviewLabel } from "@/components/ui/PreviewLabel";
import { BrowserFrame } from "@/components/ui/Browser";
import { PhoneFrame } from "@/components/ui/Phone";
import { HeroMotion } from "@/components/sections/HeroMotion";

/*
  Hero visual = real app screenshots (demo agency) in CSS frames: web Plánovanie in BrowserFrame (1040 wide),
  nurse app in PhoneFrame (296 wide). Shadows and rounding are in CSS so the decor stays visible underneath.
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
              Čas patrí pacientom.{" "}
              <br className="hidden lg:block" />
              Nie papierom.
            </h1>
            <p className="max-w-[760px] text-body-l text-text-secondary lg:text-lead">
              Vyvíjame moderný systém pre agentúry domácej ošetrovateľskej starostlivosti, ktorý
              prepája prácu sestier v teréne s plánovaním, dokumentáciou a administratívou v kancelárii.
            </p>
            <div className="flex w-full flex-col items-stretch gap-3 pt-2 lg:w-auto lg:flex-row lg:items-center">
              <Button href="#kontakt" focusTarget="#pilot-form [name='name']" arrow>
                Zapojiť sa do pilotu
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
                className="absolute left-[-12%] top-0 w-[124%] max-w-none rounded-12 shadow-[0_2px_6px_rgba(20,23,31,0.06),0_24px_48px_-12px_rgba(20,23,31,0.1)] sm:left-0 sm:w-[86.667%]"
              >
                <BrowserFrame>
                  {/* The week continues below the fold; the crop keeps the frame at the original composition height */}
                  <div className="relative aspect-[1200/780] w-full">
                    <Image
                      src="/images/web-planning-2610.png"
                      alt="Webová aplikácia Alma ADOS, Plánovanie: týždeň návštev rozdelený podľa sestier s časmi, kódmi výkonov a menami pacientov"
                      fill
                      priority
                      sizes="(min-width: 1280px) 1040px, 124vw"
                      className="object-cover object-top"
                    />
                  </div>
                </BrowserFrame>
              </div>
              <div
                data-hero="phone-wrap"
                className="absolute left-[60%] top-[1.5%] w-[40%] sm:left-[75.333%] sm:top-[13.37%] sm:w-[24.667%]"
              >
                <div data-hero="phone">
                  <PhoneFrame>
                    <Image
                      src="/images/phone-visit-detail-2610.png"
                      alt="Aplikácia pre sestry: detail návštevy pred začatím s pacientom, plánovanými výkonmi a tlačidlom Začať návštevu"
                      fill
                      sizes="(min-width: 1280px) 280px, 40vw"
                      priority
                      className="object-cover object-top"
                    />
                  </PhoneFrame>
                </div>
              </div>
              {/* Right of the app sidebar, so the label never covers its dark background */}
              <div data-hero="label" className="absolute bottom-[1%] left-[10%] sm:bottom-[4.4%] sm:left-[16.5%]">
                <PreviewLabel />
              </div>
            </div>
          </figure>
        </div>
      </HeroMotion>
    </section>
  );
}

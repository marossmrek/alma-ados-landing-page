import { Eyebrow } from "@/components/ui/Eyebrow";
import { Icon, type IconName } from "@/components/ui/Icon";
import { DecorRings } from "@/components/ui/DecorRings";
import { CONTACT } from "@/lib/nav";
import { PilotForm } from "@/components/sections/PilotForm";

const FACTS: { icon: IconName; text: string; small?: boolean }[] = [
  {
    icon: "message-square",
    text: "Ozveme sa vám, dohodneme si krátky úvodný rozhovor a ukážeme, na čom pracujeme.",
  },
  { icon: "shield-check", text: "Rozsah spolupráce nastavíme spoločne." },
  { icon: "eye", text: "Vaše údaje použijeme len na kontaktovanie ohľadom pilotného programu." },
  {
    icon: "users",
    text: `Produkt vyvíja spoločnosť ${CONTACT.company} a na úvodnom rozhovore vám radi predstavíme tím aj plán.`,
    small: true,
  },
];

export function Kontakt() {
  return (
    <section
      id="kontakt"
      aria-label="Kontakt: pilotný program"
      className="relative overflow-hidden bg-bg-dark py-12 lg:py-32"
    >
      {/* Decor – sústredné kruhy vľavo dole (Figma Kontakt › Decor), pomaly sa otáčajú */}
      <DecorRings
        spin
        rings={[
          { size: 900, left: "-300px", top: "-200px", opacity: 0.25, dashed: true },
          { size: 560, left: "-200px", bottom: "-180px", opacity: 0.6, dashed: true },
          { size: 400, left: "-120px", bottom: "-100px", opacity: 0.45, dashed: true },
        ]}
        mobile={[
          { size: 340, left: "-170px", top: "-120px", opacity: 0.3, dashed: true },
          { size: 260, left: "-120px", bottom: "-90px", opacity: 0.55, dashed: true },
          { size: 160, left: "-60px", bottom: "-40px", opacity: 0.45, dashed: true },
        ]}
      />

      <div className="container-page relative flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-24">
        <div className="flex flex-col items-start gap-6 lg:w-[560px] lg:shrink-0 lg:gap-7">
          <Eyebrow variant="dark" className="gsap-reveal">
            Zapojte sa
          </Eyebrow>
          <h2 className="gsap-reveal text-mobile-h2 text-text-inverse lg:text-h2">
            Prevádzkujete ADOS?
            <br />
            Navrhnime systém spolu.
          </h2>
          <p className="gsap-reveal max-w-[520px] text-body-m text-text-inverse-muted lg:text-body-l">
            Hľadáme pilotných partnerov, ktorí nám pomôžu overiť pripravovaný systém na reálnych
            procesoch domácej ošetrovateľskej starostlivosti.
          </p>
          <ul className="gsap-reveal flex flex-col gap-3 pt-3">
            {FACTS.map((f) => (
              <li key={f.text} className="flex items-start gap-3">
                <Icon name={f.icon} className="mt-0.5 size-5 shrink-0 text-accent" />
                <p
                  className={
                    f.small
                      ? "max-w-[480px] text-body-s text-text-inverse-muted"
                      : "max-w-[480px] text-body-m text-text-inverse-muted"
                  }
                >
                  {f.text}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <PilotForm />
      </div>
    </section>
  );
}

import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { FaqItem } from "@/components/ui/FaqItem";

const FAQ = [
  {
    q: "Koľko času nám pilot zaberie?",
    a: "Menej, než sa zdá. V úvodnej fáze ide o jeden až dva rozhovory a občasné pozretie návrhov. Rozsah nastavíme podľa vašich možností. Nikto nebude sedieť na týždenných stretnutiach.",
  },
  {
    q: "Musíme kvôli tomu meniť naše postupy?",
    a: "Nie. Práve naopak, chceme pochopiť, ako fungujete dnes, a systém prispôsobiť praxi. Ak niečo v návrhu nedáva zmysel, chceme to počuť.",
  },
  {
    q: "Budete potrebovať údaje o našich pacientoch?",
    a: "Nie. Pracujeme s ukážkovými údajmi. Od vás potrebujeme skúsenosti z praxe a spätnú väzbu k návrhom, nie údaje o pacientoch.",
  },
  {
    q: "Koľko bude systém stáť po spustení?",
    a: "Cenu dnes nemáme stanovenú. Podmienky pre pilotných partnerov dohodneme individuálne ešte pred verejným spustením.",
  },
  {
    q: "Nahradí AI prácu sestry pri dokumentácii?",
    a: "Nie. AI pripraví návrh záznamu, sestra ho skontroluje, upraví a potvrdí. Za zdravotný záznam vždy zodpovedá zdravotnícky pracovník.",
  },
  {
    q: "Bude aplikácia fungovať aj bez signálu?",
    a: "S tým počítame od začiatku, v teréne je práca bez signálu bežná. Záznamy z návštevy sa uložia v telefóne a odošlú sa, keď je spojenie dostupné. Presné správanie offline režimu chceme doladiť s pilotnými partnermi.",
  },
  {
    q: "Bude systém napojený na poisťovne?",
    a: "V prvej verzii nie. Pripravíme skontrolované výkony do podoby, ktorú potrebujete pre vykazovanie poisťovni. Priame prepojenie s poisťovňami je plánované na neskôr a jeho podobu chceme nastaviť podľa skúseností z pilotu.",
  },
];

export function Faq() {
  return (
    <section id="faq" aria-label="Časté otázky" className="py-12 lg:py-24">
      <div className="container-page flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-20">
        <div className="flex flex-col items-start gap-4 lg:w-[400px] lg:shrink-0 lg:gap-5">
          <Eyebrow className="gsap-reveal">Časté otázky</Eyebrow>
          <h2 className="gsap-reveal text-mobile-h2 text-text-primary lg:text-h2">
            Na čo sa ADOS pýtajú najčastejšie
          </h2>
          <p className="gsap-reveal text-body-m text-text-secondary">
            Ak vám tu odpoveď chýba, napíšte nám. Radšej odpovieme úprimne „ešte nevieme“, než aby sme
            sľubovali.
          </p>
          <Button href="#kontakt" variant="secondary" size="M" arrow className="gsap-reveal">
            Opýtať sa
          </Button>
        </div>
        <ul className="gsap-reveal min-w-0 flex-1">
          {FAQ.map((item, i) => (
            <FaqItem key={item.q} question={item.q} answer={item.a} defaultOpen={i === 0} />
          ))}
        </ul>
      </div>
    </section>
  );
}

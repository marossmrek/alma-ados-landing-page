import { SectionHeader } from "@/components/ui/SectionHeader";
import { StepCard } from "@/components/ui/StepCard";
import { PlusField } from "@/components/ui/PlusField";

const STEPS = [
  {
    number: "01",
    title: "Spoznáme vaše fungovanie",
    description:
      "Ukážete nám, ako dnes plánujete návštevy, pracujete v teréne, vediete dokumentáciu a pripravujete podklady pre vykazovanie.",
  },
  {
    number: "02",
    title: "Zapojíme vás do vývoja",
    description:
      "Budeme s vami konzultovať návrhy workflow a priebežne vám ukazovať pripravovaný produkt.",
  },
  {
    number: "03",
    title: "Overíme systém v praxi",
    description:
      "Keď bude pilotná verzia pripravená, vybrané ADOS ju budú môcť vyskúšať a poskytnúť nám spätnú väzbu pred verejným spustením.",
  },
];

export function PilotKroky() {
  return (
    <section
      id="pilotny-program"
      aria-label="Pilotný program: ako to funguje"
      className="relative overflow-hidden"
    >
      <PlusField className="bottom-[-20px] right-[-30px] h-[230px] lg:bottom-auto lg:right-[-40px] lg:top-4 lg:h-[280px] xl:right-[-60px] xl:top-[60px] xl:h-[380px]" />
      <div className="container-page relative flex flex-col gap-10 pb-8 pt-12 lg:gap-16 lg:pb-24 lg:pt-32">
        <SectionHeader
          eyebrow="Pilotný program"
          title="Ako prebieha pilotná spolupráca"
          lead="Tri kroky. Konkrétny termín pilotnej verzie dohodneme s každým partnerom individuálne."
        />
        <ol className="grid gap-4 md:grid-cols-3 lg:gap-6">
          {STEPS.map((s) => (
            <li key={s.number} className="contents">
              <StepCard {...s} className="gsap-reveal" />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

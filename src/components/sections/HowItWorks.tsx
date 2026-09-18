import { SectionHeader } from "@/components/ui/SectionHeader";
import { Icon } from "@/components/ui/Icon";
import { VisitCompare } from "@/components/sections/VisitCompare";
import { FlowMotion } from "@/components/sections/FlowMotion";
import { PlusField } from "@/components/ui/PlusField";

export function HowItWorks() {
  return (
    <section id="produkt" aria-label="Ako to funguje" className="relative overflow-hidden">
      <PlusField className="bottom-[-30px] right-[-30px] h-[230px] lg:bottom-auto lg:right-[-40px] lg:top-6 lg:h-[300px] xl:right-[-60px] xl:top-20 xl:h-[420px]" />
      <div className="container-page relative flex flex-col gap-8 py-12 lg:gap-16 lg:py-32">
        <SectionHeader
          eyebrow="Ako to funguje"
          title="Od návštevy pacienta až po administratívu"
          lead="Naším cieľom je prepojiť terénnu prácu sestier s administratívou v kancelárii tak, aby informácie vznikali tam, kde sa starostlivosť reálne vykonáva, a zbytočne sa neprepisovali."
        />

        <FlowMotion>
          <VisitCompare />
        </FlowMotion>

        <div className="gsap-reveal flex w-full flex-col gap-4 rounded-16 bg-bg-muted p-6 sm:flex-row sm:items-start sm:gap-5 lg:px-8 lg:py-7">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-bg-surface text-accent-text">
            <Icon name="lightbulb" className="size-5" />
          </span>
          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
            <h3 className="text-h4 text-text-primary">Toto chceme overiť s pilotnými partnermi</h3>
            <p className="max-w-[72ch] text-body-m text-text-secondary">
              V rozhovoroch s agentúrami sa pýtame, kde dnes vznikajú opakované prepisovanie údajov,
              oneskorená dokumentácia alebo chýbajúce podklady pre vykazovanie. Ktoré z týchto miest
              riešiť ako prvé, chceme rozhodnúť spolu s pilotnými partnermi.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

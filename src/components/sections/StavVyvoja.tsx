import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { cx } from "@/lib/cx";

type Step = { title: string; meta: string; state: "done" | "current" | "todo" };

const STEPS: Step[] = [
  { title: "Návrh a dizajn", meta: "hotovo", state: "done" },
  { title: "Vývoj", meta: "2026", state: "current" },
  { title: "Pilotné overenie", meta: "2026 / 2027", state: "todo" },
  { title: "Verejné spustenie", meta: "2027", state: "todo" },
];

export function StavVyvoja() {
  return (
    <section aria-label="Stav vývoja" className="bg-accent-soft py-12 lg:py-32">
      <div className="container-page">
        <div className="gsap-reveal flex flex-col gap-10 rounded-[20px] border border-accent bg-bg-surface p-6 sm:p-10 lg:gap-14 lg:rounded-[28px] lg:p-[72px]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-20">
            <div className="flex flex-col items-start gap-5 lg:w-[520px] lg:gap-6">
              <Badge variant="planned">Pilotný program · 2026/2027</Badge>
              <h2 className="text-mobile-h2 text-text-primary lg:text-h2">
                Nechceme systém pre ADOS navrhovať od stola.
              </h2>
            </div>
            <div className="flex flex-col gap-4 text-body-m lg:w-[456px] lg:text-body-l">
              <p className="text-text-secondary">Produkt je momentálne vo fáze návrhu, vývoja a overovania.</p>
              <p className="font-medium text-text-primary">
                Nehľadáme zákazníkov pre hotový produkt. Hľadáme partnerov, ktorí nám pomôžu vytvoriť
                produkt, ktorý bude dávať zmysel v každodennej praxi.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4 rounded-16 border border-border-default bg-bg-page p-5 lg:p-7">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-label-m text-text-primary">Kde sme dnes</h3>
              {/* Dátum meniť pri každej aktualizácii roadmapy */}
              <p className="text-caption text-text-tertiary">Naposledy aktualizované: 17. 9. 2026</p>
            </div>
            <ol className="relative flex flex-col gap-6 sm:grid sm:grid-cols-4 sm:gap-4">
              {/* Linka + progress (desktop) */}
              <span
                aria-hidden="true"
                className="absolute left-[30px] right-[30px] top-[13px] hidden h-0.5 bg-border-default sm:block"
              />
              <span
                aria-hidden="true"
                data-fx="line"
                className="absolute left-[30px] top-[13px] hidden h-0.5 w-[calc(25%+4px)] bg-accent sm:block"
              />
              {STEPS.map((s, i) => (
                <li key={s.title} className="relative flex items-start gap-3 sm:flex-col sm:gap-2.5">
                  {/* Zvislá spojka medzi bodmi (mobil) – accent po aktuálny krok */}
                  {i < STEPS.length - 1 && (
                    <span
                      aria-hidden="true"
                      className={cx(
                        "absolute -bottom-6 left-[13px] top-7 w-0.5 rounded-full sm:hidden",
                        s.state === "done" ? "bg-accent" : "bg-border-default",
                      )}
                    />
                  )}
                  <span className="flex size-7 shrink-0 items-center justify-center">
                    {s.state === "done" && (
                      <span className="flex size-5 items-center justify-center rounded-full bg-status-success text-text-inverse">
                        <Icon name="check" className="size-3" strokeWidth={2.5} />
                      </span>
                    )}
                    {s.state === "current" && (
                      <span className="relative flex size-7 items-center justify-center rounded-full bg-accent/20">
                        <span aria-hidden="true" className="absolute inset-0 animate-ping-slow rounded-full bg-accent/40" />
                        <span className="relative block size-4 rounded-full border-[3px] border-bg-surface bg-accent shadow-[0_0_0_2px_var(--color-accent)]" />
                      </span>
                    )}
                    {s.state === "todo" && (
                      <span className="block size-5 rounded-full border-2 border-border-default bg-bg-surface" />
                    )}
                  </span>
                  <div className="flex flex-col gap-1 sm:gap-2.5">
                    <p className={cx("text-label-m", s.state === "todo" ? "text-text-secondary" : "text-text-primary")}>
                      {s.title}
                      {s.state === "done" && <span className="sr-only">, dokončené</span>}
                      {s.state === "current" && <span className="sr-only">, aktuálna fáza</span>}
                    </p>
                    <p className="text-caption text-text-tertiary">{s.meta}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

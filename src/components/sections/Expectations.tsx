import { CheckItem } from "@/components/ui/CheckItem";

const NEED = [
  "Praktickú spätnú väzbu k návrhom workflow a obrazoviek",
  "Občasné konzultácie v rozsahu, na ktorom sa dohodneme",
  "Vysvetlenie, ako dnes reálne prebieha plánovanie, dokumentácia a vykazovanie",
  "Otestovanie vybraných verzií produktu, keď budú pripravené",
];

const GAIN = [
  "Priamy vplyv na to, ako bude produkt fungovať",
  "Skorý prístup k prototypom a pilotným verziám",
  "Možnosť navrhovať zlepšenia podľa vlastnej praxe",
  "Priamu komunikáciu s tímom, ktorý produkt vyvíja",
];

export function Expectations() {
  return (
    <section aria-label="Pilotný program: očakávania" className="pb-12 pt-4 lg:pb-32 lg:pt-8">
      <div className="container-page grid gap-4 lg:grid-cols-2 lg:gap-6">
        <div className="gsap-reveal flex flex-col gap-6 rounded-[20px] border border-border-default bg-bg-surface p-6 sm:p-8 lg:gap-7 lg:p-10">
          <div className="flex flex-col gap-2">
            <h2 className="text-h3 text-text-primary">Čo od pilotného partnera potrebujeme</h2>
            <p className="text-body-m text-text-secondary">
              Nie plný úväzok, skôr ochotu občas sa pozrieť na to, čo pripravujeme, a povedať nám, kde
              to nesedí s praxou.
            </p>
          </div>
          <ul className="flex flex-col gap-3.5">
            {NEED.map((t) => (
              <CheckItem key={t}>{t}</CheckItem>
            ))}
          </ul>
        </div>
        <div className="gsap-reveal flex flex-col gap-6 rounded-[20px] border border-border-dark bg-bg-dark p-6 sm:p-8 lg:gap-7 lg:p-10">
          <div className="flex flex-col gap-2">
            <h2 className="text-h3 text-text-inverse">Čo pilotný partner získa</h2>
            <p className="text-body-m text-text-inverse-muted">
              Podmienky spolupráce po spustení dohodneme individuálne.
            </p>
          </div>
          <ul className="flex flex-col gap-3.5">
            {GAIN.map((t) => (
              <CheckItem key={t} variant="dark">
                {t}
              </CheckItem>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

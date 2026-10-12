import Image from "next/image";
import { cx } from "@/lib/cx";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { BrowserFrame } from "@/components/ui/Browser";
import { Badge } from "@/components/ui/Badge";
import { CheckItem } from "@/components/ui/CheckItem";
import { Icon, type IconName } from "@/components/ui/Icon";

/* More parts of the web app (today overview, planning, AI patient intake, statistics) and a note on migration. Continues "V kancelárii". */
const TOOLS: {
  title: string;
  text: string;
  points: string[];
  note?: { icon: IconName; text: string };
  screen: string;
  /* Pixel height at 2400 px width (the Dnes capture is a full wide screen, the others 1440 px) */
  height?: number;
  /* Wide screenshot: full container width with the text below, otherwise it would be too small to read */
  wide?: boolean;
  alt: string;
}[] = [
  {
    title: "Prehľad dňa",
    text: "Modul Dnes ukáže kancelárii stav dňa na jednej obrazovke: koľko návštev je naplánovaných, čo čaká na schválenie a čo treba vyriešiť.",
    points: [
      "Návštevy dnes, na schválenie a vrátené sestrám",
      "Postup každej sestry a jej posledné spojenie",
      "Mapa, kde sú sestry podľa poslednej návštevy",
      "Upozornenia, ktoré treba vyriešiť",
    ],
    screen: "/images/web-dnes-2610.png",
    height: 1099,
    wide: true,
    alt: "Webová aplikácia, Dnes: počty návštev, schválení a upozornení, sestry dnes s postupom a spojením a mapa sestier",
  },
  {
    title: "Plánovanie návštev",
    text: "Týždeň návštev všetkých sestier na jednom mieste. Návštevy sa dajú naplánovať ručne alebo nechať navrhnúť podľa plánu starostlivosti.",
    points: [
      "Pohľad na týždeň alebo deň, pre všetky sestry alebo jednu",
      "Návrh týždňa podľa plánu starostlivosti",
      "Neprítomnosť sestry a zastupovanie",
      "Návštevy na preplánovanie na jednom mieste",
    ],
    screen: "/images/web-planning-2610.png",
    alt: "Webová aplikácia, Plánovanie: týždeň návštev rozdelený podľa sestier s tlačidlami Navrhnúť týždeň podľa plánu a Pridať neprítomnosť",
  },
  {
    title: "Nový pacient z dokumentu",
    text: "Administrátor nahrá alebo mobilom odfotí návrh lekára (indikáciu), prepúšťaciu správu alebo kartičku poistenca. AI z dokumentov predvyplní údaje nového pacienta.",
    points: [
      "Osobné údaje a poisťovňa",
      "Ošetrujúci lekár, platnosť indikácie a diagnózy",
      "Výkony ako návrh plánu starostlivosti",
      "Nič sa neuloží, kým to administrátor neskontroluje",
    ],
    note: { icon: "shield-check", text: "Dokumenty spracúva AI v EÚ a nepoužívajú sa na trénovanie." },
    screen: "/images/web-intake-2610.png",
    alt: "Webová aplikácia, Nový pacient z dokumentu: nahratie dokumentov pacienta a zoznam údajov, ktoré AI predvyplní",
  },
  {
    title: "Štatistiky",
    text: "Prehľad o práci agentúry za mesiac, štvrťrok alebo rok, s porovnaním s predchádzajúcim obdobím.",
    points: [
      "Vykonané návštevy oproti plánu",
      "Čas strávený u pacientov",
      "Ošetrení pacienti a vykázané výkony",
      "Dôvody nevykonaných návštev",
    ],
    screen: "/images/web-stats-overview-2610.png",
    alt: "Webová aplikácia, Štatistiky za september: vykonané návštevy, čas u pacientov, ošetrení pacienti, vykázané výkony a plnenie plánu",
  },
];

export function OfficeTools() {
  return (
    <section aria-label="Prehľad dňa, plánovanie, nový pacient a štatistiky" className="pb-12 lg:pb-32">
      <div className="container-page flex flex-col gap-10 lg:gap-16">
        <SectionHeader
          eyebrow="Administratíva"
          title="Prehľad dňa, plán návštev, nový pacient a štatistiky."
          lead="Ďalšie časti webovej aplikácie, ktoré dnes testujeme a dolaďujeme: prehľad dňa, plánovanie návštev, príjem nového pacienta z dokumentu a štatistiky agentúry."
        />

        <div className="flex flex-col gap-12 lg:gap-20">
          {TOOLS.map((t) => {
            const shot = (
              <BrowserFrame className="shadow-[0_24px_48px_-12px_rgba(20,23,31,0.14)]">
                <Image
                  src={t.screen}
                  alt={t.alt}
                  width={2400}
                  height={t.height ?? 1633}
                  sizes={
                    t.wide
                      ? "(min-width: 1280px) 1200px, 100vw"
                      : "(min-width: 1280px) 680px, (min-width: 1024px) 56vw, 100vw"
                  }
                  className="h-auto w-full"
                />
              </BrowserFrame>
            );
            const intro = (
              <>
                <Badge variant="status" className="gsap-reveal">
                  Vo vývoji
                </Badge>
                <h3 className="gsap-reveal text-h3 text-text-primary">{t.title}</h3>
                <p className="gsap-reveal text-body-m text-text-secondary lg:text-body-l">{t.text}</p>
              </>
            );
            const points = (
              <ul className="gsap-reveal flex flex-col gap-3">
                {t.points.map((p) => (
                  <CheckItem key={p}>{p}</CheckItem>
                ))}
              </ul>
            );
            const note = t.note && (
              <p className="gsap-reveal flex items-start gap-2.5 text-body-s text-text-secondary">
                <Icon name={t.note.icon} className="mt-0.5 size-4 shrink-0 text-accent-text" />
                {t.note.text}
              </p>
            );

            if (t.wide) {
              return (
                <article key={t.title} className="flex flex-col gap-6 lg:gap-10">
                  <div className="gsap-reveal">{shot}</div>
                  <div className="grid gap-4 lg:grid-cols-2 lg:items-end lg:gap-14">
                    <div className="flex flex-col items-start gap-4 lg:gap-5">
                      {intro}
                      {note}
                    </div>
                    {points}
                  </div>
                </article>
              );
            }
            // Side by side rows alternate the screenshot left and right
            const flip = TOOLS.filter((x) => !x.wide).indexOf(t) % 2 === 1;
            return (
              <article
                key={t.title}
                className="grid items-center gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-14"
              >
                <div className={cx("gsap-reveal", flip && "lg:order-2")}>{shot}</div>
                <div className="flex flex-col items-start gap-4 lg:gap-5">
                  {intro}
                  {points}
                  {note}
                </div>
              </article>
            );
          })}
        </div>

        <div className="gsap-reveal flex w-full flex-col gap-4 rounded-16 bg-bg-muted p-6 sm:flex-row sm:items-start sm:gap-5 lg:px-8 lg:py-7">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-bg-surface text-accent-text">
            <Icon name="upload" className="size-5" />
          </span>
          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
            <h3 className="text-h4 text-text-primary">Prechod z doterajšieho systému</h3>
            <p className="max-w-[72ch] text-body-m text-text-secondary">
              Sme pripravení preniesť pacientov vašej agentúry zo systému, ktorý používate dnes, aby ste
              nezačínali od nuly.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

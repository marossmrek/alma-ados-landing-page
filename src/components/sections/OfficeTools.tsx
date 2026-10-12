import Image from "next/image";
import { cx } from "@/lib/cx";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { BrowserFrame } from "@/components/ui/Browser";
import { Badge } from "@/components/ui/Badge";
import { CheckItem } from "@/components/ui/CheckItem";
import { Icon, type IconName } from "@/components/ui/Icon";

/* Two more parts of the web app (AI patient intake, statistics) and a note on migration. Continues "V kancelárii". */
const TOOLS: {
  title: string;
  text: string;
  points: string[];
  note?: { icon: IconName; text: string };
  screen: string;
  alt: string;
}[] = [
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
    <section aria-label="Nový pacient z dokumentu a štatistiky" className="pb-12 lg:pb-32">
      <div className="container-page flex flex-col gap-10 lg:gap-16">
        <SectionHeader
          eyebrow="Administratíva"
          title="Nový pacient bez prepisovania. Prehľad o celej agentúre."
          lead="Ďalšie časti webovej aplikácie, ktoré dnes testujeme a dolaďujeme: príjem nového pacienta z dokumentu a štatistiky agentúry."
        />

        <div className="flex flex-col gap-12 lg:gap-20">
          {TOOLS.map((t, i) => (
            <article
              key={t.title}
              className="grid items-center gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-14"
            >
              <div className={cx("gsap-reveal", i % 2 === 1 && "lg:order-2")}>
                <BrowserFrame className="shadow-[0_24px_48px_-12px_rgba(20,23,31,0.14)]">
                  <Image
                    src={t.screen}
                    alt={t.alt}
                    width={2400}
                    height={1633}
                    sizes="(min-width: 1280px) 680px, (min-width: 1024px) 56vw, 100vw"
                    className="h-auto w-full"
                  />
                </BrowserFrame>
              </div>
              <div className="flex flex-col items-start gap-4 lg:gap-5">
                <Badge variant="status" className="gsap-reveal">
                  Vo vývoji
                </Badge>
                <h3 className="gsap-reveal text-h3 text-text-primary">{t.title}</h3>
                <p className="gsap-reveal text-body-m text-text-secondary lg:text-body-l">{t.text}</p>
                <ul className="gsap-reveal flex flex-col gap-3">
                  {t.points.map((p) => (
                    <CheckItem key={p}>{p}</CheckItem>
                  ))}
                </ul>
                {t.note && (
                  <p className="gsap-reveal flex items-start gap-2.5 text-body-s text-text-secondary">
                    <Icon name={t.note.icon} className="mt-0.5 size-4 shrink-0 text-accent-text" />
                    {t.note.text}
                  </p>
                )}
              </div>
            </article>
          ))}
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

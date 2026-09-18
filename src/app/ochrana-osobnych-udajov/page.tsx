import type { Metadata } from "next";
import { Nav } from "@/components/sections/Nav";
import { Footer } from "@/components/sections/Footer";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { CONTACT } from "@/lib/nav";

export const metadata: Metadata = {
  title: "Ochrana osobných údajov | Alma ADOS",
  description: "Zásady ochrany osobných údajov pre záujemcov o pilotný program Alma ADOS.",
  robots: { index: false },
};

const H2 = "text-h4 text-text-primary pt-4";
const P = "text-body-m text-text-secondary";
const UL = "flex list-disc flex-col gap-1.5 pl-5 text-body-m text-text-secondary";

export default function OchranaOsobnychUdajovPage() {
  return (
    <>
      <Nav />
      <main className="flex flex-1 flex-col">
        <section aria-label="Ochrana osobných údajov" className="py-12 lg:py-24">
          <div className="container-page flex max-w-[760px] flex-col gap-4">
            <Eyebrow>Právne</Eyebrow>
            <h1 className="text-mobile-h2 text-text-primary lg:text-h2">Zásady ochrany osobných údajov</h1>
            <p className="text-body-l text-text-secondary">
              Tieto zásady vysvetľujú, aké osobné údaje spracúvame na webe Alma ADOS, prečo a aké
              máte práva. Web slúži na predstavenie pripravovaného produktu a na prihlásenie sa do
              pilotného programu.
            </p>
            {/* TODO: add the company registration number (IČO) and registered office */}
            <p className="text-body-s text-text-tertiary">
              Prevádzkovateľ: {CONTACT.company} · {CONTACT.email} · {CONTACT.phone} · Naposledy
              aktualizované 17. 9. 2026
            </p>

            <h2 className={H2}>1. Kto je prevádzkovateľ</h2>
            <p className={P}>
              Prevádzkovateľom osobných údajov je spoločnosť {CONTACT.company} (ďalej „my“). V otázkach
              ochrany osobných údajov nás kontaktujte na {CONTACT.email} alebo {CONTACT.phone}.
            </p>

            <h2 className={H2}>2. Aké údaje spracúvame</h2>
            <p className={P}>Len tie, ktoré nám sami zadáte vo formulári záujmu o pilotný program:</p>
            <ul className={UL}>
              <li>meno a priezvisko,</li>
              <li>názov agentúry domácej ošetrovateľskej starostlivosti (ADOS),</li>
              <li>e-mailová adresa a telefónne číslo,</li>
              <li>odhad počtu sestier a nepovinná správa o tom, čo vám pri práci zaberá najviac času.</li>
            </ul>
            <p className={P}>
              Vo formulári nezadávajte údaje o pacientoch ani iné osobitné kategórie osobných údajov.
              V úvodnej fáze pilotného programu pracujeme výlučne s ukážkovými údajmi.
            </p>

            <h2 className={H2}>3. Účel a právny základ</h2>
            <p className={P}>
              Údaje používame výhradne na to, aby sme vás kontaktovali ohľadom pilotného programu,
              dohodli úvodný rozhovor a prípadnú spoluprácu. Právnym základom je váš súhlas podľa
              čl. 6 ods. 1 písm. a) nariadenia GDPR, ktorý udeľujete zaškrtnutím políčka pri
              odoslaní formulára. Súhlas môžete kedykoľvek odvolať e-mailom; odvolanie nemá vplyv na
              zákonnosť spracúvania pred jeho odvolaním.
            </p>

            <h2 className={H2}>4. Ako dlho údaje uchovávame</h2>
            <p className={P}>
              Údaje uchovávame počas trvania komunikácie o pilotnom programe, najdlhšie 24 mesiacov od
              odoslania formulára, alebo do odvolania súhlasu, podľa toho, čo nastane skôr. Potom ich
              vymažeme.
            </p>

            <h2 className={H2}>5. Kto má k údajom prístup</h2>
            <p className={P}>
              Údaje z formulára prichádzajú e-mailom členom nášho tímu, ktorí pilotný program
              pripravujú. Na technické zabezpečenie používame poskytovateľa hostingu webu a
              poskytovateľa e-mailovej služby, ktorí spracúvajú údaje v našom mene ako
              sprostredkovatelia. Údaje nepredávame ani neposkytujeme tretím stranám na marketingové
              účely a neprenášame ich mimo Európskeho hospodárskeho priestoru bez primeraných záruk.
            </p>

            <h2 className={H2}>6. Cookies a analytika</h2>
            <p className={P}>
              Web nepoužíva analytické ani marketingové cookies a nesleduje vaše správanie. Používajú
              sa len technicky nevyhnutné súbory potrebné na fungovanie stránky.
            </p>

            <h2 className={H2}>7. Vaše práva</h2>
            <p className={P}>Podľa GDPR máte právo:</p>
            <ul className={UL}>
              <li>na prístup k svojim údajom a na informácie o ich spracúvaní,</li>
              <li>na opravu nepresných alebo doplnenie neúplných údajov,</li>
              <li>na vymazanie údajov („právo na zabudnutie“),</li>
              <li>na obmedzenie spracúvania a na prenosnosť údajov,</li>
              <li>namietať proti spracúvaniu a kedykoľvek odvolať súhlas,</li>
              <li>
                podať sťažnosť dozornému orgánu, ktorým je Úrad na ochranu osobných údajov Slovenskej
                republiky, Hraničná 12, 820 07 Bratislava, www.dataprotection.gov.sk.
              </li>
            </ul>
            <p className={P}>
              Svoje práva si uplatníte e-mailom na {CONTACT.email}. Odpovieme najneskôr do jedného
              mesiaca od doručenia žiadosti.
            </p>

            <h2 className={H2}>8. Zabezpečenie</h2>
            <p className={P}>
              Prenos údajov z formulára je šifrovaný (HTTPS). Prístup k prijatým údajom majú len
              oprávnené osoby a údaje uchovávame len v rozsahu a čase nevyhnutnom na uvedený účel.
            </p>

            <h2 className={H2}>9. Zmeny zásad</h2>
            <p className={P}>
              Zásady môžeme aktualizovať, napríklad pri spustení pilotnej prevádzky. Aktuálna verzia
              je vždy zverejnená na tejto stránke spolu s dátumom poslednej aktualizácie.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { AnchorLink } from "@/components/ui/AnchorLink";
import { CONTACT, NAV_LINKS } from "@/lib/nav";
import { cx } from "@/lib/cx";

const linkCls =
  "focus-ring inline-block rounded-[4px] text-body-s text-text-inverse-muted transition-colors hover:text-text-inverse";

export function Footer() {
  return (
    <footer className="border-t border-border-dark bg-bg-dark" aria-label="Päta stránky">
      <div className="container-page flex flex-col gap-8 pb-10 pt-12">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex max-w-[360px] flex-col gap-3">
            <Logo size="S" onDark />
            <p className="text-body-s text-text-inverse-muted">
              Systém pre agentúry domácej ošetrovateľskej starostlivosti. Vo vývoji, plánované
              spustenie 2027.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:flex lg:gap-20">
            <div className="flex flex-col gap-3">
              <p className="text-label-s text-text-inverse">Produkt</p>
              {NAV_LINKS.map((l) => (
                <AnchorLink key={l.href} href={l.href} className={linkCls}>
                  {l.label}
                </AnchorLink>
              ))}
            </div>
            <div className="col-span-2 flex flex-col gap-3 sm:col-span-1">
              <p className="text-label-s text-text-inverse">Kontakt</p>
              <a href={`mailto:${CONTACT.email}`} className={cx(linkCls, "break-all")}>
                {CONTACT.email}
              </a>
              <a href={CONTACT.phoneHref} className={linkCls}>
                {CONTACT.phone}
              </a>
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-label-s text-text-inverse">Právne</p>
              <Link href="/ochrana-osobnych-udajov" className={linkCls}>
                Ochrana osobných údajov
              </Link>
            </div>
          </div>
        </div>
        <div className="flex flex-col-reverse gap-2 border-t border-border-dark pt-6 text-caption text-text-tertiary-on-dark lg:flex-row lg:items-center lg:justify-between">
          <p>© 2026 {CONTACT.company} Všetky práva vyhradené.</p>
          <p>Produkt je vo fáze vývoja. Zobrazené obrazovky sú koncepty, nie hotová aplikácia.</p>
        </div>
      </div>
    </footer>
  );
}

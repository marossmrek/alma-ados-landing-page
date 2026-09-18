"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { SegmentedGroup } from "@/components/ui/SegmentedOption";
import { Checkbox } from "@/components/ui/Checkbox";
import { FormTimestamp } from "@/components/ui/FormTimestamp";
import { submitPilotForm } from "@/app/actions";
import { PREFILL_EVENT } from "@/components/sections/Kalkulacka";

type Field = "meno" | "ados" | "email" | "telefon" | "pocet-sestier" | "suhlas";
type Errors = Partial<Record<Field, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[+\d][\d\s()/-]{5,24}$/;

/* Rovnaké pravidlá ako na serveri (lib/antispam.ts), len s textami pre ľudí */
function validate(fd: FormData): Errors {
  const errors: Errors = {};
  const meno = String(fd.get("meno") ?? "").trim();
  const ados = String(fd.get("ados") ?? "").trim();
  const email = String(fd.get("email") ?? "").trim();
  const telefon = String(fd.get("telefon") ?? "").trim();
  if (meno.length < 2) errors.meno = "Zadajte meno a priezvisko.";
  if (ados.length < 2) errors.ados = "Zadajte názov vašej ADOS.";
  if (!EMAIL_RE.test(email)) errors.email = "Zadajte platný e-mail, napríklad meno@ados.sk.";
  if (telefon && !PHONE_RE.test(telefon)) errors.telefon = "Telefón môže obsahovať len číslice, medzery a znak +.";
  if (!fd.get("pocet-sestier")) errors["pocet-sestier"] = "Vyberte približný počet sestier.";
  if (fd.get("suhlas") !== "on") errors.suhlas = "Bez súhlasu vás nemôžeme kontaktovať.";
  return errors;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" arrow={!pending} disabled={pending} aria-disabled={pending} className="w-full">
      {pending ? "Odosielam…" : "Mám záujem o pilotnú spoluprácu"}
    </Button>
  );
}

export function PilotForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [summary, setSummary] = useState("");

  // Kalkulačka pošle odhad počtu sestier; pole je nekontrolované, preto ho nastavíme priamo
  useEffect(() => {
    const onPrefill = (e: Event) => {
      const value = (e as CustomEvent<string>).detail;
      const input = formRef.current?.querySelector<HTMLInputElement>(`input[name="pocet-sestier"][value="${value}"]`);
      if (!input || input.checked) return;
      input.checked = true;
      setErrors((err) => {
        if (!err["pocet-sestier"]) return err;
        const next = { ...err };
        delete next["pocet-sestier"];
        return next;
      });
    };
    window.addEventListener(PREFILL_EVENT, onPrefill);
    return () => window.removeEventListener(PREFILL_EVENT, onPrefill);
  }, []);

  const clear = (field: Field) => {
    if (!errors[field]) return;
    setErrors((e) => {
      const next = { ...e };
      delete next[field];
      return next;
    });
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    const form = e.currentTarget;
    const found = validate(new FormData(form));
    setErrors(found);
    const keys = Object.keys(found) as Field[];
    if (keys.length === 0) {
      setSummary("");
      return; // server action beží
    }
    e.preventDefault();
    const n = keys.length;
    const polia = n === 1 ? "jedno pole" : n < 5 ? `${n} polia` : `${n} polí`;
    setSummary(`Skontrolujte, prosím, ${polia}.`);
    const first = form.querySelector<HTMLElement>(`[name="${keys[0]}"]`);
    first?.focus();
    first?.scrollIntoView({ block: "center", behavior: "smooth" });
  };

  return (
    <form
      ref={formRef}
      id="pilot-form"
      action={submitPilotForm}
      noValidate
      onSubmit={onSubmit}
      aria-labelledby="pilot-form-title"
      className="gsap-reveal relative flex w-full max-w-[544px] flex-col gap-5 rounded-[20px] bg-bg-surface p-6 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.25)] sm:p-8 lg:rounded-[24px] lg:p-10"
    >
      {/* Honeypot proti spamu – ľudia ho nevidia */}
      <div className="absolute -left-[9999px] top-0 h-px w-px overflow-hidden" aria-hidden="true">
        <label>
          Web
          <input type="text" name="web" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <FormTimestamp />

      <div className="flex flex-col gap-1.5">
        <h3 id="pilot-form-title" className="text-h4 text-text-primary">
          Napíšte nám o svojej ADOS
        </h3>
        <p className="text-body-s text-text-secondary">
          Vyplnenie trvá minútu. Odpovieme spravidla do niekoľkých pracovných dní.
        </p>
      </div>

      <p className="sr-only" aria-live="assertive">
        {summary}
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Meno a priezvisko"
          name="meno"
          autoComplete="name"
          placeholder="Mária Kováčová"
          required
          error={errors.meno}
          onChange={() => clear("meno")}
        />
        <Input
          label="Názov ADOS"
          name="ados"
          autoComplete="organization"
          placeholder="ADOS Starostlivosť, s.r.o."
          required
          error={errors.ados}
          onChange={() => clear("ados")}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="E-mail"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="meno@ados.sk"
          required
          error={errors.email}
          onChange={() => clear("email")}
        />
        <Input
          label="Telefón"
          name="telefon"
          type="tel"
          autoComplete="tel"
          placeholder="+421 9xx xxx xxx"
          error={errors.telefon}
          onChange={() => clear("telefon")}
        />
      </div>

      <SegmentedGroup
        label="Počet sestier"
        name="pocet-sestier"
        required
        help="Stačí odhad."
        error={errors["pocet-sestier"]}
        onChange={() => clear("pocet-sestier")}
        options={[
          { value: "1-3", label: "1 až 3" },
          { value: "4-8", label: "4 až 8" },
          { value: "9+", label: "9 a viac" },
        ]}
      />

      <Textarea
        label="Čo vám dnes pri práci zaberá najviac času? (nepovinné)"
        name="sprava"
        placeholder="Napr. prepisovanie dokumentácie, príprava podkladov pre poisťovne, plánovanie trás…"
      />

      {/* TODO: finálne znenie súhlasu potvrdí právnik */}
      <Checkbox
        name="suhlas"
        required
        error={errors.suhlas}
        onChange={() => clear("suhlas")}
        label={
          <>
            Súhlasím so spracovaním osobných údajov na účely kontaktovania ohľadom pilotného programu.
            Viac v{" "}
            <Link
              href="/ochrana-osobnych-udajov"
              target="_blank"
              className="focus-ring rounded-[3px] text-accent-text underline underline-offset-2 hover:text-accent-strong"
            >
              zásadách ochrany osobných údajov
            </Link>
            .
          </>
        }
      />

      <SubmitButton />
      <p className="text-center text-caption text-text-tertiary">
        Odoslaním formulára nevzniká žiadny záväzok. Ide o vyjadrenie záujmu o rozhovor.
      </p>
    </form>
  );
}

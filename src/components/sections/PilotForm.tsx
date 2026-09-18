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
import { PREFILL_EVENT } from "@/components/sections/Calculator";

type Field = "name" | "agency" | "email" | "phone" | "nurse-count" | "consent";
type Errors = Partial<Record<Field, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[+\d][\d\s()/-]{5,24}$/;

/* Same rules as on the server (lib/antispam.ts), just with human-readable messages */
function validate(fd: FormData): Errors {
  const errors: Errors = {};
  const name = String(fd.get("name") ?? "").trim();
  const agency = String(fd.get("agency") ?? "").trim();
  const email = String(fd.get("email") ?? "").trim();
  const phone = String(fd.get("phone") ?? "").trim();
  if (name.length < 2) errors.name = "Zadajte meno a priezvisko.";
  if (agency.length < 2) errors.agency = "Zadajte názov vašej ADOS.";
  if (!EMAIL_RE.test(email)) errors.email = "Zadajte platný e-mail, napríklad meno@ados.sk.";
  if (phone && !PHONE_RE.test(phone)) errors.phone = "Telefón môže obsahovať len číslice, medzery a znak +.";
  if (!fd.get("nurse-count")) errors["nurse-count"] = "Vyberte približný počet sestier.";
  if (fd.get("consent") !== "on") errors.consent = "Bez súhlasu vás nemôžeme kontaktovať.";
  return errors;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      arrow={!pending}
      disabled={pending}
      aria-disabled={pending}
      className="w-full whitespace-normal text-center"
    >
      {pending ? "Odosielam…" : "Mám záujem o pilot"}
    </Button>
  );
}

export function PilotForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [summary, setSummary] = useState("");

  // The calculator sends the estimated nurse count; the field is uncontrolled, so set it directly
  useEffect(() => {
    const onPrefill = (e: Event) => {
      const value = (e as CustomEvent<string>).detail;
      const input = formRef.current?.querySelector<HTMLInputElement>(`input[name="nurse-count"][value="${value}"]`);
      if (!input || input.checked) return;
      input.checked = true;
      setErrors((err) => {
        if (!err["nurse-count"]) return err;
        const next = { ...err };
        delete next["nurse-count"];
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
      return; // server action runs
    }
    e.preventDefault();
    const n = keys.length;
    const fieldsLabel = n === 1 ? "jedno pole" : n < 5 ? `${n} polia` : `${n} polí`;
    setSummary(`Skontrolujte, prosím, ${fieldsLabel}.`);
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
      className="gsap-reveal relative flex w-full max-w-[544px] flex-col gap-5 rounded-[20px] bg-bg-surface p-5 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.25)] sm:p-8 lg:rounded-[24px] lg:p-10"
    >
      {/* Anti-spam honeypot, invisible to humans */}
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
          name="name"
          autoComplete="name"
          placeholder="Mária Kováčová"
          required
          error={errors.name}
          onChange={() => clear("name")}
        />
        <Input
          label="Názov ADOS"
          name="agency"
          autoComplete="organization"
          placeholder="ADOS Starostlivosť, s.r.o."
          required
          error={errors.agency}
          onChange={() => clear("agency")}
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
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="+421 9xx xxx xxx"
          error={errors.phone}
          onChange={() => clear("phone")}
        />
      </div>

      <SegmentedGroup
        label="Počet sestier"
        name="nurse-count"
        required
        help="Stačí odhad."
        error={errors["nurse-count"]}
        onChange={() => clear("nurse-count")}
        options={[
          { value: "1-3", label: "1 až 3" },
          { value: "4-8", label: "4 až 8" },
          { value: "9+", label: "9 a viac" },
        ]}
      />

      <Textarea
        label="Čo vám dnes pri práci zaberá najviac času? (nepovinné)"
        name="message"
        placeholder="Napr. prepisovanie dokumentácie, príprava podkladov pre poisťovne, plánovanie trás…"
      />

      {/* TODO: final consent wording to be confirmed by a lawyer */}
      <Checkbox
        name="consent"
        required
        error={errors.consent}
        onChange={() => clear("consent")}
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

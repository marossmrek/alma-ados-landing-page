import nodemailer from "nodemailer";
import { CONTACT } from "@/lib/nav";

export type PilotRequest = {
  meno: string;
  ados: string;
  email: string;
  telefon: string;
  pocetSestier: string;
  sprava: string;
};

/*
  Odoslanie e-mailu cez SMTP (nodemailer). Nastavenie v .env.local – pozri .env.example.
  Pre Gmail: SMTP_HOST=smtp.gmail.com, SMTP_PORT=587, SMTP_USER=…@gmail.com, SMTP_PASS=heslo aplikácie.
*/
function createTransport() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;
  const port = Number(SMTP_PORT ?? 587);
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
}

const POCET: Record<string, string> = { "1-3": "1 až 3", "4-8": "4 až 8", "9+": "9 a viac" };

export async function sendPilotRequest(p: PilotRequest): Promise<{ sent: boolean }> {
  const transport = createTransport();
  const to = process.env.CONTACT_TO ?? CONTACT.email;
  const from = process.env.CONTACT_FROM ?? process.env.SMTP_USER ?? CONTACT.email;

  const lines = [
    `Meno a priezvisko: ${p.meno}`,
    `Názov ADOS: ${p.ados}`,
    `E-mail: ${p.email}`,
    `Telefón: ${p.telefon || "neuvedený"}`,
    `Počet sestier: ${POCET[p.pocetSestier] ?? p.pocetSestier}`,
    "",
    "Čo zaberá najviac času:",
    p.sprava || "(bez správy)",
  ];

  if (!transport) {
    console.warn("[mail] SMTP nie je nakonfigurované (.env.local) – e-mail sa neodoslal.\n" + lines.join("\n"));
    return { sent: false };
  }

  await transport.sendMail({
    from,
    to,
    replyTo: p.email,
    subject: `Pilotný program ADOS Sestra: ${p.ados}`,
    text: `Nový záujem o pilotný program z webu.\n\n${lines.join("\n")}`,
  });

  // Potvrdenie záujemcovi (best effort – neblokuje odoslanie)
  try {
    await transport.sendMail({
      from,
      to: p.email,
      subject: "ADOS Sestra: prijali sme váš záujem o pilotný program",
      text:
        `Dobrý deň, ${p.meno},\n\n` +
        "ďakujeme za záujem o pilotný program ADOS Sestra. Ozveme sa vám spravidla do niekoľkých pracovných dní " +
        "a dohodneme krátky úvodný rozhovor (približne 20 minút).\n\n" +
        "Odoslaním formulára nevzniká žiadny záväzok.\n\n" +
        `${CONTACT.company}\n${CONTACT.email} · ${CONTACT.phone}`,
    });
  } catch (err) {
    console.warn("[mail] potvrdenie záujemcovi sa nepodarilo odoslať", err);
  }

  return { sent: true };
}

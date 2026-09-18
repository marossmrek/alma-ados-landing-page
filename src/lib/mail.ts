import nodemailer from "nodemailer";
import { CONTACT } from "@/lib/nav";
import { BRAND } from "@/lib/brand";

export type PilotRequest = {
  name: string;
  agency: string;
  email: string;
  phone: string;
  nurseCount: string;
  message: string;
};

/*
  Sends e-mail via SMTP (nodemailer). Configured in .env.local, see .env.example.
  For Gmail: SMTP_HOST=smtp.gmail.com, SMTP_PORT=587, SMTP_USER=…@gmail.com, SMTP_PASS=app password.
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

const NURSE_COUNT_LABELS: Record<string, string> = { "1-3": "1 až 3", "4-8": "4 až 8", "9+": "9 a viac" };

export async function sendPilotRequest(p: PilotRequest): Promise<{ sent: boolean }> {
  const transport = createTransport();
  const to = process.env.CONTACT_TO ?? CONTACT.email;
  const from = process.env.CONTACT_FROM ?? process.env.SMTP_USER ?? CONTACT.email;

  const lines = [
    `Meno a priezvisko: ${p.name}`,
    `Názov ADOS: ${p.agency}`,
    `E-mail: ${p.email}`,
    `Telefón: ${p.phone || "neuvedený"}`,
    `Počet sestier: ${NURSE_COUNT_LABELS[p.nurseCount] ?? p.nurseCount}`,
    "",
    "Čo zaberá najviac času:",
    p.message || "(bez správy)",
  ];

  if (!transport) {
    console.warn("[mail] SMTP not configured (.env.local), e-mail not sent.\n" + lines.join("\n"));
    return { sent: false };
  }

  await transport.sendMail({
    from,
    to,
    replyTo: p.email,
    subject: `Pilotný program ${BRAND.name}: ${p.agency}`,
    text: `Nový záujem o pilotný program z webu.\n\n${lines.join("\n")}`,
  });

  // Confirmation to the applicant (best effort, does not block the submission)
  try {
    await transport.sendMail({
      from,
      to: p.email,
      subject: `${BRAND.name}: prijali sme váš záujem o pilotný program`,
      text:
        `Dobrý deň, ${p.name},\n\n` +
        `ďakujeme za záujem o pilotný program ${BRAND.name}. Ozveme sa vám spravidla do niekoľkých pracovných dní ` +
        "a dohodneme krátky úvodný rozhovor (približne 20 minút).\n\n" +
        "Odoslaním formulára nevzniká žiadny záväzok.\n\n" +
        `${CONTACT.company}\n${CONTACT.email} · ${CONTACT.phone}`,
    });
  } catch (err) {
    console.warn("[mail] failed to send confirmation to the applicant", err);
  }

  return { sent: true };
}

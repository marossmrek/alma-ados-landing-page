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
  E-mail delivery via the Resend API (https://resend.com), same setup as other thunderstruck sites.
  Env: RESEND_API_KEY (required), CONTACT_TO (recipient of leads), CONTACT_FROM (sender on a domain
  verified in Resend). Without an API key the request is only logged.
*/
const RESEND_ENDPOINT = "https://api.resend.com/emails";

const NURSE_COUNT_LABELS: Record<string, string> = { "1-3": "1 až 3", "4-8": "4 až 8", "9+": "9 a viac" };

type Mail = { from: string; to: string; replyTo?: string; subject: string; text: string };

async function sendViaResend(apiKey: string, mail: Mail) {
  const res = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: mail.from,
      to: [mail.to],
      reply_to: mail.replyTo,
      subject: mail.subject,
      text: mail.text,
    }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Resend ${res.status}: ${body.slice(0, 300)}`);
  }
}

export async function sendPilotRequest(p: PilotRequest): Promise<{ sent: boolean }> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO ?? CONTACT.email;
  const from = process.env.CONTACT_FROM ?? `${BRAND.name} <${CONTACT.email}>`;

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

  if (!apiKey) {
    console.warn("[mail] RESEND_API_KEY is not set, e-mail not sent.\n" + lines.join("\n"));
    return { sent: false };
  }

  await sendViaResend(apiKey, {
    from,
    to,
    replyTo: p.email,
    subject: `Pilotný program ${BRAND.name}: ${p.agency}`,
    text: `Nový záujem o pilotný program z webu.\n\n${lines.join("\n")}`,
  });

  // Confirmation to the applicant (best effort, never blocks the lead)
  try {
    await sendViaResend(apiKey, {
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

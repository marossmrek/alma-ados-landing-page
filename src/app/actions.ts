"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { sendPilotRequest } from "@/lib/mail";
import { rateLimited, tooFastOrStale, validatePayload } from "@/lib/antispam";

/*
  Server action formulára pilotného programu.
  Odošle e-mail na CONTACT_TO (predvolene maros.smrek@thunderstruck.studio) + potvrdenie záujemcovi
  a presmeruje na success stav. Spam sa ticho zahodí (tiež presmeruje, aby robot nič nezistil).
*/
export async function submitPilotForm(formData: FormData) {
  const payload = {
    meno: String(formData.get("meno") ?? "").trim(),
    ados: String(formData.get("ados") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    telefon: String(formData.get("telefon") ?? "").trim(),
    pocetSestier: String(formData.get("pocet-sestier") ?? ""),
    sprava: String(formData.get("sprava") ?? "").trim(),
    suhlas: formData.get("suhlas") === "on",
    // honeypot – skryté pole, ktoré vyplnia len roboty
    web: String(formData.get("web") ?? ""),
    // čas vykreslenia formulára – odoslanie do 4 s je robot
    ts: Number(formData.get("ts") ?? 0),
  };

  if (!payload.meno || !payload.ados || !payload.email || !payload.suhlas) {
    // Natívna validácia to zachytí skôr; toto je poistka pre odoslanie bez JS
    redirect("/#kontakt");
  }

  const h = await headers();
  const ip = (h.get("x-forwarded-for") ?? h.get("x-real-ip") ?? "unknown").split(",")[0].trim();
  const errors = validatePayload(payload);
  const isSpam = Boolean(payload.web) || tooFastOrStale(payload.ts) || errors.length > 0 || rateLimited(ip);

  if (isSpam) {
    console.warn("[pilotný formulár] zahodené ako spam", { ip, errors, honeypot: Boolean(payload.web), ts: payload.ts });
  } else {
    try {
      await sendPilotRequest(payload);
    } catch (err) {
      console.error("[pilotný formulár] e-mail sa nepodarilo odoslať", err, payload);
    }
  }

  redirect("/dakujeme");
}

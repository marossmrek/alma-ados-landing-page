/*
  Ochrana formulára bez CAPTCHA:
  - honeypot (skryté pole „web") – vyplnia len roboty
  - časová kontrola – odoslanie skôr ako MIN_FILL_MS po vykreslení formulára je robot
  - limit odoslaní z jednej IP (in-memory, per inštancia servera)
  - validácia formátu a dĺžok, filter odkazov v texte
*/
const MIN_FILL_MS = 4_000;
const MAX_AGE_MS = 24 * 60 * 60 * 1000;
const RATE_WINDOW_MS = 60 * 60 * 1000;
const RATE_MAX = 5;

const hits = new Map<string, number[]>();

export function rateLimited(ip: string, now = Date.now()) {
  const arr = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (arr.length >= RATE_MAX) {
    hits.set(ip, arr);
    return true;
  }
  arr.push(now);
  hits.set(ip, arr);
  // upratanie starých IP
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (!v.some((t) => now - t < RATE_WINDOW_MS)) hits.delete(k);
  }
  return false;
}

export function tooFastOrStale(renderedAt: number, now = Date.now()) {
  if (!Number.isFinite(renderedAt)) return true;
  const age = now - renderedAt;
  return age < MIN_FILL_MS || age > MAX_AGE_MS;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validatePayload(p: {
  meno: string;
  ados: string;
  email: string;
  telefon: string;
  sprava: string;
  pocetSestier: string;
}) {
  const errors: string[] = [];
  if (p.meno.length < 2 || p.meno.length > 100) errors.push("meno");
  if (p.ados.length < 2 || p.ados.length > 150) errors.push("ados");
  if (!EMAIL_RE.test(p.email) || p.email.length > 150) errors.push("email");
  if (p.telefon && !/^[+\d][\d\s()/-]{5,24}$/.test(p.telefon)) errors.push("telefon");
  if (!["1-3", "4-8", "9+"].includes(p.pocetSestier)) errors.push("pocet-sestier");
  if (p.sprava.length > 2000) errors.push("sprava");
  const links = (p.sprava.match(/https?:\/\/|www\./gi) ?? []).length;
  if (links > 1 || /<\s*a\s/i.test(p.sprava) || /\[url/i.test(p.sprava)) errors.push("sprava-links");
  // typický spam: odkaz v mene alebo názve
  if (/https?:\/\/|www\./i.test(p.meno + p.ados)) errors.push("spam");
  return errors;
}

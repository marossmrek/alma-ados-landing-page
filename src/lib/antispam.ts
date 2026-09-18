/*
  Form protection without CAPTCHA:
  - honeypot (hidden field "web"): only bots fill it in
  - timing check: submitting sooner than MIN_FILL_MS after the form rendered means a bot
  - submission limit per IP (in-memory, per server instance)
  - format and length validation, link filter in the message text
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
  // prune stale IPs
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
  name: string;
  agency: string;
  email: string;
  phone: string;
  message: string;
  nurseCount: string;
}) {
  const errors: string[] = [];
  if (p.name.length < 2 || p.name.length > 100) errors.push("name");
  if (p.agency.length < 2 || p.agency.length > 150) errors.push("agency");
  if (!EMAIL_RE.test(p.email) || p.email.length > 150) errors.push("email");
  if (p.phone && !/^[+\d][\d\s()/-]{5,24}$/.test(p.phone)) errors.push("phone");
  if (!["1-3", "4-8", "9+"].includes(p.nurseCount)) errors.push("nurse-count");
  if (p.message.length > 2000) errors.push("message");
  const links = (p.message.match(/https?:\/\/|www\./gi) ?? []).length;
  if (links > 1 || /<\s*a\s/i.test(p.message) || /\[url/i.test(p.message)) errors.push("message-links");
  // typical spam: a link in the name or agency name
  if (/https?:\/\/|www\./i.test(p.name + p.agency)) errors.push("spam");
  return errors;
}

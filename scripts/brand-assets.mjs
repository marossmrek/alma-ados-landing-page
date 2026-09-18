/*
  Generuje značkové assety z jediného zdroja pravdy (src/lib/brand.ts):
  - src/app/icon.svg, src/app/favicon.ico (16/32/48), src/app/apple-icon.png (180)
  - prepis loga a adresy v rastrových mockupoch (public/images/hero-browser.png, dashboard.png)
  Spustenie: node scripts/brand-assets.mjs
  Poznámka: mockupy sú exporty z Figmy; namiesto nového exportu sa starý znak prekryje novým
  a adresný riadok sa prepíše textom z BRAND.conceptUrl. Upravuje súbory na mieste (prekrytie je idempotentné),
  pôvodné exporty so starým znakom v repozitári zámerne nezostávajú.
*/
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(new URL(".", import.meta.url).pathname, "..");
const brandTs = fs.readFileSync(path.join(ROOT, "src/lib/brand.ts"), "utf8");
const pick = (key) => brandTs.match(new RegExp(`${key}:\\s*"([^"]+)"`))[1];
const BRAND = { conceptUrl: pick("conceptUrl") };
const MARK = {
  circle: { cx: 12, cy: 8.5, r: 3 },
  left: "M4 9v4a5 5 0 0 0 5 5",
  right: "M20 9v4a5 5 0 0 1-5 5",
};
const TEAL = "#0d7f81";
const strokeFor = (size) => (size >= 32 ? 1.75 : size > 16 ? 2 : 2.4);

/* Inter pre text v mockupoch (librsvg číta fonty cez fontconfig) */
const fontDir = path.join(ROOT, "src/app/fonts/og");
const fcConf = path.join(ROOT, ".next-brand-fonts.conf");
fs.writeFileSync(
  fcConf,
  `<?xml version="1.0"?><!DOCTYPE fontconfig SYSTEM "fonts.dtd"><fontconfig><dir>${fontDir}</dir><cachedir>/tmp/brand-fc-cache</cachedir></fontconfig>`,
);
process.env.FONTCONFIG_FILE = fcConf;

function glyph(size, stroke, color) {
  return `<g fill="none" stroke="${color}" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="${MARK.circle.cx}" cy="${MARK.circle.cy}" r="${MARK.circle.r}"/>
    <path d="${MARK.left}"/><path d="${MARK.right}"/>
  </g>`;
}

/* Dlaždica so znakom: strana `size`, zaoblenie 28 %, znak 62 % strany */
function tileSvg(size, { radius = Math.round(size * 0.28), stroke = strokeFor(size), glyphRatio = 0.62 } = {}) {
  const g = size * glyphRatio;
  const off = (size - g) / 2;
  const scale = g / 24;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${radius}" fill="${TEAL}"/>
  <g transform="translate(${off} ${off}) scale(${scale})">${glyph(24, stroke, "#fff")}</g>
</svg>`;
}

async function icons() {
  // icon.svg – vektor, prehliadač ho škáluje na 16–32 px → stroke 2
  fs.writeFileSync(path.join(ROOT, "src/app/icon.svg"), tileSvg(64, { radius: 18, stroke: 2 }) + "\n");
  // apple-icon – iOS zaobľuje sám, dlaždica bez vlastného zaoblenia
  await sharp(Buffer.from(tileSvg(180, { radius: 0, stroke: 1.75 }))).png().toFile(path.join(ROOT, "src/app/apple-icon.png"));
  // favicon.ico – PNG obrázky 16/32/48 v ICO kontajneri, hrúbka ťahu podľa veľkosti
  const sizes = [16, 32, 48];
  const pngs = await Promise.all(
    sizes.map((s) => sharp(Buffer.from(tileSvg(s, { stroke: strokeFor(s) })), { density: 384 }).resize(s, s).png().toBuffer()),
  );
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(sizes.length, 4);
  let offset = 6 + 16 * sizes.length;
  const dirs = pngs.map((p, i) => {
    const d = Buffer.alloc(16);
    d.writeUInt8(sizes[i], 0);
    d.writeUInt8(sizes[i], 1);
    d.writeUInt16LE(1, 4);
    d.writeUInt16LE(32, 6);
    d.writeUInt32LE(p.length, 8);
    d.writeUInt32LE(offset, 12);
    offset += p.length;
    return d;
  });
  fs.writeFileSync(path.join(ROOT, "src/app/favicon.ico"), Buffer.concat([header, ...dirs, ...pngs]));
  console.log("icons: icon.svg, favicon.ico, apple-icon.png");
}

/* Mockupy: prekryť starý znak novou dlaždicou a prepísať adresný riadok */
const MOCKUPS = [
  {
    file: "hero-browser.png",
    logo: { x: 33, y: 139, size: 48 },
    url: { cover: { x: 860, y: 34, w: 470, h: 42 }, cx: 1092, cy: 55, fontSize: 23 },
  },
  {
    file: "dashboard.png",
    logo: { x: 36, y: 120, size: 54 },
    url: { cover: { x: 1000, y: 22, w: 520, h: 46 }, cx: 1250, cy: 45, fontSize: 26 },
  },
];

async function mockups() {
  for (const m of MOCKUPS) {
    const out = path.join(ROOT, "public/images", m.file);
    const src = await sharp(out).png().toBuffer();
    const img = sharp(src);
    const { width, height } = await img.metadata();
    // farby z originálu: pozadie adresného riadku a farba textu
    const raw = await img.clone().raw().toBuffer();
    const px = (x, y) => {
      const i = (y * width + x) * 4;
      return [raw[i], raw[i + 1], raw[i + 2]];
    };
    const bg = px(m.url.cover.x + 4, m.url.cover.y + 4);
    let darkest = [255, 255, 255];
    for (let y = m.url.cover.y; y < m.url.cover.y + m.url.cover.h; y += 2)
      for (let x = m.url.cover.x; x < m.url.cover.x + m.url.cover.w; x += 2) {
        const c = px(x, y);
        if (c[0] + c[1] + c[2] < darkest[0] + darkest[1] + darkest[2]) darkest = c;
      }
    const hex = (c) => "#" + c.map((v) => v.toString(16).padStart(2, "0")).join("");
    const overlay = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  <rect x="${m.url.cover.x}" y="${m.url.cover.y}" width="${m.url.cover.w}" height="${m.url.cover.h}" fill="${hex(bg)}"/>
  <text x="${m.url.cx}" y="${m.url.cy}" font-family="Inter" font-weight="400" font-size="${m.url.fontSize}" fill="${hex(darkest)}" text-anchor="middle" dominant-baseline="central">${BRAND.conceptUrl}</text>
  <g transform="translate(${m.logo.x} ${m.logo.y})">${tileSvg(m.logo.size).replace(/<\?xml[^>]*>|<svg[^>]*>|<\/svg>/g, "")}</g>
</svg>`;
    await sharp(src).composite([{ input: Buffer.from(overlay), top: 0, left: 0 }]).png().toFile(out);
    console.log(`mockup: ${m.file} (bg ${hex(bg)}, text ${hex(darkest)})`);
  }
}

await icons();
await mockups();
fs.rmSync(fcConf, { force: true });

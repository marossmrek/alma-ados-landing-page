/*
  Generates brand assets from the single source of truth (src/lib/brand.ts):
  - src/app/icon.svg, src/app/favicon.ico (16/32/48), src/app/apple-icon.png (180)
  - rewrites the logo and address in the raster mockups (public/images/hero-browser-alma.png, dashboard-alma.png; the -alma suffix bypasses the cache of old exports)
  Run: node scripts/brand-assets.mjs
  Note: the mockups are Figma exports; instead of re-exporting, the old mark is covered with the new one
  and the address bar is rewritten with the text from BRAND.conceptUrl. Edits the files in place (the overlay is idempotent);
  the original exports with the old mark are intentionally not kept in the repository.
*/
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(new URL(".", import.meta.url).pathname, "..");
const brandTs = fs.readFileSync(path.join(ROOT, "src/lib/brand.ts"), "utf8");
const pick = (key) => brandTs.match(new RegExp(`${key}:\\s*"([^"]+)"`))[1];
const BRAND = { name: pick("name"), conceptUrl: pick("conceptUrl") };
const MARK = {
  circle: { cx: 12, cy: 8.5, r: 3 },
  left: "M4 9v4a5 5 0 0 0 5 5",
  right: "M20 9v4a5 5 0 0 1-5 5",
};
const TEAL = "#0d7f81";
const strokeFor = (size) => (size >= 32 ? 1.75 : size > 16 ? 2 : 2.4);

/* Inter for text in mockups (librsvg reads fonts via fontconfig) */
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

/* Mark tile: side `size`, 28 % corner radius, mark 62 % of the side */
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
  // icon.svg: vector, the browser scales it to 16–32 px → stroke 2
  fs.writeFileSync(path.join(ROOT, "src/app/icon.svg"), tileSvg(64, { radius: 18, stroke: 2 }) + "\n");
  // apple-icon: iOS rounds the corners itself, tile without its own radius
  await sharp(Buffer.from(tileSvg(180, { radius: 0, stroke: 1.75 }))).png().toFile(path.join(ROOT, "src/app/apple-icon.png"));
  // favicon.ico: PNG images 16/32/48 in an ICO container, stroke width by size
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

/* Mockups: cover the old mark with the new tile and rewrite texts (address bar, name in the header).
   Coordinates are in pixels of the original; text and background colors are sampled from the image. */
const MOCKUPS = [
  {
    file: "hero-browser-alma.png", // 2080 × 1410
    logo: { x: 33, y: 139, size: 48 },
    texts: [
      { cover: { x: 860, y: 34, w: 470, h: 42 }, x: 1092, cy: 55, size: 23, weight: 400, anchor: "middle", text: BRAND.conceptUrl },
      { cover: { x: 86, y: 136, w: 170, h: 29 }, x: 96, cy: 152, size: 19, weight: 600, anchor: "start", text: BRAND.name },
      {
        cover: { x: 372, y: 162, w: 530, h: 24 },
        x: 374,
        cy: 174,
        size: 16,
        weight: 400,
        anchor: "start",
        text: `${BRAND.name} · 5 sestier v teréne · 42 návštev naplánovaných`,
      },
    ],
  },
  {
    file: "dashboard-alma.png", // 2400 × 1588
    logo: { x: 36, y: 120, size: 54 },
    texts: [
      { cover: { x: 1000, y: 22, w: 520, h: 46 }, x: 1250, cy: 45, size: 26, weight: 400, anchor: "middle", text: BRAND.conceptUrl },
      { cover: { x: 106, y: 122, w: 190, h: 31 }, x: 108, cy: 139, size: 22, weight: 600, anchor: "start", text: BRAND.name },
    ],
  },
];

const hex = (c) => "#" + c.map((v) => v.toString(16).padStart(2, "0")).join("");

async function mockups() {
  for (const m of MOCKUPS) {
    const out = path.join(ROOT, "public/images", m.file);
    const src = await sharp(out).png().toBuffer();
    const img = sharp(src);
    const { width, height } = await img.metadata();
    const raw = await img.clone().raw().toBuffer();
    const px = (x, y) => {
      const i = (y * width + x) * 4;
      return [raw[i], raw[i + 1], raw[i + 2]];
    };
    const parts = [];
    for (const t of m.texts) {
      const bg = px(t.cover.x + 2, t.cover.y + 2);
      let darkest = [255, 255, 255];
      for (let y = t.cover.y; y < t.cover.y + t.cover.h; y += 2)
        for (let x = t.cover.x; x < t.cover.x + t.cover.w; x += 2) {
          const c = px(x, y);
          if (c[0] + c[1] + c[2] < darkest[0] + darkest[1] + darkest[2]) darkest = c;
        }
      parts.push(
        `<rect x="${t.cover.x}" y="${t.cover.y}" width="${t.cover.w}" height="${t.cover.h}" fill="${hex(bg)}"/>`,
        `<text x="${t.x}" y="${t.cy}" font-family="Inter" font-weight="${t.weight}" font-size="${t.size}" fill="${hex(darkest)}" text-anchor="${t.anchor}" dominant-baseline="central">${t.text}</text>`,
      );
    }
    parts.push(`<g transform="translate(${m.logo.x} ${m.logo.y})">${tileSvg(m.logo.size).replace(/<\?xml[^>]*>|<svg[^>]*>|<\/svg>/g, "")}</g>`);
    const overlay = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">${parts.join("\n")}</svg>`;
    await sharp(src).composite([{ input: Buffer.from(overlay), top: 0, left: 0 }]).png().toFile(out);
    console.log(`mockup: ${m.file}`);
  }
}

await icons();
await mockups();
fs.rmSync(fcConf, { force: true });

/*
  Generates brand assets from the single source of truth (src/lib/brand.ts):
  - src/app/icon.svg, src/app/favicon.ico (16/32/48), src/app/apple-icon.png (180)
  Run: node scripts/brand-assets.mjs
  Screenshots in public/images are real app captures; the browser chrome around them is drawn in CSS (BrowserFrame).
*/
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(new URL(".", import.meta.url).pathname, "..");
const MARK = {
  circle: { cx: 12, cy: 8.5, r: 3 },
  left: "M4 9v4a5 5 0 0 0 5 5",
  right: "M20 9v4a5 5 0 0 1-5 5",
};
const TEAL = "#0d7f81";
const strokeFor = (size) => (size >= 32 ? 1.75 : size > 16 ? 2 : 2.4);

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

await icons();

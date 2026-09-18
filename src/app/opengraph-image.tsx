import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { BRAND, BRAND_MARK_PATHS } from "@/lib/brand";

/* OG/Twitter karta: dlaždica so znakom, wordmark a hlavný sľub stránky. Generuje sa pri builde. */
export const alt = `${BRAND.name}: dokumentácia vzniká pri pacientovi`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const fontsDir = path.join(process.cwd(), "src/app/fonts/og");
  const [semibold, regular] = await Promise.all([
    readFile(path.join(fontsDir, "Inter-SemiBold.ttf")),
    readFile(path.join(fontsDir, "Inter-Regular.ttf")),
  ]);
  const { circle, left, right } = BRAND_MARK_PATHS;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#f7f6f3",
          color: "#141b24",
          fontFamily: "Inter",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 20,
              background: "#0d7f81",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="44"
              height="44"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ffffff"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx={circle.cx} cy={circle.cy} r={circle.r} />
              <path d={left} />
              <path d={right} />
            </svg>
          </div>
          <div style={{ display: "flex", fontSize: 44, fontWeight: 600, letterSpacing: "-0.01em" }}>
            <span>{BRAND.brand}</span>
            <span style={{ color: "#0a6466", marginLeft: 14 }}>{BRAND.segment}</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 66, fontWeight: 600, lineHeight: 1.08, letterSpacing: "-0.02em", maxWidth: 1000 }}>
            Dokumentácia vzniká pri pacientovi, nie večer v kancelárii.
          </div>
          <div style={{ fontSize: 28, color: "#4b5563", lineHeight: 1.4 }}>
            Pilotný program pre agentúry domácej ošetrovateľskej starostlivosti · vo vývoji
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Inter", data: semibold, weight: 600, style: "normal" },
        { name: "Inter", data: regular, weight: 400, style: "normal" },
      ],
    },
  );
}

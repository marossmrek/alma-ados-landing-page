import type { Metadata, Viewport } from "next";
import { BRAND } from "@/lib/brand";
import localFont from "next/font/local";
import "./globals.css";
import { BackToTop } from "@/components/BackToTop";
import { Preloader } from "@/components/Preloader";

/*
  Inter Variable (wght 400–600) zúžený na znaky pre slovenčinu (latin, latin-ext, interpunkcia, šípky):
  jeden súbor ~71 KB namiesto dvoch Google subsetov (132 KB). Zdroj: rsms/inter v4.1, subset cez fonttools.
*/
const inter = localFont({
  src: "./fonts/InterVariable-sk.woff2",
  variable: "--font-inter",
  weight: "400 600",
  display: "swap",
  adjustFontFallback: "Arial",
});

const DESCRIPTION =
  "Vyvíjame moderný systém pre agentúry domácej ošetrovateľskej starostlivosti, ktorý prepája prácu sestier v teréne s plánovaním, dokumentáciou a administratívou v kancelárii.";

/* Absolútna adresa webu pre OG/Twitter obrázky: NEXT_PUBLIC_SITE_URL, inak adresa z Vercelu */
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: `${BRAND.name} | Systém pre agentúry domácej starostlivosti (vo vývoji)`,
  description: DESCRIPTION,
  applicationName: BRAND.name,
  openGraph: {
    type: "website",
    locale: "sk_SK",
    siteName: BRAND.name,
    title: `${BRAND.name}: dokumentácia vzniká pri pacientovi`,
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND.name}: dokumentácia vzniká pri pacientovi`,
    description: DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#0d7f81",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="sk" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <span id="top" tabIndex={-1} className="sr-only" aria-hidden="true" />
        <Preloader />
        {children}
        <BackToTop />
      </body>
    </html>
  );
}

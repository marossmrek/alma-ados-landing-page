import type { Metadata, Viewport } from "next";
import { BRAND } from "@/lib/brand";
import localFont from "next/font/local";
import "./globals.css";
import { BackToTop } from "@/components/BackToTop";
import { Preloader } from "@/components/Preloader";

/*
  Inter Variable (wght 400–600) subset to the glyphs needed for Slovak (latin, latin-ext, punctuation, arrows):
  one ~71 KB file instead of two Google subsets (132 KB). Source: rsms/inter v4.1, subset via fonttools.
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

/* Absolute site URL for OG/Twitter images: NEXT_PUBLIC_SITE_URL, otherwise the Vercel address */
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

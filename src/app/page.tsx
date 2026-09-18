import { Nav } from "@/components/sections/Nav";
import { Hero } from "@/components/sections/Hero";
import { Vizia } from "@/components/sections/Vizia";
import { PreSestry } from "@/components/sections/PreSestry";
import { AiDokumentacia } from "@/components/sections/AiDokumentacia";
import { PreAdos } from "@/components/sections/PreAdos";
import { Kalkulacka } from "@/components/sections/Kalkulacka";
import { StavVyvoja } from "@/components/sections/StavVyvoja";
import { PilotKroky } from "@/components/sections/PilotKroky";
import { Ocakavania } from "@/components/sections/Ocakavania";
import { Faq } from "@/components/sections/Faq";
import { Kontakt } from "@/components/sections/Kontakt";
import { Footer } from "@/components/sections/Footer";
import { Reveal } from "@/components/Reveal";
import { HashScroll } from "@/components/HashScroll";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="flex flex-1 flex-col">
        <Hero />
        <Vizia />
        <PreSestry />
        <AiDokumentacia />
        <PreAdos />
        <Kalkulacka />
        <StavVyvoja />
        <PilotKroky />
        <Ocakavania />
        <Faq />
        <Kontakt />
      </main>
      <Footer />
      <Reveal />
      <HashScroll />
    </>
  );
}

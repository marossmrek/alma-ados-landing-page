import { Nav } from "@/components/sections/Nav";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { FieldDay } from "@/components/sections/FieldDay";
import { AiDocumentation } from "@/components/sections/AiDocumentation";
import { OfficeDay } from "@/components/sections/OfficeDay";
import { Calculator } from "@/components/sections/Calculator";
import { Roadmap } from "@/components/sections/Roadmap";
import { PilotSteps } from "@/components/sections/PilotSteps";
import { Expectations } from "@/components/sections/Expectations";
import { Faq } from "@/components/sections/Faq";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";
import { Reveal } from "@/components/Reveal";
import { HashScroll } from "@/components/HashScroll";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="flex flex-1 flex-col">
        <Hero />
        <HowItWorks />
        <FieldDay />
        <AiDocumentation />
        <OfficeDay />
        <Calculator />
        <Roadmap />
        <PilotSteps />
        <Expectations />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <Reveal />
      <HashScroll />
    </>
  );
}

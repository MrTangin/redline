import { Hero } from "@/components/sections/hero";
import { TechStackGrid } from "@/components/sections/tech-stack-grid";
import { ModularByDesign } from "@/components/sections/modular-by-design";
import { Pros } from "@/components/sections/pros";
import { Quickstart } from "@/components/sections/quickstart";
import { ArchitectureDiagram } from "@/components/sections/architecture-diagram";
import { Faq } from "@/components/sections/faq";
import { Footer } from "@/components/sections/footer";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <Hero />
      <TechStackGrid />
      <ModularByDesign />
      <Pros />
      <Quickstart />
      <ArchitectureDiagram />
      <Faq />
      <Footer />
    </main>
  );
}

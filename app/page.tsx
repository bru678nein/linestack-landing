import { FaqJsonLd, OrganizationJsonLd } from "@/components/JsonLd";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { Faq } from "@/components/sections/Faq";
import { Footer } from "@/components/sections/Footer";
import { Hero } from "@/components/sections/Hero";
import { Navbar } from "@/components/sections/Navbar";
import { Process } from "@/components/sections/Process";
import { Projects } from "@/components/sections/Projects";
import { Services } from "@/components/sections/Services";
import { TechMarquee } from "@/components/sections/TechMarquee";
import { WhyUs } from "@/components/sections/WhyUs";
import { WhatsAppFab } from "@/components/ui/WhatsApp";

/**
 * Orden pensado como recorrido de venta: primero se muestra trabajo real (proyectos),
 * después qué hacemos y cómo, por qué elegirnos, dudas frecuentes y cierre.
 * Testimonios queda fuera hasta tener citas reales con permiso: los de data/content.ts son de relleno.
 * El formulario vive en su propia página: /contacto.
 */
export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <TechMarquee />
        <Projects />
        <Services />
        <Process />
        <WhyUs />
        <Faq />
        <CtaBanner />
      </main>
      <Footer />
      <WhatsAppFab />
      <OrganizationJsonLd />
      <FaqJsonLd />
    </>
  );
}

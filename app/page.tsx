import { FaqJsonLd, OrganizationJsonLd } from "@/components/JsonLd";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { Faq } from "@/components/sections/Faq";
import { Footer } from "@/components/sections/Footer";
import { Hero } from "@/components/sections/Hero";
import { Navbar } from "@/components/sections/Navbar";
import { Projects } from "@/components/sections/Projects";
import { Services } from "@/components/sections/Services";
import { WhatsAppFab } from "@/components/ui/WhatsApp";

/**
 * Kept short on purpose: real work first (projects), then what we do, common questions and the
 * close. Each promise is said once: the hero carries the commitments and the FAQ the details.
 * Testimonials stay out until there are real quotes with permission: the ones in data/content.ts
 * are placeholders. The form lives on its own page: /contacto.
 */
export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Projects />
        <Services />
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

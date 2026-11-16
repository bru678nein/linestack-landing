import type { Metadata } from "next";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";
import { Navbar } from "@/components/sections/Navbar";
import { Toaster } from "@/components/ui/Toaster";
import { site } from "@/config/site";
import { openGraphFor } from "@/lib/seo";

const title = `Contacto | ${site.name}`;
const description = "Contanos tu proyecto. Respondemos en menos de 24 h hábiles y la primera reunión es gratis.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/contacto" },
  openGraph: openGraphFor(title, description, "/contacto"),
};

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main>
        <Contact />
      </main>
      <Footer />
      <Toaster />
    </>
  );
}

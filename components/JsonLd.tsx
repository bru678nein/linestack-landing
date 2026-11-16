import { site } from "@/config/site";
import { faqs } from "@/data/content";

/** Inserta datos estructurados (schema.org) para que Google entienda la página */
function Script({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // El contenido sale de nuestros propios datos, no de usuarios
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

/** Quién es LineStack: nombre, web, contacto y redes */
export function OrganizationJsonLd() {
  return (
    <Script
      data={{
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        name: site.name,
        url: site.url,
        logo: `${site.url}/icon.svg`,
        image: `${site.url}/opengraph-image`,
        description: site.description,
        email: site.email,
        telephone: site.telephone,
        areaServed: "AR",
        address: { "@type": "PostalAddress", addressLocality: "Mendoza", addressRegion: "Mendoza", addressCountry: "AR" },
        ...(Object.keys(site.socials).length > 0 && { sameAs: Object.values(site.socials) }),
      }}
    />
  );
}

/** Preguntas frecuentes: Google puede mostrarlas desplegadas en los resultados */
export function FaqJsonLd() {
  return (
    <Script
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }}
    />
  );
}

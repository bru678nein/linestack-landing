import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/sections/Footer";
import { Navbar } from "@/components/sections/Navbar";
import { site } from "@/config/site";
import { openGraphFor } from "@/lib/seo";

const title = `Política de privacidad | ${site.name}`;
const description = `Cómo ${site.name} trata los datos personales que nos enviás a través del sitio.`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/privacidad" },
  openGraph: openGraphFor(title, description, "/privacidad"),
};

/*
 * BORRADOR BASE: texto general pensado para la Ley 25.326 de Protección de Datos Personales (Argentina).
 * Antes de publicar, completar los datos del responsable y revisarlo con un profesional.
 */
const updated = "noviembre de 2026";

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 pb-24 pt-32 sm:px-6 sm:pt-40">
        <h1 className="font-display text-4xl font-semibold text-metal sm:text-5xl">Política de privacidad</h1>
        <p className="mt-4 text-sm text-zinc-500">Última actualización: {updated}</p>

        <div className="mt-12 space-y-10 text-base leading-relaxed text-zinc-300 [&_h2]:mb-3 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-white [&_li]:ml-5 [&_li]:list-disc [&_ul]:space-y-1.5">
          <section>
            <h2>1. Quién es responsable de tus datos</h2>
            <p>
              {site.name} es responsable del tratamiento de los datos personales que nos envíes a través de este sitio. Podés
              contactarnos en <a className="text-white underline underline-offset-4" href={`mailto:${site.email}`}>{site.email}</a>.
            </p>
          </section>

          <section>
            <h2>2. Qué datos recolectamos</h2>
            <p>Solo los que nos das voluntariamente al completar el formulario de contacto o escribirnos:</p>
            <ul className="mt-3">
              <li>Nombre y email.</li>
              <li>Tipo de proyecto, presupuesto estimado y el mensaje que nos envíes.</li>
            </ul>
            <p className="mt-3">
              Si nos escribís por WhatsApp, esa conversación se rige además por las políticas de WhatsApp.
            </p>
          </section>

          <section>
            <h2>3. Para qué los usamos</h2>
            <p>
              Únicamente para responder tu consulta, preparar una propuesta y mantener la comunicación sobre tu proyecto. No los
              vendemos ni los cedemos a terceros con fines comerciales.
            </p>
          </section>

          <section>
            <h2>4. Con quién los compartimos</h2>
            <p>
              Usamos proveedores que nos ayudan a operar el sitio (por ejemplo, el servicio de alojamiento y el de envío de emails
              del formulario). Solo acceden a los datos en la medida necesaria para prestar ese servicio.
            </p>
          </section>

          <section>
            <h2>5. Cuánto tiempo los guardamos</h2>
            <p>
              Mientras sea necesario para atender tu consulta o mantener la relación comercial, y luego por el plazo que exija la
              ley. Podés pedirnos que los borremos antes.
            </p>
          </section>

          <section>
            <h2>6. Tus derechos</h2>
            <p>
              Podés pedir acceso, rectificación, actualización o supresión de tus datos escribiendo a{" "}
              <a className="text-white underline underline-offset-4" href={`mailto:${site.email}`}>{site.email}</a>. El acceso es
              gratuito en intervalos no inferiores a seis meses, salvo interés legítimo (art. 14, inc. 3, Ley 25.326).
            </p>
            <p className="mt-3 text-sm text-zinc-400">
              La AGENCIA DE ACCESO A LA INFORMACIÓN PÚBLICA, en su carácter de Órgano de Control de la Ley N° 25.326, tiene la
              atribución de atender las denuncias y reclamos que interpongan quienes resulten afectados en sus derechos por
              incumplimiento de las normas vigentes en materia de protección de datos personales.
            </p>
          </section>

          <section>
            <h2>7. Cambios en esta política</h2>
            <p>
              Si actualizamos esta política, vas a ver la nueva fecha arriba. Ante cualquier duda,{" "}
              <Link href="/contacto" className="text-white underline underline-offset-4">
                escribinos
              </Link>
              .
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

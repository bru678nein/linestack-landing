import { SectionTitle } from "@/components/ui/SectionTitle";
import { projects } from "@/data/projects";
import { WhyToggle } from "./WhyToggle";

/** Datos verificables (nada de porcentajes que no podamos respaldar) */
const facts = [
  { value: "24 h", label: "Máximo para responderte" },
  { value: "Gratis", label: "La primera reunión" },
  { value: String(projects.length), label: projects.length === 1 ? "Sistema en uso hoy" : "Sistemas en uso hoy" },
  { value: "Mendoza", label: "Presencial o por llamada" },
];

export function WhyUs() {
  return (
    <section id="por-que" className="relative scroll-mt-24 overflow-hidden border-y border-line bg-surface/60 py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-30 [mask-image:linear-gradient(to_bottom,transparent,#000_30%,#000_70%,transparent)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <SectionTitle
          eyebrow="Por qué LineStack"
          align="split"
          title={<>Lo que te garantizamos</>}
          description="Lo que suele salir mal, y lo que te comprometemos nosotros."
        />

        {/* Antes / después con interruptor (cambia solo la primera vez que aparece) */}
        <WhyToggle />

        {/* Datos verificables */}
        <dl className="mt-14 grid grid-cols-2 border-y border-line lg:grid-cols-4">
          {facts.map((f, i) => (
            <div
              key={f.label}
              className={`flex flex-col-reverse px-2 py-7 sm:px-6 ${i % 2 ? "border-l border-line" : ""} ${i >= 2 ? "border-t border-line lg:border-t-0" : ""} ${
                i > 0 ? "lg:border-l" : ""
              }`}
            >
              <dt className="mt-2 text-xs uppercase tracking-[0.2em] text-zinc-500">{f.label}</dt>
              <dd className="font-display text-3xl font-semibold text-metal sm:text-4xl">{f.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

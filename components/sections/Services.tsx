"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { useId, useState } from "react";
import { Button } from "@/components/ui/Button";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ServiceDemo } from "@/components/ui/ServiceDemos";
import { projects } from "@/data/projects";
import { situations } from "@/data/services";
import { cn } from "@/lib/utils";

/**
 * Servicios por situación: el visitante elige en qué está y ve cómo lo resolvemos, el servicio
 * funcionando (mini-demo) y el proyecto real que lo respalda. El botón lleva a /contacto con el
 * tipo de proyecto ya elegido en el formulario.
 */
export function Services() {
  const [active, setActive] = useState(0);
  const uid = useId();
  const s = situations[active];
  const project = s.project ? projects.find((p) => p.slug === s.project) : undefined;

  return (
    <section id="servicios" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionTitle
          eyebrow="Servicios"
          align="split"
          title={<>¿En qué estás? Te mostramos cómo lo resolvemos</>}
          description="Elegí la situación que más se parece a la tuya. Un solo equipo para diseño, desarrollo y lo que viene después."
        />

        <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr] lg:gap-8">
          {/* Situaciones: columna en compu, fila deslizable en celular */}
          <div
            role="tablist"
            aria-label="Situaciones"
            aria-orientation="vertical"
            className="-mx-4 flex snap-x gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0 [&::-webkit-scrollbar]:hidden"
          >
            {situations.map((item, i) => {
              const on = i === active;
              return (
                <button
                  key={item.id}
                  role="tab"
                  id={`${uid}-tab-${i}`}
                  aria-selected={on}
                  aria-controls={`${uid}-panel`}
                  onClick={() => setActive(i)}
                  className={cn(
                    "group relative flex w-[78%] shrink-0 snap-start items-center gap-4 rounded-2xl border px-5 py-4 text-left transition-colors duration-300 sm:w-[55%] lg:w-auto",
                    on ? "border-white/25 bg-white/[0.06]" : "border-line hover:border-white/20 hover:bg-white/[0.03]",
                  )}
                >
                  {on && (
                    <motion.span
                      layoutId={`${uid}-marker`}
                      className="absolute inset-y-3 left-0 w-0.5 rounded-full bg-ice"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span
                    className={cn(
                      "font-display text-sm tabular-nums transition-colors",
                      on ? "text-ice" : "text-zinc-500 group-hover:text-zinc-300",
                    )}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1">
                    <span
                      className={cn(
                        "block font-display text-base font-medium leading-snug transition-colors sm:text-lg",
                        on ? "text-white" : "text-zinc-400 group-hover:text-zinc-200",
                      )}
                    >
                      “{item.situation}”
                    </span>
                    <span className="mt-1 block text-xs text-zinc-500 lg:hidden">{item.service}</span>
                  </span>
                  <ArrowRight
                    className={cn(
                      "hidden h-4 w-4 shrink-0 transition-all duration-300 lg:block",
                      on ? "translate-x-0 text-white opacity-100" : "-translate-x-2 text-zinc-500 opacity-0 group-hover:opacity-60",
                    )}
                  />
                </button>
              );
            })}
          </div>

          {/* Panel de la situación elegida */}
          <div
            id={`${uid}-panel`}
            role="tabpanel"
            aria-labelledby={`${uid}-tab-${active}`}
            className="card relative overflow-hidden p-5 sm:p-7"
          >
            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-ice/10 blur-3xl" />
            <AnimatePresence mode="wait">
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="relative grid gap-6 md:grid-cols-[1fr_1.05fr] md:gap-7"
              >
                {/* Demo animada del servicio */}
                <div className="h-60 md:order-2 md:h-auto md:min-h-[300px]">
                  <ServiceDemo demo={s.demo} />
                </div>

                <div className="flex flex-col">
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-ice">Lo resolvemos con</div>
                  <h3 className="mt-2 font-display text-2xl font-semibold leading-tight text-metal sm:text-3xl">{s.service}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">{s.description}</p>

                  <ul className="mt-5 grid gap-2">
                    {s.includes.map((x) => (
                      <li key={x} className="flex items-center gap-2.5 text-sm text-zinc-200">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/[0.06]">
                          <Check className="h-3 w-3 text-ice" />
                        </span>
                        {x}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 text-xs text-zinc-500">
                    <span className="text-zinc-400">Ideal para:</span> {s.idealFor}
                  </p>

                  <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 md:mt-auto md:pt-6">
                    <Button href={`/contacto?tipo=${encodeURIComponent(s.contactType)}`} size="sm">
                      Contanos tu caso
                    </Button>
                    {project && (
                      <a
                        href="#proyectos"
                        className="group/link inline-flex items-center gap-1.5 text-sm text-zinc-300 transition-colors hover:text-white"
                      >
                        Ver {project.title}, un caso real
                        <ArrowUpRight className="h-4 w-4 transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

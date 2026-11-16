"use client";

import { motion } from "framer-motion";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { steps } from "@/data/content";

/** Mini pila del logo: en cada paso se encienden tantas capas como pasos van */
function MiniStack({ lit }: { lit: number }) {
  return (
    <svg viewBox="0 0 44 40" className="h-10 w-11" aria-hidden>
      {Array.from({ length: steps.length }).map((_, k) => {
        // k = 0 es la capa de abajo
        const y = 30 - k * 6;
        const on = k < lit;
        const top = k === lit - 1;
        return (
          <polygon
            key={k}
            points={`22,${y - 6} 42,${y} 22,${y + 6} 2,${y}`}
            fill={on ? (top ? "#7dd3fc" : "#e4e4e7") : "transparent"}
            fillOpacity={on ? (top ? 0.9 : 0.55) : 0}
            stroke={on ? "#ffffff" : "#3f3f46"}
            strokeOpacity={on ? 0.7 : 1}
            strokeWidth={1}
          />
        );
      })}
    </svg>
  );
}

/**
 * Proceso en 5 pasos, compacto: en pantallas grandes van en una fila y en celular en columna.
 * Cada paso muestra la pila del logo con una capa más encendida.
 */
export function Process() {
  return (
    <section id="proceso" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionTitle
          align="split"
          eyebrow="Cómo trabajamos"
          title={<>Un proceso claro, construido capa por capa</>}
          description="Cada etapa se apoya en la anterior. Siempre sabés en qué punto estamos y qué viene después."
        />

        <ol className="grid gap-4 lg:grid-cols-5 lg:gap-5">
          {steps.map((s, i) => (
            <motion.li
              key={s.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className="card flex gap-5 p-5 lg:flex-col lg:gap-0 lg:p-6"
            >
              <div className="flex shrink-0 items-center gap-3 lg:mb-6 lg:justify-between">
                <span className="relative z-10 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-ink font-display text-lg font-semibold text-white">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="hidden lg:block">
                  <MiniStack lit={i + 1} />
                </span>
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold text-white sm:text-xl">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{s.description}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}

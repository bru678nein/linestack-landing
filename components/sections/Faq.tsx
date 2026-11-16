"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useId, useState } from "react";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { faqs } from "@/data/content";

function Item({ q, a, open, onToggle }: { q: string; a: string; open: boolean; onToggle: () => void }) {
  const id = useId();
  return (
    <li className="border-b border-line">
      <h3>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={id}
          className="flex w-full items-center justify-between gap-6 py-5 text-left sm:py-6"
        >
          <span className={`font-display text-base font-medium transition-colors sm:text-lg ${open ? "text-white" : "text-zinc-300"}`}>
            {q}
          </span>
          <span
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
              open ? "rotate-45 border-ice/60 text-ice" : "border-line text-zinc-400"
            }`}
          >
            <Plus className="h-4 w-4" />
          </span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={id}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="max-w-2xl pb-6 text-sm leading-relaxed text-muted sm:text-base">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

/** Preguntas frecuentes en formato desplegable; la primera arranca abierta */
export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <SectionTitle
          align="left"
          eyebrow="Preguntas frecuentes"
          title={<>Lo que nos suelen preguntar</>}
          description="Si tu duda no está acá, escribinos: respondemos en menos de 24 h hábiles."
          className="mb-0 lg:sticky lg:top-28 lg:self-start"
        />
        <ul className="border-t border-line">
          {faqs.map((f, i) => (
            <Item key={f.q} q={f.q} a={f.a} open={open === i} onToggle={() => setOpen(open === i ? null : i)} />
          ))}
        </ul>
      </div>
    </section>
  );
}

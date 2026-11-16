"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { Check, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { guarantees } from "@/data/content";

/**
 * Antes / Después: un interruptor "Lo típico | Con LineStack".
 * Arranca en "Lo típico" y, al aparecer en pantalla, cambia solo a "Con LineStack" para que se vean
 * los dos mensajes aunque nadie toque el interruptor. Después, la persona lo maneja.
 */
export function WhyToggle() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-25% 0px -25% 0px" });
  const reduced = useReducedMotion();
  const [us, setUs] = useState(false);
  const touched = useRef(false);
  const uid = useId();

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setUs(true);
      return;
    }
    const t = setTimeout(() => {
      if (!touched.current) setUs(true);
    }, 1600);
    return () => clearTimeout(t);
  }, [inView, reduced]);

  const choose = (v: boolean) => {
    touched.current = true;
    setUs(v);
  };

  return (
    <div ref={ref} className="mx-auto max-w-4xl">
      <div role="group" aria-label="Comparar" className="mx-auto mb-8 flex w-fit border border-line bg-white/[0.03] p-1 text-sm font-semibold">
        {(
          [
            ["Lo típico", false],
            ["Con LineStack", true],
          ] as const
        ).map(([label, v]) => (
          <button
            key={label}
            type="button"
            aria-pressed={us === v}
            onClick={() => choose(v)}
            className={`relative px-5 py-2.5 transition-colors ${us === v ? "text-black" : "text-zinc-400 hover:text-white"}`}
          >
            {us === v && (
              <motion.span
                layoutId={`${uid}-toggle`}
                className={`absolute inset-0 ${v ? "bg-white" : "bg-red-300"}`}
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              />
            )}
            <span className="relative">{label}</span>
          </button>
        ))}
      </div>

      <ul className="grid gap-x-10 sm:grid-cols-2" aria-live="polite">
        {guarantees.map((g, i) => (
          <li key={g.title} className="flex items-center gap-4 border-b border-line py-5">
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center transition-colors duration-300 ${
                us ? "bg-ice/15 text-ice" : "bg-red-400/10 text-red-300"
              }`}
            >
              {us ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
            </span>
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={us ? "us" : "them"}
                initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
                transition={{ duration: 0.22, delay: i * 0.04 }}
                className={`font-display text-lg sm:text-xl ${us ? "font-semibold text-white" : "text-zinc-500 line-through decoration-red-400/50"}`}
              >
                {us ? g.title : g.fear}
              </motion.span>
            </AnimatePresence>
          </li>
        ))}
      </ul>
    </div>
  );
}

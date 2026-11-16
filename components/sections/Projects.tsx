"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, CheckCircle2, X } from "lucide-react";
import { useLenis } from "lenis/react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/Button";
import { ProjectMockup } from "@/components/ui/ProjectMockup";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { WhatsAppIcon } from "@/components/ui/WhatsApp";
import { whatsappUrl } from "@/config/site";
import { projects, type Project } from "@/data/projects";
import { cn } from "@/lib/utils";

type Slot = { project: Project; wide: boolean; flip: boolean };

/**
 * Reparte los proyectos alternando formatos: uno en grande cada cinco, y también el último
 * si quedaría solo en su fila. Los grandes alternan la imagen de lado.
 */
function arrange(list: Project[]): Slot[] {
  let col = 0;
  let wides = 0;
  return list.map((project, i) => {
    const wide = i % 5 === 0 || (col === 0 && i === list.length - 1);
    if (wide) {
      col = 0;
      return { project, wide, flip: wides++ % 2 === 1 };
    }
    col = (col + 1) % 2;
    return { project, wide, flip: false };
  });
}

export function Projects() {
  const [active, setActive] = useState<Project | null>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  // Se muestran todos, en el orden de data/projects.ts (ver PROYECTOS.md para agregar uno)
  const list = projects;
  const slots = arrange(list);
  const lenis = useLenis();

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setActive(null);
    // Con el detalle abierto, la página de fondo no se mueve
    lenis?.stop();
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [active, lenis]);

  return (
    <section id="proyectos" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionTitle
          align="split"
          eyebrow="Nuestros proyectos"
          title={<>Proyectos que ya están funcionando</>}
          description="Sistemas y sitios que diseñamos, desarrollamos y hoy están en uso. Hacé clic en cualquiera para ver el caso completo."
        />

        <motion.div layout className="grid gap-5 md:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {slots.map(({ project: p, wide, flip }, i) => (
              <motion.button
                layout
                layoutId={`project-card-${p.slug}`}
                // El formato entra en la key: si un proyecto cambia de formato al filtrar, se vuelve a montar
                key={`${p.slug}-${wide ? (flip ? "wide-flip" : "wide") : "card"}`}
                initial={{ opacity: 0, y: 30, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, delay: wide ? 0 : (i % 2) * 0.08 }}
                onClick={() => setActive(p)}
                className={cn(
                  "card group flex flex-col overflow-hidden bg-surface text-left transition-colors hover:border-white/25",
                  wide && "md:col-span-2",
                )}
              >
                {/* En formato grande, imagen y texto van lado a lado (alternando de lado) */}
                <div
                  className={cn(
                    "w-full flex-1",
                    wide && "lg:grid",
                    wide && (flip ? "lg:grid-cols-[1fr_1.35fr]" : "lg:grid-cols-[1.35fr_1fr]"),
                  )}
                >
                  <motion.div
                    layoutId={`project-media-${p.slug}`}
                    className={cn(
                      "relative aspect-[16/10] overflow-hidden",
                      wide && "md:aspect-[2/1] lg:aspect-auto lg:min-h-[440px]",
                      wide && flip && "lg:order-2",
                    )}
                  >
                    <ProjectMockup project={p} />
                    <div
                      className={cn(
                        "absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent",
                        wide && "lg:from-transparent lg:via-transparent lg:via-70% lg:to-surface",
                        wide && (flip ? "lg:bg-gradient-to-l" : "lg:bg-gradient-to-r"),
                      )}
                    />
                    <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/50 px-3 py-1 text-xs text-zinc-300 backdrop-blur">
                      {p.category}
                    </span>
                    <span
                      className={cn(
                        "absolute right-4 top-4 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full bg-white text-black opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100",
                        wide && "lg:hidden",
                      )}
                    >
                      <ArrowUpRight className="h-5 w-5" />
                    </span>
                  </motion.div>

                  <div className={cn("p-6 sm:p-7", wide && "lg:flex lg:flex-col lg:justify-center lg:p-12")}>
                    <div className="mb-1 text-xs uppercase tracking-widest text-zinc-500">{p.client}</div>
                    <motion.h3
                      layoutId={`project-title-${p.slug}`}
                      className={cn("w-fit font-display text-2xl font-bold text-metal", wide && "lg:text-4xl")}
                    >
                      {p.title}
                    </motion.h3>
                    <p className={cn("mt-2 text-sm leading-relaxed text-muted", wide && "lg:mt-3 lg:text-base")}>{p.summary}</p>
                    {wide && (
                      <div className="mt-6 hidden gap-2.5 lg:grid">
                        {p.results.map((r) => (
                          <div key={r} className="flex items-center gap-2.5 text-sm text-zinc-300">
                            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                            {r}
                          </div>
                        ))}
                      </div>
                    )}
                    <div className={cn("mt-5 flex flex-wrap gap-2", wide && "lg:mt-7")}>
                      {p.tags.map((t) => (
                        <span key={t} className="rounded-full border border-line px-2.5 py-1 text-xs text-zinc-400">
                          {t}
                        </span>
                      ))}
                    </div>
                    {wide && (
                      <div className="mt-8 hidden items-center gap-2 text-sm font-semibold text-white lg:flex">
                        Ver caso completo
                        <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </div>
                    )}
                  </div>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>

        <div className="mt-12 text-center">
          <p className="mb-4 text-zinc-400">¿Tu proyecto podría ser el próximo?</p>
          <Button
            href={whatsappUrl("¡Hola! Vi sus proyectos y quiero hacer algo similar.")}
            external
            icon={<WhatsAppIcon className="h-4 w-4" />}
          >
            Quiero algo así
          </Button>
        </div>
      </div>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {active && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[70] flex items-end justify-center bg-black/80 p-0 backdrop-blur-md sm:items-center sm:p-6"
                onClick={() => setActive(null)}
              >
                <motion.div
                  role="dialog"
                  aria-modal="true"
                  aria-label={active.title}
                  layoutId={`project-card-${active.slug}`}
                  transition={{ type: "spring", stiffness: 260, damping: 32 }}
                  onClick={(e) => e.stopPropagation()}
                  data-lenis-prevent
                  className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-3xl border border-line bg-surface sm:rounded-3xl"
                >
                  <button
                    onClick={() => setActive(null)}
                    aria-label="Cerrar"
                    className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur hover:bg-black"
                  >
                    <X className="h-5 w-5" />
                  </button>
                  <motion.div layoutId={`project-media-${active.slug}`} className="group relative aspect-[16/9] overflow-hidden">
                    <ProjectMockup project={active} />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent" />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: 0.15, duration: 0.35 } }}
                    exit={{ opacity: 0, transition: { duration: 0.1 } }}
                    className="p-6 sm:p-10"
                  >
                    <div className="text-xs uppercase tracking-widest text-zinc-500">
                      {active.client} · {active.category}
                    </div>
                    <motion.h3 layoutId={`project-title-${active.slug}`} className="mt-1 w-fit font-display text-3xl font-bold text-metal sm:text-4xl">
                      {active.title}
                    </motion.h3>
                    <div className="mt-8 grid gap-6 sm:grid-cols-2">
                      <div>
                        <h4 className="mb-2 text-sm font-semibold uppercase tracking-widest text-zinc-400">El desafío</h4>
                        <p className="text-sm leading-relaxed text-zinc-300">{active.problem}</p>
                      </div>
                      <div>
                        <h4 className="mb-2 text-sm font-semibold uppercase tracking-widest text-zinc-400">La solución</h4>
                        <p className="text-sm leading-relaxed text-zinc-300">{active.solution}</p>
                      </div>
                    </div>
                    {(() => {
                      // Todas las capturas: las de compu (o de la app) y las de la versión para celular
                      const phone = active.category === "Mobile";
                      const shots = [
                        ...(active.images ?? []).map((src) => ({ src, phone })),
                        ...(active.mobileImages ?? []).map((src) => ({ src, phone: true })),
                      ];
                      if (shots.length < 2) return null;
                      return (
                        <>
                          <h4 className="mb-3 mt-8 text-sm font-semibold uppercase tracking-widest text-zinc-400">Capturas</h4>
                          {/* Tira deslizable con todas las capturas */}
                          <div className="-mx-6 flex snap-x snap-mandatory items-start gap-3 overflow-x-auto px-6 pb-2 sm:-mx-10 sm:px-10">
                            {shots.map((shot, i) => (
                              <div
                                key={`${i}-${shot.src}`}
                                className={`relative shrink-0 snap-start overflow-hidden rounded-xl border border-line bg-zinc-900 ${
                                  shot.phone ? "aspect-[9/19.5] w-36 sm:w-44" : "aspect-[16/10] w-72 sm:w-96"
                                }`}
                              >
                                <Image
                                  src={shot.src}
                                  alt={`${active.title}, captura ${i + 1}`}
                                  fill
                                  sizes="384px"
                                  className="object-cover object-top"
                                />
                              </div>
                            ))}
                          </div>
                        </>
                      );
                    })()}
                    <h4 className="mb-3 mt-8 text-sm font-semibold uppercase tracking-widest text-zinc-400">Resultados</h4>
                    <div className="grid gap-3 sm:grid-cols-3">
                      {active.results.map((r) => (
                        <div key={r} className="flex items-center gap-2 rounded-xl border border-line bg-white/[0.03] p-3 text-sm text-white">
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" /> {r}
                        </div>
                      ))}
                    </div>
                    <div className="mt-8 flex flex-wrap gap-3">
                      <Button
                        href={whatsappUrl(`¡Hola! Vi el proyecto "${active.title}" y quiero algo similar.`)}
                        external
                        icon={<WhatsAppIcon className="h-4 w-4" />}
                      >
                        Quiero un proyecto así
                      </Button>
                      {active.url && (
                        <Button href={active.url} variant="ghost" external hoverIcon={<ArrowUpRight className="h-4 w-4" />}>
                          Ver en vivo
                        </Button>
                      )}
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </section>
  );
}

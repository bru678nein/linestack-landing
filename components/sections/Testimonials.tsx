import { Quote, Star } from "lucide-react";
import { GlowCard } from "@/components/ui/GlowCard";
import { Reveal } from "@/components/ui/Reveal";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { testimonials } from "@/data/content";

function Stars() {
  return (
    <div className="flex gap-0.5" aria-label="5 de 5 estrellas">
      {Array.from({ length: 5 }).map((_, k) => (
        <Star key={k} className="h-4 w-4 fill-white text-white" />
      ))}
    </div>
  );
}

export function Testimonials() {
  // El primero va en grande; el resto, en tarjetas chicas al costado
  const [featured, ...rest] = testimonials;

  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionTitle eyebrow="Testimonios" title={<>Lo que dicen quienes ya confiaron</>} />

        <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <Reveal>
            <GlowCard className="h-full overflow-hidden rounded-3xl p-8 sm:p-12">
              <Quote aria-hidden className="pointer-events-none absolute -right-6 -top-8 h-48 w-48 text-white/[0.04]" />
              <figure className="relative z-10 flex h-full flex-col">
                <Stars />
                <blockquote className="mt-8 flex-1 font-display text-2xl font-semibold leading-snug text-metal-soft sm:text-3xl lg:text-[2.5rem] lg:leading-[1.2]">
                  “{featured.quote}”
                </blockquote>
                <figcaption className="mt-10 flex items-center gap-4 border-t border-line pt-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-b from-zinc-200 to-zinc-500 font-display text-lg font-bold text-black">
                    {featured.name[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{featured.name}</div>
                    <div className="text-sm text-zinc-500">{featured.role}</div>
                  </div>
                </figcaption>
              </figure>
            </GlowCard>
          </Reveal>

          <div className="grid gap-4">
            {rest.map((t, i) => (
              <Reveal key={t.name} delay={0.1 + i * 0.1}>
                <GlowCard className="flex h-full flex-col rounded-3xl p-7">
                  <figure className="relative z-10 flex h-full flex-col">
                    <div className="mb-5 flex items-center justify-between">
                      <Stars />
                      <Quote aria-hidden className="h-6 w-6 text-zinc-700" />
                    </div>
                    <blockquote className="flex-1 leading-relaxed text-zinc-300">“{t.quote}”</blockquote>
                    <figcaption className="mt-6 flex items-center gap-3 border-t border-line pt-5">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-b from-zinc-200 to-zinc-500 font-display font-bold text-black">
                        {t.name[0]}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white">{t.name}</div>
                        <div className="text-xs text-zinc-500">{t.role}</div>
                      </div>
                    </figcaption>
                  </figure>
                </GlowCard>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

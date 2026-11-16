import Image from "next/image";
import type { Project } from "@/data/projects";

/** Captura de una app dentro de un marco de celular */
function PhoneShot({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  return (
    <div className={`w-[28%] min-w-[110px] max-w-[220px] device rounded-[28px] border border-white/15 bg-black p-1.5 shadow-2xl ${className}`}>
      <div className="relative aspect-[9/19.5] overflow-hidden device rounded-[22px] bg-zinc-900">
        <Image src={src} alt={alt} fill sizes="(min-width: 1024px) 18vw, 40vw" className="object-cover object-top" />
      </div>
    </div>
  );
}

/** Captura de una web dentro de una ventana de navegador */
function BrowserShot({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative mb-[-9%] flex aspect-[16/10] w-[86%] flex-col overflow-hidden rounded-t-xl border border-white/15 bg-black shadow-2xl transition-transform duration-700 group-hover:-translate-y-3">
      <div className="flex shrink-0 items-center gap-1.5 border-b border-white/10 bg-zinc-950 px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-white/20" />
        <span className="h-2 w-2 rounded-full bg-white/20" />
        <span className="h-2 w-2 rounded-full bg-white/20" />
        <span className="ml-3 h-3 flex-1 rounded bg-white/[0.06]" />
      </div>
      <div className="relative min-h-0 flex-1">
        <Image src={src} alt={alt} fill sizes="(min-width: 1024px) 55vw, 90vw" className="object-cover object-top" />
      </div>
    </div>
  );
}

/**
 * Mockup visual del proyecto. Con capturas reales las muestra dentro de un navegador (web) o de
 * celulares (mobile); sin capturas dibuja un ejemplo estilizado con los colores del proyecto.
 * Las medidas son relativas al contenedor, así llena bien tanto las tarjetas chicas como el formato grande.
 */
export function ProjectMockup({ project }: { project: Project }) {
  const [a, b] = project.accent;
  const images = project.images ?? [];
  const background = `radial-gradient(120% 90% at 50% 0%, ${a}33, transparent 60%), radial-gradient(80% 60% at 100% 100%, ${b}33, transparent 60%), #0b0b0c`;

  if (images.length) {
    const isMobile = project.category === "Mobile";
    return (
      <div className="absolute inset-0 flex items-end justify-center overflow-hidden" style={{ background }}>
        <div className="absolute inset-0 bg-grid opacity-50" />
        {isMobile ? (
          <div className="relative mb-[-12%] flex w-full items-start justify-center gap-[3%] transition-transform duration-700 group-hover:-translate-y-3">
            {images.slice(0, 3).map((src, i) => (
              <PhoneShot key={`${i}-${src}`} src={src} alt={`${project.title}, pantalla ${i + 1}`} className={i === 1 ? "mt-10" : ""} />
            ))}
          </div>
        ) : (
          <>
            <BrowserShot src={images[0]} alt={project.title} />
            {/* Si también hay versión para celular, un teléfono apoyado sobre la ventana */}
            {project.mobileImages?.[0] && (
              <PhoneShot
                src={project.mobileImages[0]}
                alt={`${project.title} en el celular`}
                className="absolute bottom-[-6%] right-[4%] w-[22%] min-w-[90px] transition-transform duration-700 group-hover:-translate-y-5"
              />
            )}
          </>
        )}
      </div>
    );
  }

  const isMobile = project.category === "Mobile";

  return (
    <div className="absolute inset-0 flex items-end justify-center overflow-hidden" style={{ background }}>
      <div className="absolute inset-0 bg-grid opacity-50" />
      {isMobile ? (
        <div className="relative mb-[-14%] flex w-full items-start justify-center gap-[3%] transition-transform duration-700 group-hover:-translate-y-3">
          {[0, 1].map((i) => (
            <div
              key={i}
              className={`w-[26%] min-w-[112px] device rounded-[26px] border border-white/15 bg-black/80 p-2 shadow-2xl ${i === 1 ? "mt-10 opacity-80" : ""}`}
            >
              <div className="mx-auto mb-2 h-1.5 w-10 rounded-full bg-white/15" />
              <div className="aspect-[9/17] overflow-hidden device rounded-[20px] p-3" style={{ background: `linear-gradient(160deg, ${a}55, ${b}22 60%, #0b0b0c)` }}>
                <div className="mb-3 h-3 w-16 rounded bg-white/70" />
                <div className="mb-4 h-2 w-10 rounded bg-white/30" />
                {[0, 1, 2, 3].map((k) => (
                  <div key={k} className="mb-2 flex items-center gap-2 rounded-xl bg-white/10 p-2">
                    <div className="h-6 w-6 shrink-0 rounded-lg" style={{ background: k % 2 ? b : a }} />
                    <div className="flex-1 space-y-1">
                      <div className="h-1.5 w-3/4 rounded bg-white/40" />
                      <div className="h-1.5 w-1/2 rounded bg-white/20" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="relative mb-[-9%] flex aspect-[16/10] w-[86%] flex-col rounded-t-xl border border-white/15 bg-black/80 shadow-2xl transition-transform duration-700 group-hover:-translate-y-3">
          <div className="flex shrink-0 items-center gap-1.5 border-b border-white/10 px-3 py-2">
            <span className="h-2 w-2 rounded-full bg-white/20" />
            <span className="h-2 w-2 rounded-full bg-white/20" />
            <span className="h-2 w-2 rounded-full bg-white/20" />
            <span className="ml-3 h-3 flex-1 rounded bg-white/[0.06]" />
          </div>
          <div className="grid min-h-0 flex-1 grid-cols-[1fr_3.4fr] gap-3 p-3">
            {/* Menú lateral */}
            <div className="space-y-2">
              <div className="mb-3 h-4 w-4 rounded" style={{ background: `linear-gradient(135deg, ${a}, ${b})` }} />
              {[0, 1, 2, 3, 4].map((k) => (
                <div key={k} className="h-2 rounded bg-white/15" style={{ width: `${92 - k * 11}%` }} />
              ))}
            </div>
            {/* Contenido */}
            <div className="flex min-h-0 flex-col gap-3">
              <div className="h-3 w-1/2 shrink-0 rounded" style={{ background: `linear-gradient(90deg, ${a}, ${b})` }} />
              <div className="grid shrink-0 grid-cols-3 gap-2">
                {[0, 1, 2].map((k) => (
                  <div key={k} className="h-10 rounded-lg border border-white/10 bg-white/[0.04] p-1.5 lg:h-12">
                    <div className="h-1.5 w-1/2 rounded bg-white/30" />
                    <div className="mt-2 h-2.5 w-3/4 rounded" style={{ background: k % 2 ? b : a, opacity: 0.8 }} />
                  </div>
                ))}
              </div>
              <div className="grid min-h-0 flex-1 gap-2 sm:grid-cols-[2fr_1fr]">
                {/* Gráfico: el contenedor interno es absoluto para que las barras tomen su alto en % */}
                <div className="relative rounded-lg border border-white/10 bg-white/[0.03]">
                  <div className="absolute inset-2 flex items-end gap-1.5">
                    {[40, 65, 45, 80, 60, 95, 70, 85].map((h, k) => (
                      <div
                        key={k}
                        className="flex-1 rounded-sm"
                        style={{ height: `${h}%`, background: `linear-gradient(to top, ${a}, ${b})`, opacity: 0.85 }}
                      />
                    ))}
                  </div>
                </div>
                {/* Listado (absoluto por la misma razón: no debe estirar el marco) */}
                <div className="relative hidden overflow-hidden rounded-lg border border-white/10 bg-white/[0.03] sm:block">
                  <div className="absolute inset-2 flex flex-col gap-2">
                    {[0, 1, 2, 3, 4, 5].map((k) => (
                      <div key={k} className="flex items-center gap-1.5">
                        <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: k % 2 ? b : a }} />
                        <span className="h-1.5 flex-1 rounded bg-white/20" style={{ maxWidth: `${95 - (k % 3) * 18}%` }} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

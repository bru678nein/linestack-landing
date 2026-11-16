"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { HeroStage } from "@/components/ui/HeroStage";
import { MetalText } from "@/components/ui/MetalText";
import { WhatsAppIcon } from "@/components/ui/WhatsApp";
import { whatsappUrl } from "@/config/site";

const words = ["negocio", "equipo", "marca", "idea"] as const;
// Proporción (ancho/alto) de cada imagen pre-procesada de public/hero/ (ver MetalText)
const wordRatios: Record<(typeof words)[number], number> = {
  negocio: 945 / 303,
  equipo: 829 / 303,
  marca: 806 / 303,
  idea: 539 / 303,
};
const ease = [0.21, 0.47, 0.32, 0.98] as const;

/**
 * Muestra el texto palabra por palabra, cada una pasando de desenfocada a nítida.
 * Arranca visible (solo desenfocada): si arrancara invisible, Google mediría que el título
 * —el elemento principal de la pantalla— tarda en aparecer, y eso empeora la puntuación de velocidad.
 */
function BlurWords({ text, className, start = 0 }: { text: string; className?: string; start?: number }) {
  const list = text.split(" ");
  return (
    <>
      {list.map((w, i) => (
        <motion.span
          key={i}
          initial={{ y: 14, filter: "blur(12px)" }}
          animate={{ y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.7, delay: start + i * 0.08, ease }}
          className={`inline-block ${className ?? ""}`}
        >
          {w}
          {i < list.length - 1 && " "}
        </motion.span>
      ))}
    </>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const [word, setWord] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setWord((w) => (w + 1) % words.length), 2800);
    return () => clearInterval(id);
  }, []);

  return (
    <section ref={ref} id="inicio" className="relative overflow-hidden pt-24 sm:pt-28 lg:pt-32">
      {/* Fondo de estudio: luz gris suave detrás del logo que se mueve con la luz (ver HeroStage) */}
      <div aria-hidden className="hero-studio pointer-events-none absolute inset-0" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-6 px-4 pb-20 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:gap-8 lg:pb-28">
        <div className="relative z-10 text-center lg:text-left">
          {/*
            La palabra que rota es metal líquido (MetalText), igual que el logo; el resto del título va en
            gris para que ella sea la protagonista. El h1 real lleva la frase una sola vez, oculto a la
            vista; la versión animada va afuera del h1 como decoración, así Google no lee el título dos veces.
          */}
          <h1 className="sr-only">Software que hace crecer tu negocio, capa por capa.</h1>
          <div
            aria-hidden
            className="font-display text-[2.1rem] font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-[4.2rem] xl:text-7xl"
          >
            <span className="block sm:whitespace-nowrap">
              <BlurWords text="Software que hace" className="text-zinc-500" start={0.15} />
            </span>
            <span className="block whitespace-nowrap">
              <BlurWords text="crecer tu" className="text-zinc-500" start={0.39} />{" "}
              <MetalText text={`${words[word]},`} src={`/hero/${words[word]}.webp`} ratio={wordRatios[words[word]]} />
            </span>
            <span className="block">
              <BlurWords text="capa por capa." className="text-zinc-500" start={0.7} />
            </span>
          </div>

          {/* Visible desde el inicio (solo se desliza): en celular este párrafo es el elemento más grande de la pantalla */}
          <motion.p
            initial={{ y: 12 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mx-auto mt-6 max-w-xl text-base text-muted sm:text-lg lg:mx-0"
          >
            Diseñamos y construimos aplicaciones web, apps móviles y sistemas a medida. Con avances
            visibles cada semana, precio cerrado y un equipo que se queda con vos después del lanzamiento.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start"
          >
            <Button href={whatsappUrl()} external icon={<WhatsAppIcon className="h-4 w-4" />}>
              Contanos tu proyecto
            </Button>
            <Button href="#proyectos" variant="ghost">
              Ver proyectos
            </Button>
          </motion.div>
        </div>

        {/* En celular el logo va arriba del texto, para que se vea apenas entrás */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="relative order-first mx-auto mt-8 aspect-square w-full max-w-[230px] sm:mt-4 lg:mt-0 sm:max-w-[320px] lg:order-none lg:max-w-[540px]"
        >
          <HeroStage className="h-full w-full" />
        </motion.div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </section>
  );
}

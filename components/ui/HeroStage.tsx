"use client";

import type { PaperShaderElement } from "@paper-design/shaders";
import { useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";
import { LiquidLogo } from "@/components/ui/LiquidLogo";
import { registerHeroShader, setHeroShaderAngle } from "./heroLight";

/**
 * "Estudio" del hero: el logo de metal líquido iluminado como una foto de producto, con una luz que
 * se puede mover.
 * - Con mouse: la luz sigue al cursor; el fondo se ilumina donde está, el logo se inclina en 3D
 *   hacia ella y los reflejos del metal cambian de dirección.
 * - Sin mouse (celular): la luz recorre lentamente una órbita sola.
 * Todo corre en un único requestAnimationFrame que escribe variables CSS y uniforms del shader,
 * sin re-renderizar React. Se pausa cuando el hero no está en pantalla.
 */

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export function HeroStage({ className = "" }: { className?: string }) {
  const stage = useRef<HTMLDivElement>(null);
  const shader = useRef<PaperShaderElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => registerHeroShader(shader), []);

  useEffect(() => {
    const el = stage.current;
    const section = el?.closest("section");
    if (!el || !section || reduced) return;

    // Posición de la luz normalizada (-1 a 1) respecto del centro del logo
    const target = { x: 0.35, y: -0.25 };
    const cur = { x: 0.35, y: -0.25 };
    let lastPointer = -Infinity;
    let visible = true;
    let raf = 0;
    const t0 = performance.now();

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      target.x = Math.max(-1, Math.min(1, (e.clientX - cx) / (window.innerWidth * 0.5)));
      target.y = Math.max(-1, Math.min(1, (e.clientY - cy) / (window.innerHeight * 0.5)));
      lastPointer = performance.now();
    };

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;

      // Sin cursor reciente: órbita lenta automática
      if (now - lastPointer > 2500) {
        const t = (now - t0) / 1000;
        target.x = Math.sin(t * 0.35) * 0.65;
        target.y = Math.cos(t * 0.27) * 0.4 - 0.15;
      }
      cur.x = lerp(cur.x, target.x, 0.06);
      cur.y = lerp(cur.y, target.y, 0.06);

      // Luz del fondo (en % de la sección), inclinación del logo y sombra en el piso
      const s = section.style;
      s.setProperty("--light-x", `${66 + cur.x * 22}%`);
      s.setProperty("--light-y", `${42 + cur.y * 26}%`);
      el.style.setProperty("--tilt-x", `${(-cur.y * 9).toFixed(2)}deg`);
      el.style.setProperty("--tilt-y", `${(cur.x * 12).toFixed(2)}deg`);
      el.style.setProperty("--shadow-x", `${(-cur.x * 18).toFixed(1)}px`);

      // Reflejos del metal (logo y título): el ángulo de las franjas gira hacia la luz
      setHeroShaderAngle(70 + cur.x * 28 + cur.y * 14);
    };

    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
    io.observe(section);
    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, [reduced]);

  return (
    <div ref={stage} className={`relative [perspective:1100px] ${className}`}>
      {/* Sombra de contacto en el piso: se corre al lado contrario de la luz */}
      <div
        aria-hidden
        className="absolute bottom-[4%] left-1/2 h-[9%] w-[58%] -translate-x-1/2 rounded-[50%] bg-black/80 blur-xl"
        style={{ transform: "translateX(calc(-50% + var(--shadow-x, 0px)))" }}
      />
      <div
        className="relative h-full w-full transition-transform duration-75 [transform-style:preserve-3d]"
        style={{ transform: "rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg))" }}
      >
        {/*
          Reflejo del logo en el piso (Chrome/Safari; en Firefox simplemente no aparece).
          Entre la base del logo y el borde del lienzo queda ~14% de margen; el reflejo se sube el doble
          (~28% del tamaño) para que nazca justo en la base: -64px / -89px / -146px según el ancho del hero.
        */}
        <LiquidLogo
          shaderRef={shader}
          className="h-full w-full [-webkit-box-reflect:below_-64px_linear-gradient(transparent_70%,rgb(0_0_0/0.26))] sm:[-webkit-box-reflect:below_-89px_linear-gradient(transparent_70%,rgb(0_0_0/0.26))] lg:[-webkit-box-reflect:below_-146px_linear-gradient(transparent_70%,rgb(0_0_0/0.26))]"
        />
      </div>
    </div>
  );
}

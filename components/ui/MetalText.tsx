"use client";

import {
  LiquidMetalShapes,
  ShaderFitOptions,
  defaultObjectSizing,
  getShaderColorFromString,
  liquidMetalFragmentShader,
  type PaperShaderElement,
} from "@paper-design/shaders";
import { ShaderMount } from "@paper-design/shaders-react";
import { useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { registerHeroShader } from "./heroLight";

/*
 * Una línea de texto en metal líquido (mismo shader que el logo).
 *
 * Se usa en la palabra que rota del título del hero.
 * Las imágenes de public/hero/*.webp son la palabra ya dibujada con Clash Display y pre-procesada para
 * el shader (igual que el logo: procesarlo en vivo traba la carga). Cada imagen tiene un margen del
 * 12% del tamaño de letra alrededor del texto y mide 1,377 veces el tamaño de letra de alto.
 * Si cambia el texto o la tipografía del título, hay que regenerarlas.
 *
 * Mientras el shader arranca (y si no hay WebGL) se ve el mismo texto en cromo CSS; también es el que
 * define el ancho de la línea.
 */

const IMAGE_HEIGHT_EM = 1.377;

const baseUniforms = {
  u_colorBack: getShaderColorFromString("#00000000"),
  u_colorTint: getShaderColorFromString("#e0f2fe"),
  u_isImage: true,
  u_shape: LiquidMetalShapes.none,
  // Más franjas y más suaves que en el logo, para que la palabra nunca quede entera en una franja oscura
  u_repetition: 3,
  u_softness: 0.3,
  u_shiftRed: 0.22,
  u_shiftBlue: 0.22,
  u_distortion: 0.06,
  u_contour: 0.15,
  u_angle: 70,
  u_fit: ShaderFitOptions.contain,
  u_scale: 1,
  u_rotation: 0,
  u_offsetX: 0,
  u_offsetY: 0,
  u_originX: defaultObjectSizing.originX,
  u_originY: defaultObjectSizing.originY,
  u_worldWidth: defaultObjectSizing.worldWidth,
  u_worldHeight: defaultObjectSizing.worldHeight,
};

type Props = {
  text: string;
  /** Imagen pre-procesada del texto */
  src: string;
  /** Ancho / alto de la imagen */
  ratio: number;
  /** Cuánto esperar antes de arrancar el shader (para escalonar las líneas) */
  delay?: number;
};

export function MetalText({ text, src, ratio, delay = 0 }: Props) {
  const reduced = useReducedMotion();
  const ref = useRef<PaperShaderElement>(null);
  const [state, setState] = useState<"wait" | "gl" | "off">("wait");
  // Cada cambio de imagen reinicia la animación de entrada alternando entre dos keyframes iguales,
  // sin desmontar el shader (desmontarlo crearía un contexto WebGL nuevo cada vez)
  const [swaps, setSwaps] = useState(0);
  const prevSrc = useRef(src);
  useEffect(() => {
    if (prevSrc.current !== src) {
      prevSrc.current = src;
      setSwaps((n) => n + 1);
    }
  }, [src]);

  useEffect(() => registerHeroShader(ref), []);

  // Arranca después de lo urgente de la carga, como el logo
  useEffect(() => {
    let ok = false;
    try {
      const c = document.createElement("canvas");
      ok = !!(c.getContext("webgl2") || c.getContext("webgl"));
    } catch {}
    if (!ok) {
      setState("off");
      return;
    }
    const t = setTimeout(() => setState("gl"), 500 + delay);
    return () => clearTimeout(t);
  }, [delay]);

  const gl = state === "gl";
  // Mismo objeto mientras no cambie la imagen: si no, cada render del hero recargaría la textura
  const uniforms = useMemo(() => ({ ...baseUniforms, u_image: src }), [src]);

  return (
    <span className="relative inline-block whitespace-nowrap">
      {/* Texto en cromo CSS: visible hasta que entra el metal líquido */}
      <span className={`text-metal transition-opacity duration-700 ${gl ? "opacity-0" : "opacity-100"}`}>{text}</span>
      {gl && (
        <span
          className="pointer-events-none absolute left-1/2 top-1/2 block -translate-x-1/2 -translate-y-1/2"
          style={{
            height: `${IMAGE_HEIGHT_EM}em`,
            width: `${IMAGE_HEIGHT_EM * ratio}em`,
            // Aparece con un desenfoque al arrancar y cada vez que cambia la palabra
            animation: `${swaps % 2 ? "metal-in-b" : "metal-in"} 0.7s ease-out both`,
          }}
        >
          <ShaderMount
            ref={ref}
            className="h-full w-full"
            fragmentShader={liquidMetalFragmentShader}
            uniforms={uniforms}
            mipmaps={["u_image"]}
            speed={reduced ? 0 : 0.7}
            maxPixelCount={900_000}
          />
        </span>
      )}
    </span>
  );
}

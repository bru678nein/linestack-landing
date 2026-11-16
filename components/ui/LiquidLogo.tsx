"use client";

import {
  LiquidMetalShapes,
  ShaderFitOptions,
  defaultObjectSizing,
  getShaderColorFromString,
  liquidMetalFragmentShader,
} from "@paper-design/shaders";
import { ShaderMount } from "@paper-design/shaders-react";
import type { PaperShaderElement } from "@paper-design/shaders";
import { useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { LogoMark } from "@/components/ui/Logo";

/*
 * El logo de LineStack en metal líquido (shader "Liquid Metal" de Paper).
 *
 * El componente <LiquidMetal> de la librería procesa la imagen del logo en el navegador cada vez
 * que carga la página (~0,7 s de pantalla trabada). Para evitarlo usamos el shader directamente con
 * la imagen ya procesada: public/logo-mark-liquid.webp (generada con toProcessedLiquidMetal a partir
 * de public/logo-mark.svg). Si cambia el logo, hay que volver a generarla.
 */

function canUseWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

const uniforms = {
  u_colorBack: getShaderColorFromString("#00000000"),
  u_colorTint: getShaderColorFromString("#dbeafe"),
  u_image: "/logo-mark-liquid.webp",
  u_isImage: true,
  u_shape: LiquidMetalShapes.none,
  u_repetition: 2.4,
  u_softness: 0.12,
  u_shiftRed: 0.25,
  u_shiftBlue: 0.25,
  u_distortion: 0.08,
  u_contour: 0.45,
  u_angle: 70,
  u_fit: ShaderFitOptions.contain,
  u_scale: 0.82,
  u_rotation: 0,
  u_offsetX: 0,
  u_offsetY: 0,
  u_originX: defaultObjectSizing.originX,
  u_originY: defaultObjectSizing.originY,
  u_worldWidth: defaultObjectSizing.worldWidth,
  u_worldHeight: defaultObjectSizing.worldHeight,
};

type Props = {
  className?: string;
  /**
   * Acceso al shader para cambiarle parámetros en vivo sin re-renderizar React
   * (ej: el ángulo de los reflejos según dónde está la luz). Ver HeroStage.
   */
  shaderRef?: React.Ref<PaperShaderElement>;
};

export function LiquidLogo({ className = "", shaderRef }: Props) {
  const reduced = useReducedMotion();
  const [state, setState] = useState<"wait" | "gl" | "fallback">("wait");

  // Arranca el shader cuando el navegador terminó lo urgente de la carga, así no compite con ella
  useEffect(() => {
    if (!canUseWebGL()) {
      setState("fallback");
      return;
    }
    const start = () => setState("gl");
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(start, { timeout: 900 });
      return () => window.cancelIdleCallback(id);
    }
    const t = setTimeout(start, 250);
    return () => clearTimeout(t);
  }, []);

  if (state === "fallback") {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <LogoMark className="h-[70%] w-[70%]" />
      </div>
    );
  }

  return (
    <div className={className}>
      {state === "gl" && (
        <ShaderMount
          ref={shaderRef}
          className="h-full w-full animate-[fade-in_0.8s_ease-out_both]"
          fragmentShader={liquidMetalFragmentShader}
          uniforms={uniforms}
          mipmaps={["u_image"]}
          speed={reduced ? 0 : 0.8}
          // Tope de resolución: en celulares con pantallas muy densas no hace falta más
          maxPixelCount={1_400_000}
        />
      )}
    </div>
  );
}

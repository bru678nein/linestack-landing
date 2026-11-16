import type { PaperShaderElement } from "@paper-design/shaders";

/**
 * Registro de los shaders de metal líquido del hero (logo y título). HeroStage mueve la luz y,
 * en cada cuadro, gira los reflejos de todos los shaders registrados para que se muevan juntos.
 */
const shaders = new Set<React.RefObject<PaperShaderElement | null>>();

export function registerHeroShader(ref: React.RefObject<PaperShaderElement | null>) {
  shaders.add(ref);
  return () => {
    shaders.delete(ref);
  };
}

export function setHeroShaderAngle(angle: number) {
  for (const ref of shaders) ref.current?.paperShaderMount?.setUniforms({ u_angle: angle });
}

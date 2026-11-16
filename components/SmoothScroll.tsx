"use client";

import { ReactLenis } from "lenis/react";
import "lenis/dist/lenis.css";

/**
 * Scroll suave en toda la página. Los links internos (#servicios, etc.) también se deslizan
 * y respetan el scroll-margin de cada sección. Con "reducir movimiento" activado, Lenis se apaga solo.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis root options={{ lerp: 0.1, anchors: true, autoRaf: true }}>
      {children}
    </ReactLenis>
  );
}

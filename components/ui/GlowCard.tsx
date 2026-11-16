"use client";

import { useRef } from "react";

type Props = React.HTMLAttributes<HTMLDivElement>;

/** Card con borde luminoso que sigue al cursor */
export function GlowCard({ className = "", children, ...rest }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  return (
    <div ref={ref} onMouseMove={onMove} className={`glow-card ${className}`} {...rest}>
      {children}
    </div>
  );
}

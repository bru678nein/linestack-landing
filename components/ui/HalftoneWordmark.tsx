"use client";

import { useEffect, useRef } from "react";

type Dot = {
  hx: number; // posición de reposo
  hy: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number; // radio (halftone: según cobertura)
  base: [number, number, number];
  heat: number; // 0..1, se "enciende" al moverse
};

type Props = {
  text?: string;
  /** Cantidad de letras iniciales que van en gris (como "LINE" en el logo) */
  dimChars?: number;
  className?: string;
};

const DIM: [number, number, number] = [138, 138, 144];
const BRIGHT: [number, number, number] = [244, 244, 245];
const HOT: [number, number, number] = [125, 211, 252]; // azul hielo

const SPRING = 0.075;
const DAMPING = 0.84;
const POINTER_R = 110;
const POINTER_FORCE = 2.4;

/**
 * Wordmark gigante en puntos halftone, cortado por el borde inferior.
 * Los puntos se apartan del cursor con física de resortes y se tiñen al moverse;
 * un clic envía una onda expansiva por las letras.
 */
export function HalftoneWordmark({ text = "LINESTACK", dimChars = 4, className = "" }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let dots: Dot[] = [];
    let W = 0;
    let H = 0;
    let dpr = 1;
    let raf = 0;
    let visible = false;
    let running = false;
    const pointer = { x: -9999, y: -9999, active: false };
    const shocks: { x: number; y: number; r: number; life: number }[] = [];

    // Usa la fuente display de la página (Montserrat cargada por next/font)
    const probe = document.createElement("span");
    probe.className = "font-display";
    probe.style.position = "absolute";
    probe.style.visibility = "hidden";
    document.body.appendChild(probe);
    const fontFamily = getComputedStyle(probe).fontFamily || "sans-serif";
    probe.remove();

    function build() {
      const rect = wrap!.getBoundingClientRect();
      W = Math.max(1, Math.floor(rect.width));
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      // Tamaño de fuente para que el texto ocupe todo el ancho
      const off = document.createElement("canvas");
      const octx = off.getContext("2d", { willReadFrequently: true })!;
      octx.font = `800 100px ${fontFamily}`;
      const measured = octx.measureText(text).width;
      const fontSize = (100 * (W * 0.98)) / measured;
      // Alto recortado: se ve la parte superior de las letras, el borde inferior las corta
      H = Math.round(fontSize * 0.66);
      const baseline = H + fontSize * 0.1;

      canvas!.width = W * dpr;
      canvas!.height = H * dpr;
      canvas!.style.height = `${H}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      off.width = W;
      off.height = H;
      octx.font = `800 ${fontSize}px ${fontFamily}`;
      octx.textBaseline = "alphabetic";
      octx.fillStyle = "#fff";
      const textW = octx.measureText(text).width;
      const startX = (W - textW) / 2;
      octx.fillText(text, startX, baseline);
      const splitX = startX + octx.measureText(text.slice(0, dimChars)).width;

      const img = octx.getImageData(0, 0, W, H).data;
      const step = W < 640 ? 5 : W < 1100 ? 6 : 7;
      const maxR = step * 0.46;
      const next: Dot[] = [];
      for (let y = step / 2; y < H; y += step) {
        for (let x = step / 2; x < W; x += step) {
          // Cobertura promedio de la celda -> radio del punto (efecto halftone)
          let sum = 0;
          let n = 0;
          for (let oy = -1; oy <= 1; oy++) {
            for (let ox = -1; ox <= 1; ox++) {
              const sx = Math.min(W - 1, Math.max(0, Math.round(x + ox * step * 0.3)));
              const sy = Math.min(H - 1, Math.max(0, Math.round(y + oy * step * 0.3)));
              sum += img[(sy * W + sx) * 4 + 3];
              n++;
            }
          }
          const cov = sum / n / 255;
          if (cov < 0.08) continue;
          // Leve degradado vertical: los puntos de abajo son un poco más chicos
          const fade = 1 - (y / H) * 0.25;
          next.push({
            hx: x,
            hy: y,
            x,
            y,
            vx: 0,
            vy: 0,
            r: Math.max(0.6, maxR * Math.sqrt(cov) * fade),
            base: x < splitX ? DIM : BRIGHT,
            heat: 0,
          });
        }
      }
      dots = next;
      draw();
    }

    function draw() {
      ctx!.clearRect(0, 0, W, H);
      for (const d of dots) {
        const h = d.heat;
        const r = d.base[0] + (HOT[0] - d.base[0]) * h;
        const g = d.base[1] + (HOT[1] - d.base[1]) * h;
        const b = d.base[2] + (HOT[2] - d.base[2]) * h;
        ctx!.fillStyle = `rgb(${r | 0},${g | 0},${b | 0})`;
        ctx!.beginPath();
        ctx!.arc(d.x, d.y, d.r * (1 + h * 0.25), 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    function step() {
      let energy = 0;
      for (let s = shocks.length - 1; s >= 0; s--) {
        shocks[s].r += 14;
        shocks[s].life -= 0.022;
        if (shocks[s].life <= 0) shocks.splice(s, 1);
      }

      for (const d of dots) {
        // Resorte hacia la posición de reposo
        d.vx += (d.hx - d.x) * SPRING;
        d.vy += (d.hy - d.y) * SPRING;

        // Repulsión del cursor
        if (pointer.active) {
          const dx = d.x - pointer.x;
          const dy = d.y - pointer.y;
          const dist2 = dx * dx + dy * dy;
          if (dist2 < POINTER_R * POINTER_R && dist2 > 0.01) {
            const dist = Math.sqrt(dist2);
            const f = (1 - dist / POINTER_R) ** 2 * POINTER_FORCE;
            d.vx += (dx / dist) * f;
            d.vy += (dy / dist) * f;
          }
        }

        // Onda expansiva del clic
        for (const sh of shocks) {
          const dx = d.hx - sh.x;
          const dy = d.hy - sh.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const band = Math.abs(dist - sh.r);
          if (band < 30) {
            const f = (1 - band / 30) * 3.2 * sh.life;
            d.vx += (dx / dist) * f;
            d.vy += (dy / dist) * f;
          }
        }

        d.vx *= DAMPING;
        d.vy *= DAMPING;
        d.x += d.vx;
        d.y += d.vy;

        const speed = Math.abs(d.vx) + Math.abs(d.vy);
        d.heat = Math.min(1, Math.max(d.heat * 0.94, speed / 6));
        energy += speed + d.heat;
      }
      draw();
      return energy > 0.5 || pointer.active || shocks.length > 0;
    }

    function loop() {
      const busy = step();
      if (busy && visible) {
        raf = requestAnimationFrame(loop);
      } else {
        running = false;
      }
    }

    function kick() {
      if (reduced || running || !visible) return;
      running = true;
      raf = requestAnimationFrame(loop);
    }

    const toLocal = (e: PointerEvent) => {
      const rect = canvas!.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onMove = (e: PointerEvent) => {
      const p = toLocal(e);
      pointer.x = p.x;
      pointer.y = p.y;
      pointer.active = true;
      kick();
    };
    const onLeave = () => {
      pointer.active = false;
      kick();
    };
    const onDown = (e: PointerEvent) => {
      const p = toLocal(e);
      shocks.push({ x: p.x, y: p.y, r: 0, life: 1 });
      kick();
    };

    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);
    canvas.addEventListener("pointerdown", onDown);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) kick();
    });
    io.observe(wrap);

    let resizeTimer: ReturnType<typeof setTimeout>;
    const ro = new ResizeObserver(() => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(build, 120);
    });
    ro.observe(wrap);

    let cancelled = false;
    document.fonts.ready.then(() => !cancelled && build());

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      clearTimeout(resizeTimer);
      io.disconnect();
      ro.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("pointerdown", onDown);
    };
  }, [text, dimChars]);

  return (
    <div ref={wrapRef} className={`relative w-full select-none ${className}`}>
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={text}
        className="block w-full cursor-crosshair touch-pan-y"
      />
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import {
  cubicBezier,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";

/* ------------------------------------------------------------------ *
 * LayerStack
 *
 * The process section as the brand mark assembling itself. Four slabs
 * start scattered and, as the reader moves through the four steps, each
 * one settles into its slot until the group is exactly the Linestack
 * logo: four stacked isometric slabs running light to deep navy.
 *
 * The motion says one thing: separate layers become one ordered stack.
 * That is what the process does and what the mark is, so the animation
 * carries meaning rather than decoration.
 *
 * The slab geometry is hand-authored SVG on purpose. It is the brand
 * mark itself, four rhombi, not a decorative illustration.
 * ------------------------------------------------------------------ */

export type LayerStep = {
  title: string;
  body: string;
};

type LayerStackProps = {
  steps: LayerStep[];
  /** Light to dark, one entry per step. Defaults to the Linestack ramp. */
  ramp?: string[];
  className?: string;
};

const DEFAULT_RAMP = ["#d7e6f2", "#9dc0dc", "#4a7fae", "#123a63"];

/* Design canvas for the mark. The SVG scales to its container, so every
   number below is in viewBox units and stays correct at any size.
   The canvas is deliberately wider than the assembled mark: an SVG clips
   at its viewBox, so the scattered slabs need room or they get cut. */
const CANVAS = 480;
const SLAB_HALF_W = 150;
const SLAB_HALF_H = 32;
const SLAB_PITCH = 80;

const EASE = cubicBezier(0.16, 1, 0.3, 1);

/** Where a slab waits before it is called into the stack. Deterministic:
 *  alternating sides, spread top to bottom, so any step count works. */
function scatterFor(index: number, total: number) {
  const side = index % 2 === 0 ? -1 : 1;
  const spread = total > 1 ? index / (total - 1) : 0.5;
  return {
    x: side * (78 + (index % 3) * 14),
    y: -150 + spread * 300,
    rotate: side * (9 + (index % 3) * 4),
  };
}

/** Final slot: the group is vertically centred on the canvas. */
function slotY(index: number, total: number) {
  return (index - (total - 1) / 2) * SLAB_PITCH;
}

const slabPath = [
  `M ${CANVAS / 2} ${CANVAS / 2 - SLAB_HALF_H}`,
  `L ${CANVAS / 2 + SLAB_HALF_W} ${CANVAS / 2}`,
  `L ${CANVAS / 2} ${CANVAS / 2 + SLAB_HALF_H}`,
  `L ${CANVAS / 2 - SLAB_HALF_W} ${CANVAS / 2}`,
  "Z",
].join(" ");

type SlabProps = {
  index: number;
  total: number;
  color: string;
  progress: MotionValue<number>;
  animate: boolean;
};

function Slab({ index, total, color, progress, animate }: SlabProps) {
  const from = scatterFor(index, total);
  const to = slotY(index, total);

  /* Each slab lands during its own step, so arrival and reading stay in
     sync. The last slab finishes before the section releases. */
  const start = (index / total) * 0.78;
  const end = start + 0.3;
  const range: [number, number] = [start, end];
  const options = { ease: EASE };

  const x = useTransform(progress, range, [from.x, 0], options);
  const y = useTransform(progress, range, [from.y, to], options);
  const rotate = useTransform(progress, range, [from.rotate, 0], options);
  const opacity = useTransform(progress, range, [0.28, 1], options);
  const scale = useTransform(progress, range, [0.84, 1], options);

  /* Hooks always run; only the applied style changes. Reduced motion and
     small screens get the assembled mark with no scroll binding. */
  const style = animate
    ? { x, y, rotate, opacity, scale }
    : { x: 0, y: to, rotate: 0, opacity: 1, scale: 1 };

  return (
    <motion.path
      d={slabPath}
      fill={color}
      style={{
        ...style,
        transformBox: "fill-box",
        transformOrigin: "center",
        willChange: animate ? "transform, opacity" : undefined,
      }}
    />
  );
}

export function LayerStack({ steps, ramp = DEFAULT_RAMP, className }: LayerStackProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const total = steps.length;

  /* Desktop only: below lg the sticky column would eat the viewport, so
     the mark renders assembled above the list instead. Starts false so
     server and client first paint agree. */
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => setIsDesktop(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const animate = isDesktop && !reduce;

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  /* One state write per step, not per frame. Continuous values stay in
     motion values; this only flips which step reads as current. */
  const [active, setActive] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const next = Math.min(total - 1, Math.max(0, Math.floor(value * total)));
    setActive((prev) => (prev === next ? prev : next));
  });

  return (
    <section className={className} aria-labelledby="layerstack-heading">
      <div className="mx-auto w-full max-w-[1240px] px-5 sm:px-8 lg:px-14">
        <h2
          id="layerstack-heading"
          className="max-w-[16ch] text-[clamp(1.9rem,1.3rem+2.4vw,2.85rem)] font-bold leading-[1.02] tracking-[-0.03em] text-ink"
          style={{ fontVariationSettings: '"wdth" 112' }}
        >
          Cuatro capas, en este orden.
        </h2>

        <div
          ref={trackRef}
          className="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-[1fr_0.85fr] lg:gap-20"
        >
          {/* Mark. Sticky beside the steps on desktop, assembled and static
              above them on mobile. Order swaps so it reads first on small
              screens without moving in the DOM for assistive tech. */}
          <div className="order-first lg:order-last">
            <div className="lg:sticky lg:top-28">
              <svg
                viewBox={`0 0 ${CANVAS} ${CANVAS}`}
                className="mx-auto w-full max-w-[280px] lg:max-w-[420px]"
                role="img"
                aria-label={`Las cuatro capas del proceso, ordenadas como el logotipo de Linestack: ${steps
                  .map((s) => s.title)
                  .join(", ")}.`}
              >
                {steps.map((step, i) => (
                  <Slab
                    key={step.title}
                    index={i}
                    total={total}
                    color={ramp[i % ramp.length]}
                    progress={scrollYProgress}
                    animate={animate}
                  />
                ))}
              </svg>
            </div>
          </div>

          {/* Steps. Tall on desktop so the scroll distance comes from real
              content instead of an empty spacer. */}
          <ol className="order-last m-0 list-none p-0 lg:order-first">
            {steps.map((step, i) => {
              const current = !animate || i === active;
              return (
                <li
                  key={step.title}
                  className="border-t border-line py-8 first:border-t-0 first:pt-0 lg:flex lg:min-h-[58vh] lg:flex-col lg:justify-center lg:border-t-0 lg:py-0"
                >
                  <div
                    className="flex items-start gap-5 transition-opacity duration-500 ease-out motion-reduce:transition-none"
                    style={{ opacity: current ? 1 : 0.42 }}
                  >
                    <span
                      aria-hidden="true"
                      className="mt-3 h-[10px] w-[10px] shrink-0"
                      style={{ backgroundColor: ramp[i % ramp.length] }}
                    />
                    <div>
                      <h3
                        className="text-[clamp(1.35rem,1.15rem+0.8vw,1.7rem)] font-bold leading-[1.15] tracking-[-0.03em] text-ink"
                        style={{ fontVariationSettings: '"wdth" 112' }}
                      >
                        {step.title}
                      </h3>
                      <p className="mt-4 max-w-[52ch] text-[1.0625rem] leading-relaxed text-ink-2">
                        {step.body}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

export default LayerStack;

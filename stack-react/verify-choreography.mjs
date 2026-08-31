// Verifies the LayerStack scroll choreography using Motion's own pure
// interpolation, mirroring exactly what useTransform does at runtime.
import { interpolate, cubicBezier } from "motion";

const CANVAS = 480;
const SLAB_PITCH = 80;
const EASE = cubicBezier(0.16, 1, 0.3, 1);
const TOTAL = 4;

function scatterFor(index, total) {
  const side = index % 2 === 0 ? -1 : 1;
  const spread = total > 1 ? index / (total - 1) : 0.5;
  return {
    x: side * (78 + (index % 3) * 14),
    y: -150 + spread * 300,
    rotate: side * (9 + (index % 3) * 4),
  };
}
const slotY = (i, total) => (i - (total - 1) / 2) * SLAB_PITCH;

function slabAt(index, progress) {
  const from = scatterFor(index, TOTAL);
  const to = slotY(index, TOTAL);
  const start = (index / TOTAL) * 0.78;
  const end = start + 0.3;
  const range = [start, end];
  const o = { ease: EASE };
  return {
    start, end,
    x: interpolate(range, [from.x, 0], o)(progress),
    y: interpolate(range, [from.y, to], o)(progress),
    rotate: interpolate(range, [from.rotate, 0], o)(progress),
    opacity: interpolate(range, [0.28, 1], o)(progress),
    scale: interpolate(range, [0.84, 1], o)(progress),
  };
}

const r2 = (n) => Math.round(n * 100) / 100;
let failures = 0;
const check = (label, cond, detail) => {
  if (!cond) { failures++; console.log(`FAIL  ${label}  ${detail ?? ""}`); }
  else console.log(`ok    ${label}`);
};

console.log("--- slot geometry (final formation = the logo) ---");
const slots = [...Array(TOTAL)].map((_, i) => slotY(i, TOTAL));
console.log("slotY:", slots.join(", "));
check("slots are evenly pitched", slots.every((v, i, a) => i === 0 || r2(v - a[i - 1]) === SLAB_PITCH));
check("formation is vertically centred", r2(slots.reduce((a, b) => a + b, 0)) === 0);

console.log("\n--- arrival windows ---");
for (let i = 0; i < TOTAL; i++) {
  const { start, end } = slabAt(i, 0);
  console.log(`slab ${i}: ${r2(start)} -> ${r2(end)}`);
}
check("last slab lands before the section releases", slabAt(TOTAL - 1, 0).end <= 1,
  `end=${r2(slabAt(TOTAL - 1, 0).end)}`);
check("slabs land in reading order",
  [...Array(TOTAL)].every((_, i) => i === 0 || slabAt(i, 0).end > slabAt(i - 1, 0).end));

console.log("\n--- endpoints ---");
for (let i = 0; i < TOTAL; i++) {
  const at0 = slabAt(i, 0);
  const at1 = slabAt(i, 1);
  const scat = scatterFor(i, TOTAL);
  check(`slab ${i} starts scattered`,
    r2(at0.x) === r2(scat.x) && r2(at0.y) === r2(scat.y) && r2(at0.rotate) === r2(scat.rotate),
    JSON.stringify({ x: r2(at0.x), y: r2(at0.y), r: r2(at0.rotate) }));
  check(`slab ${i} ends in its logo slot`,
    r2(at1.x) === 0 && r2(at1.y) === r2(slots[i]) && r2(at1.rotate) === 0 &&
    r2(at1.opacity) === 1 && r2(at1.scale) === 1,
    JSON.stringify({ x: r2(at1.x), y: r2(at1.y), r: r2(at1.rotate), o: r2(at1.opacity), s: r2(at1.scale) }));
}

console.log("\n--- no slab drifts outside the canvas while scattered ---");
const SLAB_HALF_W = 150, SLAB_HALF_H = 32;
for (let i = 0; i < TOTAL; i++) {
  let worst = 0;
  for (let p = 0; p <= 1.0001; p += 0.01) {
    const s = slabAt(i, p);
    const cx = CANVAS / 2 + s.x, cy = CANVAS / 2 + s.y;
    worst = Math.max(worst,
      -(cx - SLAB_HALF_W * s.scale), (cx + SLAB_HALF_W * s.scale) - CANVAS,
      -(cy - SLAB_HALF_H * s.scale), (cy + SLAB_HALF_H * s.scale) - CANVAS);
  }
  console.log(`slab ${i} max overflow past viewBox edge: ${r2(worst)}px`);
}

console.log("\n--- active step mapping ---");
const activeFor = (v) => Math.min(TOTAL - 1, Math.max(0, Math.floor(v * TOTAL)));
[0, 0.24, 0.26, 0.51, 0.76, 1].forEach((v) => console.log(`  progress ${v} -> step ${activeFor(v)}`));
check("active index never leaves range",
  [0, 0.5, 1, 1.2, -0.1].every((v) => activeFor(v) >= 0 && activeFor(v) < TOTAL));

console.log(failures === 0 ? "\nALL CHECKS PASSED" : `\n${failures} CHECK(S) FAILED`);
process.exit(failures === 0 ? 0 : 1);

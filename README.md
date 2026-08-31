# Linestack landing

Landing page for Linestack, a software studio building web apps and landing pages.

## What is here

| Path | What it is |
|---|---|
| `index.html` | The landing page. One self-contained file: no build step, no dependencies, open it in a browser. |
| `stack-react/` | A Vite sandbox holding `LayerStack.tsx`, the process section as a React component. Built to develop and verify the animation. Not wired to the landing. |

## The process section

The four process steps are the brand mark assembling itself. Four slabs start
scattered and settle into their slots on scroll until the group is exactly the
Linestack logo: separate layers becoming one ordered stack.

`index.html` drives this with CSS scroll-driven animations. Firefox and
LibreWolf have no `animation-timeline` yet, so a small script drives the same
`@keyframes` for them instead: the animations run paused and it picks the frame
with a negative `animation-delay`. No motion value is restated in JavaScript,
and there is no scroll listener. `stack-react/` drives the same choreography
with Motion's `useScroll`.

Three rules keep it working:

- **The assembled logo is the default state.** Every animation only describes
  how the page arrives there, which is what lets browsers without
  `animation-timeline` show a correct mark instead of a broken section.
- **`.process` must keep `align-items: stretch`.** With `align-items: start` the
  mark column shrinks to the height of the SVG and the sticky element unsticks
  almost immediately.
- **The stagger lives in `--r0` and `--r1` only.** The native timeline
  multiplies them into `animation-range` percentages and the fallback into a
  delay, so the arrival windows are authored once.

The geometry constants are duplicated across `index.html`,
`stack-react/src/components/LayerStack.tsx` and
`stack-react/verify-choreography.mjs`. Changing the scatter or the slab size
means changing all three.

## Running things

The landing needs no tooling. Open `index.html`.

The React sandbox:

```bash
npm install --prefix stack-react
npm run dev --prefix stack-react
```

The choreography check runs the animation math through Motion's own
interpolation in Node. It asserts that no slab ever leaves the SVG viewBox,
which is how the first version's clipping bug was caught:

```bash
node stack-react/verify-choreography.mjs
```

## Before this goes live

The page ships with drafted content that is not confirmed:

- **Commercial terms** in the pricing section (fixed price, 50/50 payments, no
  mandatory retainer, 48 hour response) are plausible copy, not agreed terms.
- **`hola@linestack.dev`** is a placeholder address.
- **Both photographs** are `picsum.photos` placeholders with unrelated subjects.
  That service was returning 503 at the time of writing, so they may render as
  empty boxes until replaced.
- **The project cards still need screenshots.** The first card points at the live
  Trainets site; the other two are templates waiting for a real name, a line
  saying what the project solves, and a URL. Every card renders a reserved frame
  until a real screenshot replaces it. Add or remove `<article class="demo">`
  blocks freely; the rail takes any count.
- **The contact form has no endpoint.** `FORM_ENDPOINT` is `null`, so it
  validates and shows the confirmation locally while warning in the console.
- **Fonts load from the Google Fonts CDN.** Self-host them for production.
- **The logo is a rebuilt SVG**, not the official asset.

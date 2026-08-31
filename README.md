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
- **The hero photograph is missing.** The slot renders a reserved frame and the
  `<img>` sits commented above it, ready to uncomment. The shot is two screens
  showing the same work: a design open on one, that same screen running on the
  other. It has to compose **vertically**, because the slot is 4:5 on desktop:
  shoot at an angle with one screen nearer than the other rather than straight
  on. It is the LCP element, so keep `fetchpriority="high"` and never add
  `loading="lazy"` to it.
- **The third project card is still a template.** Trainets and Blend Burger are
  real, with captured screenshots and live links. The remaining card waits for a
  name, a line saying what the project solves, and a screenshot; it uses the
  no-URL variant, since the project it is held for is a desktop app. Delete it
  rather than shipping it empty. Add or remove `<article class="demo">` blocks
  freely; the rail takes any count.
- **Screenshots are captured headless at 1600x1000**, the aspect the card
  renders at, then encoded to WebP. Crop the frame above any hosting badge the
  provider injects.
- **The contact form has no endpoint.** `FORM_ENDPOINT` is `null`, so it
  validates and shows the confirmation locally while warning in the console.
- **Fonts load from the Google Fonts CDN.** Self-host them for production.
- **The logo is a rebuilt SVG**, not the official asset. That applies to the nav
  mark, the process section and `img/favicon.svg`.
- **The favicon is a reduction of the mark, not a copy of it.** The nav geometry
  smudges below 24px, so the favicon uses thicker slabs, wider gaps, wider tonal
  steps, and a navy plate: the brand ramp runs light to deep navy, and without a
  plate the deep end disappears on light browser chrome and the light end on
  dark. Re-render the `.ico` and the touch icon from the SVG if the mark
  changes.

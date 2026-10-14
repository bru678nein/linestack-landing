# Linestack landing

Landing page for Linestack, a software studio building web apps and landing pages.

## What is here

| Path | What it is |
|---|---|
| `index.html` | The landing page. One self-contained file: no build step, no dependencies, open it in a browser. |
| `api/contact.js` | Vercel serverless function behind the brief form. Validates the submission and emails it through Brevo. No dependencies. |
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

- **Commercial terms** in the pricing section (fixed price, 50/50 payments, 48
  hour response) are plausible copy, not agreed terms. The maintenance model
  is confirmed: monthly maintenance (hosting, updates, backups, small changes)
  is the default after launch, the first thirty days are included, and the
  client can hand the project to another team instead. The monthly price and
  the cancellation terms still have to be stated in every quote.
- **The hero is a collage of three shipped projects**, stacked back to front
  in the same staircase as the brand mark. It uses `img/hero-*.webp`, 800px
  variants of the work-rail screenshots sized for the slot, so the hero does
  not pull the 1600px files on first paint. The step geometry lives in
  `--fw`/`--dx`/`--dy` on `.collage`, solved so the front frame lands on the
  slot's bottom-right corner in both the 4:5 desktop and 4:3 mobile slots;
  change one value and re-solve the others. The front frame is the LCP
  element: keep `fetchpriority="high"` on it and never add `loading="lazy"`
  to any of the three.
- **The work rail holds four real projects.** Trainets and Blend Burger link
  to live sites, FoodStore links to its public repository, and VulnScan uses
  the no-URL variant (an anchorless card with a factual note) because it runs
  only in a local lab. Add or remove `<article class="demo">` blocks freely;
  the rail takes any count.
- **Screenshots are captured headless at 1600x1000**, the aspect the card
  renders at, then encoded to WebP. Crop the frame above any hosting badge the
  provider injects.
- **The contact form posts to `api/contact.js`**, which emails the brief to
  `contacto@linestack.com.ar` through Brevo, with the visitor as reply-to. It
  needs three things outside the repo before a submission arrives:
  - `BREVO_API_KEY` set in the Vercel project's environment variables.
  - `linestack.com.ar` authenticated as a sender domain in Brevo (its DNS
    records added in Cloudflare), since the sender is
    `contacto@linestack.com.ar`.
  - MX records for `linestack.com.ar`, so the inbox can receive mail at all.
  The visitor chooses email or WhatsApp. Email posts to the function.
  WhatsApp never reaches the server: the submit opens
  `wa.me/5492612094560` with the brief already written ("Hola, soy ...
  Quiero pedir un presupuesto para ..."), and the confirmation offers the
  same link in case the browser blocked the new window. The number lives in
  `WHATSAPP_NUMBER` in the inline script and in the fallback link's `href`.
  The function re-validates every field, rejects unknown project types,
  escapes visitor input before it reaches the HTML body, and silently drops
  submissions that fill the off-screen `company` honeypot. The project types
  are listed in both the `<select>` and `KINDS` in the function: keep them in
  sync. The static local server (`python3 -m http.server`) cannot run the
  function, so a local submission shows the error state; set `FORM_ENDPOINT`
  to `null` to review the success flow without sending.
- **Fonts load from the Google Fonts CDN.** Self-host them for production.
- **The logo is a rebuilt SVG**, not the official asset. That applies to the nav
  mark, the process section and `img/favicon.svg`.
- **`favicon.ico` is duplicated at the repo root.** Browsers, bookmark stores,
  crawlers and link-preview bots request `/favicon.ico` directly, without ever
  reading the `<link>` tags, so the root copy answers them. The tags themselves
  use root-absolute paths so they survive being served from any route. Re-copy
  the root file from `img/` when the mark changes.
- **The `.ico` tag comes before the SVG tag.** A browser that cannot read SVG
  icons takes the first `rel="icon"` it understands, so leading with the SVG
  leaves it with nothing; browsers that do read SVG still prefer it because of
  the `type` hint. Keep that order.
- **The favicon is a reduction of the mark, not a copy of it.** The nav geometry
  smudges below 24px, so the favicon uses thicker slabs, wider gaps, wider tonal
  steps, and a navy plate: the brand ramp runs light to deep navy, and without a
  plate the deep end disappears on light browser chrome and the light end on
  dark. Re-render the `.ico` and the touch icon from the SVG if the mark
  changes.

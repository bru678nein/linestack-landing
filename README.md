# Linestack landing

Marketing site for Linestack, a software studio in Mendoza. Next.js 15 (App Router), Tailwind CSS 4
and Framer Motion, deployed on Vercel at `www.linestack.com.ar`.

## Running it

```bash
npm install
npm run dev
```

Open http://localhost:3000. `npm run build` checks that the production build compiles.

## Where things live

| Path | What it is |
|---|---|
| `config/site.ts` | Name, domain, contact email, phone, WhatsApp number and social profiles. Every page reads these from here. |
| `data/projects.ts` | Portfolio projects, in page order. See `PROYECTOS.md` to add one. |
| `data/services.ts` | Services, written as client situations, and the project types offered in the contact form. |
| `data/content.ts` | Guarantees, process steps, FAQ and testimonials. |
| `app/api/contact/route.ts` | Contact form endpoint. Validates the submission and emails it through Brevo. |
| `components/Analytics.tsx` | Google Analytics 4 and the `generate_lead` event. |

## Contact form

The form posts to `/api/contact`, which emails the message to `contacto@linestack.com.ar` through
Brevo's transactional API, with the visitor as reply-to. It needs `BREVO_API_KEY` set in the Vercel
project's environment variables; never commit it. The sender is `contacto@linestack.com.ar`, so
`linestack.com.ar` must stay authenticated as a sender domain in Brevo.

Without the key the endpoint answers 500 and the form shows an error with a WhatsApp fallback. It
never reports success for a message that went nowhere. Locally there is no key, so a submission
always shows that error.

The hidden `company` field is a honeypot: submissions that fill it get a fake success and are
dropped.

## WhatsApp

Every WhatsApp button builds its link with `whatsappUrl()` from `config/site.ts`, so the number
(`5492612094560`, international format without `+`) is changed in one place.

## Analytics

GA4 (`G-S84D52M61H`) loads only on `www.linestack.com.ar`, so local previews and the vercel.app
mirrors stay out of the reports. The site sends GA4's `generate_lead` event with:

- `contact_channel: "email"` after the server confirms the form was sent, with `project_kind` set to
  the project type chosen.
- `contact_channel: "whatsapp"` when any WhatsApp link is clicked. That is intent: the chat opened,
  not that a message was sent.

Both parameters must be registered as custom dimensions in GA4 to show up in reports. Never send
personal data (name, email, message) in an event.

## Before publishing changes

- **Testimonials are placeholders.** The ones in `data/content.ts` are invented, so the section is
  left out of `app/page.tsx`. Put it back only with real quotes the client agreed to publish.
- **Texts marked `BORRADOR`** in `data/projects.ts` were written from screenshots. Check them
  against the real projects.
- **Guarantees and FAQ answers are commitments.** `data/content.ts` says it: list only what the
  team actually delivers.
- **Social profiles** in `config/site.ts` are empty until the studio has real accounts. The footer
  and the structured data only show the ones that exist.

## Deployment

Vercel builds the site on every push; `main` is production. `vercel.json` pins the framework preset
to Next.js, because the project was first imported as a static site.

// Vercel serverless function: receives the brief form and emails it to the
// studio inbox through Brevo's transactional email API.
//
// Required environment variable, set in the Vercel project settings and never
// committed:
//   BREVO_API_KEY   Brevo v3 API key.
//
// SENDER must be an address on a domain authenticated in Brevo, otherwise
// Brevo rejects the send or the message lands in spam. INBOX must be able to
// receive mail (the domain needs MX records).
//
// No dependencies: Node's global fetch is enough, so the repo keeps no
// package.json and the landing keeps no build step.

const BREVO_URL = "https://api.brevo.com/v3/smtp/email";
const INBOX = "contacto@linestack.com.ar";
const SENDER = { email: "contacto@linestack.com.ar", name: "Linestack Web" };

// Mirrors the options of <select id="f-kind"> in index.html. A value that is
// not here is rejected, so adding an option means adding it in both places.
const KINDS = {
  agent: "Un agente que responda mensajes",
  automation: "Una automatización",
  website: "Una página web",
  webapp: "Una web app",
  ecommerce: "Un e-commerce",
  application: "Una aplicación móvil o de escritorio",
  rework: "Rehacer algo que ya existe",
  unsure: "Todavía no lo tengo claro",
};

// Mirrors the channel radios in index.html.
const CHANNELS = {
  email: "Email",
  whatsapp: "WhatsApp",
};

// Same rule the form applies client-side, re-checked here because the client
// can be bypassed.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Best-effort wa.me link for an Argentine number as people type it ("261 555
// 1234", "+54 9 261 555 1234", "0261 555 1234"). WhatsApp needs 54 9 plus
// the area code and number. Anything that does not fit that shape gets no
// link, and the number is still in the email as typed, so nothing is lost.
function whatsappLink(phone) {
  let digits = phone.replace(/\D/g, "");
  if (digits.startsWith("549") && digits.length === 13) return `https://wa.me/${digits}`;
  if (digits.startsWith("54")) digits = digits.slice(2);
  if (digits.startsWith("0")) digits = digits.slice(1);
  return digits.length === 10 ? `https://wa.me/549${digits}` : "";
}

function clean(value, max) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

// Brevo requires htmlContent, and every field here is visitor input, so it is
// escaped before it goes anywhere near HTML.
function escapeHtml(text) {
  return text.replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[c]);
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "method_not_allowed" });
  }

  const body = req.body && typeof req.body === "object" ? req.body : {};

  // Honeypot: the field is invisible to people and bots tend to fill it.
  // Answer as if the send worked so the bot learns nothing.
  if (clean(body.company, 200)) {
    return res.status(200).json({ ok: true });
  }

  // Newlines are stripped from the name because it ends up in the subject.
  const name = clean(body.name, 120).replace(/[\r\n]+/g, " ");
  const kind = clean(body.kind, 40);
  const detail = clean(body.detail, 4000);
  // The visitor picks how to be contacted. A page cached from before the
  // channel field existed sends no channel, which means email.
  const channel = clean(body.channel, 20) || "email";

  if (name.length < 2 || !Object.hasOwn(KINDS, kind) || !Object.hasOwn(CHANNELS, channel)) {
    return res.status(400).json({ error: "invalid_fields" });
  }

  let email = "";
  let phone = "";
  if (channel === "email") {
    email = clean(body.email, 254);
    if (!EMAIL_RE.test(email)) return res.status(400).json({ error: "invalid_fields" });
  } else {
    phone = clean(body.phone, 40).replace(/[\r\n]+/g, " ");
    const digits = phone.replace(/\D/g, "").length;
    if (digits < 8 || digits > 15) return res.status(400).json({ error: "invalid_fields" });
  }

  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.error("[contact] BREVO_API_KEY is not set");
    return res.status(500).json({ error: "not_configured" });
  }

  const kindLabel = KINDS[kind];
  const chatLink = phone ? whatsappLink(phone) : "";
  const contactLines = channel === "email"
    ? [`Email: ${email}`]
    : [`WhatsApp: ${phone}`, chatLink ? `Abrir chat: ${chatLink}` : "Abrir chat: revisá el número, no se pudo armar el link."];
  const text = [
    `Nombre: ${name}`,
    `Prefiere que lo contacten por: ${CHANNELS[channel]}`,
    ...contactLines,
    `Qué necesita: ${kindLabel}`,
    "",
    "Contexto:",
    detail || "(sin contexto)",
  ].join("\n");

  // The wa.me URL is built only from digits, so it is safe to turn into a
  // link after the rest of the text has been escaped.
  const html = escapeHtml(text)
    .replace(/https:\/\/wa\.me\/\d+/, (url) => `<a href="${url}">${url}</a>`)
    .replace(/\n/g, "<br>");

  try {
    const response = await fetch(BREVO_URL, {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        sender: SENDER,
        to: [{ email: INBOX }],
        // Replying to the notification answers the visitor, not the inbox.
        // A WhatsApp brief has no address to reply to, so it carries none.
        ...(email ? { replyTo: { email, name: name.slice(0, 70) } } : {}),
        subject: `Nuevo brief: ${kindLabel} - ${name}${channel === "whatsapp" ? " (por WhatsApp)" : ""}`,
        textContent: text,
        htmlContent: `<p>${html}</p>`,
      }),
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      console.error("[contact] Brevo responded", response.status, await response.text());
      return res.status(502).json({ error: "send_failed" });
    }
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("[contact] Brevo request failed", error);
    return res.status(502).json({ error: "send_failed" });
  }
};

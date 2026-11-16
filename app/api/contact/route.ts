import { NextResponse } from "next/server";
import { site } from "@/config/site";

// Sends the contact form to the studio inbox through Brevo's transactional email API.
//
// Required environment variable, set in the Vercel project settings and never committed:
//   BREVO_API_KEY   Brevo v3 API key.
//
// The sender must be an address on a domain authenticated in Brevo (linestack.com.ar is),
// otherwise Brevo rejects the send or the message lands in spam.
const BREVO_URL = "https://api.brevo.com/v3/smtp/email";
const SENDER = { email: site.email, name: "LineStack Web" };

const escape = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });
  }

  const str = (k: string, max = 2000) => String(body[k] ?? "").trim().slice(0, max);
  // Newlines are stripped from fields that end up in the subject line.
  const name = str("name", 120).replace(/[\r\n]+/g, " ");
  const email = str("email", 200);
  const message = str("message", 5000);
  const type = str("type", 100).replace(/[\r\n]+/g, " ");
  const budget = str("budget", 100);

  // Honeypot: a bot filled the hidden field. Answer as if it worked so it learns nothing.
  if (str("company")) return NextResponse.json({ ok: true });

  if (name.length < 2) return NextResponse.json({ error: "Ingresá tu nombre." }, { status: 400 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email))
    return NextResponse.json({ error: "Ingresá un email válido." }, { status: 400 });
  if (message.length < 10)
    return NextResponse.json({ error: "Contanos un poco más sobre tu proyecto." }, { status: 400 });

  // Without a key the message cannot reach anyone, so the visitor must not see a success.
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.error("[contacto] BREVO_API_KEY is not set");
    return NextResponse.json({ error: "No pudimos enviar el mensaje. Probá por WhatsApp." }, { status: 500 });
  }

  const text = [
    `Nombre: ${name}`,
    `Email: ${email}`,
    `Tipo de proyecto: ${type}`,
    `Presupuesto: ${budget}`,
    "",
    "Mensaje:",
    message,
  ].join("\n");

  try {
    const res = await fetch(BREVO_URL, {
      method: "POST",
      headers: { "api-key": apiKey, "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify({
        sender: SENDER,
        to: [{ email: site.email }],
        // Replying to the notification answers the visitor, not the inbox.
        replyTo: { email, name: name.slice(0, 70) },
        subject: `Nuevo contacto: ${name} - ${type}`,
        textContent: text,
        htmlContent: `<p>${escape(text).replace(/\n/g, "<br>")}</p>`,
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      console.error("[contacto] Brevo responded", res.status, await res.text());
      throw new Error("send_failed");
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contacto] Error enviando email:", err);
    return NextResponse.json({ error: "No pudimos enviar el mensaje. Probá por WhatsApp." }, { status: 502 });
  }
}

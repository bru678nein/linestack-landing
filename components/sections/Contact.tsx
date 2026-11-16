"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, ChevronDown, Loader2, Mail, Send } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { trackLead } from "@/components/Analytics";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { WhatsAppIcon } from "@/components/ui/WhatsApp";
import { site, whatsappUrl } from "@/config/site";
import { projectTypes, type ProjectType } from "@/data/services";

const types = projectTypes;
const budgets = ["A definir", "Menos de USD 2.000", "USD 2.000 – 5.000", "USD 5.000 – 15.000", "Más de USD 15.000"];

type Status = "idle" | "loading" | "success" | "error";

const field =
  "w-full rounded-xl border border-line bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-white/40 focus:bg-white/[0.05] focus:ring-4 focus:ring-white/5";

export function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [type, setType] = useState<ProjectType>(types[0]);

  // Si viene desde Servicios (/contacto?tipo=...), deja ese tipo de proyecto ya elegido
  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get("tipo");
    const match = types.find((x) => x === t);
    if (match) setType(match);
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    data.type = type;
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "No pudimos enviar el mensaje.");
      // Reported only after the server confirmed the send. Only the project type travels.
      trackLead("email", type);
      setStatus("success");
      form.reset();
      toast.success("Mensaje enviado", { description: "Te respondemos en menos de 24 h hábiles." });
    } catch (err) {
      setStatus("error");
      toast.error("No pudimos enviar el mensaje", {
        description: err instanceof Error ? err.message : "Probá de nuevo o escribinos por WhatsApp.",
        action: { label: "WhatsApp", onClick: () => window.open(whatsappUrl(), "_blank", "noopener") },
      });
    }
  }

  return (
    <section id="contacto" className="relative pb-24 pt-32 sm:pb-32 sm:pt-40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
          <div>
            <SectionTitle
              align="left"
              as="h1"
              eyebrow="Contacto"
              title={<>Hablemos de tu proyecto</>}
              description="Respondemos en menos de 24 h hábiles. La primera reunión es gratis."
              className="mb-8"
            />
            <Reveal className="flex flex-col gap-4">
              <a
                href={whatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 rounded-3xl border border-[#25D366]/30 bg-[#25D366]/[0.07] p-6 transition hover:border-[#25D366]/60 hover:bg-[#25D366]/[0.12]"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#25D366] text-white">
                  <WhatsAppIcon className="h-6 w-6" />
                </span>
                <span>
                  <span className="block font-display text-lg font-semibold text-white">WhatsApp</span>
                  <span className="text-sm text-zinc-400">La forma más rápida de hablar con nosotros</span>
                </span>
              </a>
              <a
                href={`mailto:${site.email}`}
                className="group flex items-center gap-4 card p-6 transition hover:border-white/25"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-black">
                  <Mail className="h-5 w-5" />
                </span>
                <span>
                  <span className="block font-display text-lg font-semibold text-white">Email</span>
                  <span className="text-sm text-zinc-400">{site.email}</span>
                </span>
              </a>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <form onSubmit={onSubmit} className="card overflow-hidden bg-surface p-6 sm:p-8">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium text-zinc-400">Nombre *</span>
                  <input name="name" required minLength={2} placeholder="Tu nombre" className={field} autoComplete="name" />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium text-zinc-400">Email *</span>
                  <input name="email" type="email" required placeholder="vos@empresa.com" className={field} autoComplete="email" />
                </label>
              </div>

              <fieldset className="mt-5">
                <legend className="mb-2 text-xs font-medium text-zinc-400">¿Qué necesitás?</legend>
                <div className="flex flex-wrap gap-2">
                  {types.map((t) => (
                    <button
                      type="button"
                      key={t}
                      onClick={() => setType(t)}
                      aria-pressed={type === t}
                      className={`rounded-full border px-3.5 py-1.5 text-sm transition ${
                        type === t ? "border-white bg-white text-black" : "border-line text-zinc-400 hover:border-white/30 hover:text-white"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </fieldset>

              <label className="mt-5 block">
                <span className="mb-1.5 block text-xs font-medium text-zinc-400">Presupuesto estimado</span>
                <span className="relative block">
                  <select name="budget" className={`${field} cursor-pointer appearance-none pr-10`} defaultValue={budgets[0]}>
                    {budgets.map((b) => (
                      <option key={b} className="bg-surface">
                        {b}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                </span>
              </label>

              <label className="mt-5 block">
                <span className="mb-1.5 block text-xs font-medium text-zinc-400">Contanos tu proyecto *</span>
                <textarea
                  name="message"
                  required
                  minLength={10}
                  rows={5}
                  placeholder="¿Qué querés construir? ¿Qué problema querés resolver?"
                  className={`${field} resize-none`}
                />
              </label>

              {/* honeypot anti-spam */}
              <input name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

              <Button
                type="submit"
                disabled={status === "loading"}
                size="lg"
                className="mt-6 w-full"
                icon={status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : undefined}
                hoverIcon={<Send className="h-4 w-4" />}
              >
                {status === "loading" ? "Enviando..." : "Enviar mensaje"}
              </Button>

              <p className="mt-4 text-center text-xs text-zinc-500">
                Al enviar aceptás nuestra{" "}
                <Link href="/privacidad" className="underline underline-offset-4 hover:text-white">
                  política de privacidad
                </Link>
                .
              </p>

              <AnimatePresence>
                {status === "success" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex flex-col items-center justify-center bg-surface/95 p-8 text-center backdrop-blur"
                  >
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.1 }}>
                      <CheckCircle2 className="h-14 w-14 text-ice" />
                    </motion.div>
                    <h3 className="mt-4 font-display text-2xl font-bold text-white">¡Mensaje enviado!</h3>
                    <p className="mt-2 max-w-sm text-zinc-400">Gracias por escribirnos. Te respondemos en menos de 24 h hábiles.</p>
                    <button onClick={() => setStatus("idle")} type="button" className="mt-6 text-sm text-zinc-300 underline underline-offset-4">
                      Enviar otro mensaje
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

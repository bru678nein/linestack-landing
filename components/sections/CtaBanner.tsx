import { Button } from "@/components/ui/Button";
import { LogoMark } from "@/components/ui/Logo";
import { Reveal } from "@/components/ui/Reveal";
import { WhatsAppIcon } from "@/components/ui/WhatsApp";
import { whatsappUrl } from "@/config/site";

export function CtaBanner() {
  return (
    <section id="empezar" className="px-4 py-12 sm:px-6">
      <Reveal className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-white/15 bg-gradient-to-b from-zinc-900 to-black px-6 py-16 text-center sm:px-12 sm:py-24">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-40 [mask-image:radial-gradient(ellipse_at_center,#000,transparent_70%)]" />
        <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/20 blur-[100px]" />
        <div className="relative">
          <LogoMark className="mx-auto mb-8 h-16 w-16 animate-float" />
          <h2 className="mx-auto max-w-3xl font-display text-3xl font-extrabold leading-tight text-metal sm:text-5xl">
            Tu próximo gran proyecto empieza con una conversación
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-muted sm:text-lg">
            Contanos tu idea y en menos de 48 h te devolvemos una propuesta con alcance, tiempos y precio cerrado. Sin compromiso.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href={whatsappUrl()} external icon={<WhatsAppIcon className="h-4 w-4" />}>
              Escribinos por WhatsApp
            </Button>
            <Button href="/contacto" variant="ghost">
              Completar formulario
            </Button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

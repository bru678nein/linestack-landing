import Link from "next/link";
import { ArrowUp } from "lucide-react";
import { HalftoneWordmark } from "@/components/ui/HalftoneWordmark";
import { Logo } from "@/components/ui/Logo";
import { navLinks, site, whatsappUrl } from "@/config/site";

export function Footer() {
  return (
    <footer className="relative mt-12 border-t border-line">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-sm text-sm text-zinc-500">{site.description}</p>
        </div>
        <div>
          <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-zinc-400">Navegación</h4>
          <ul className="space-y-2 text-sm">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-zinc-500 transition hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-zinc-400">Contacto</h4>
          <ul className="space-y-2 text-sm text-zinc-500">
            <li>
              <a href={`mailto:${site.email}`} className="transition hover:text-white">{site.email}</a>
            </li>
            <li>
              <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="transition hover:text-white">WhatsApp</a>
            </li>
            {Object.keys(site.socials).length > 0 && (
              <li className="flex gap-4 pt-2">
                {Object.entries(site.socials).map(([k, v]) => (
                  <a key={k} href={v} target="_blank" rel="noopener noreferrer" className="capitalize transition hover:text-white">
                    {k}
                  </a>
                ))}
              </li>
            )}
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-zinc-500 sm:flex-row sm:px-6">
          <span>© {new Date().getFullYear()} {site.name}. Todos los derechos reservados.</span>
          <Link href="/privacidad" className="transition hover:text-white">
            Política de privacidad
          </Link>
          <Link
            href="/#inicio"
            className="group inline-flex items-center gap-2 font-mono uppercase tracking-[0.25em] text-zinc-400 transition hover:text-white"
          >
            Volver arriba
            <ArrowUp className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
      {/* Wordmark gigante en halftone interactivo */}
      <div className="overflow-hidden px-2 pt-4">
        <HalftoneWordmark />
      </div>
    </footer>
  );
}

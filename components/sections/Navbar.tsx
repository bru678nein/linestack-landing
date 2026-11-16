"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { navLinks } from "@/config/site";

export function Navbar() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  const { scrollYProgress } = useScroll();

  // Al bajar se esconde para dejar más pantalla libre; al subir (aunque sea un poco) vuelve
  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 24);
    if (y < 160) setHidden(false);
    else if (y > prev + 4) setHidden(true);
    else if (y < prev - 4) setHidden(false);
  });

  // Resalta en el menú la sección que está en pantalla
  useEffect(() => {
    const ids = navLinks.filter((l) => l.href.includes("#")).map((l) => l.href.split("#")[1]);
    const els = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(`/#${e.target.id}`);
          else setActive((cur) => (cur === `/#${e.target.id}` ? "" : cur));
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  // En la página de contacto el link activo es "Contacto"
  const current = pathname === "/contacto" ? "/contacto" : active;

  return (
    <>
      {/* Barra de progreso: queda visible aunque el menú se esconda */}
      <motion.div
        aria-hidden
        style={{ scaleX: scrollYProgress }}
        className="fixed inset-x-0 top-0 z-[60] h-px origin-left bg-gradient-to-r from-white/0 via-white to-ice"
      />
      <motion.header
        animate={{ y: hidden && !open ? "-130%" : "0%" }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        onFocusCapture={() => setHidden(false)}
        className="fixed inset-x-0 top-0 z-50 px-3 pt-3"
      >
        <nav
          className={`mx-auto flex max-w-6xl items-center justify-between rounded-2xl px-4 py-3 transition-all duration-500 sm:px-5 ${
            scrolled
              ? "border border-line bg-black/60 shadow-[0_8px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl"
              : "border border-transparent"
          }`}
        >
          <Link href="/#inicio" aria-label="LineStack, inicio">
            <Logo />
          </Link>

          <ul className="hidden items-center gap-1 md:flex">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  aria-current={current === l.href ? "true" : undefined}
                  className={`relative rounded-full px-3.5 py-2 text-sm transition-colors hover:text-white ${
                    current === l.href ? "text-white" : "text-zinc-400"
                  }`}
                >
                  {current === l.href && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-white/[0.08]"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative">{l.label}</span>
                </Link>
              </li>
            ))}
          </ul>

          <Button href="/contacto" variant="ghost" size="sm" className="hidden md:inline-flex">
            Hablemos
          </Button>

          <button
            onClick={() => setOpen((o) => !o)}
            className="rounded-lg p-2 text-zinc-300 md:hidden"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mx-auto mt-2 max-w-6xl rounded-2xl border border-line bg-black/90 p-3 backdrop-blur-xl md:hidden"
            >
              {navLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={`block rounded-xl px-4 py-3 hover:bg-white/[0.06] ${
                    current === l.href ? "bg-white/[0.06] text-white" : "text-zinc-300"
                  }`}
                >
                  {l.label}
                </Link>
              ))}
              <Button href="/contacto" onClick={() => setOpen(false)} className="mt-2 w-full">
                Hablemos
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}

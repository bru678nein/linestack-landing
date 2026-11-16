import { Footer } from "@/components/sections/Footer";
import { Navbar } from "@/components/sections/Navbar";
import { Button } from "@/components/ui/Button";
import { LogoMark } from "@/components/ui/Logo";

export const metadata = { title: "Página no encontrada | LineStack" };

/** 404: misma estética del sitio y salida clara hacia el inicio o el contacto */
export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="relative flex min-h-[80svh] items-center overflow-hidden pt-24">
        <div className="pointer-events-none absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_60%_60%_at_50%_45%,#000_30%,transparent_100%)]" />
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <LogoMark className="mx-auto mb-8 h-14 w-14 opacity-80" />
          <p className="font-display text-[7rem] font-semibold leading-none text-chrome sm:text-[10rem]">404</p>
          <h1 className="mt-6 font-display text-2xl font-semibold text-white sm:text-4xl">Esta capa no existe</h1>
          <p className="mx-auto mt-4 max-w-md text-muted sm:text-lg">
            La página que buscás se movió o nunca estuvo acá. Volvé al inicio o contanos qué necesitás.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href="/">Volver al inicio</Button>
            <Button href="/contacto" variant="ghost">
              Ir a contacto
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

"use client";

import { Toaster as Sonner } from "sonner";

/** Avisos flotantes (envío del formulario, errores) con el estilo oscuro de la landing */
export function Toaster() {
  return (
    <Sonner
      theme="dark"
      position="bottom-center"
      offset={24}
      toastOptions={{
        classNames: {
          toast:
            "!rounded-2xl !border !border-white/10 !bg-[#111]/95 !text-white !shadow-2xl !backdrop-blur-md font-sans",
          description: "!text-zinc-400",
          actionButton: "!rounded-full !bg-white !text-black !font-semibold",
        },
      }}
    />
  );
}

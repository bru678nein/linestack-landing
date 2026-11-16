"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Bell, Check, CheckCircle2, ShoppingBag, Wrench } from "lucide-react";
import { useEffect, useState } from "react";
import type { Demo } from "@/data/services";

/**
 * Mini-demos animadas de cada servicio: muestran el servicio funcionando en vez de describirlo.
 * Son HTML + framer-motion (sin imágenes ni librerías extra) y corren en bucle mientras están visibles.
 */

/** Avanza un paso cada `ms` y vuelve a empezar. Con "reducir movimiento" queda fijo en el último paso. */
function useLoop(steps: number, ms: number) {
  const reduced = useReducedMotion();
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setStep((s) => (s + 1) % steps), ms);
    return () => clearInterval(id);
  }, [steps, ms, reduced]);
  return reduced ? steps - 1 : step;
}

/*
 * Ojo: `exit` solo en elementos dentro de su propio <AnimatePresence>. Un `exit` suelto queda
 * registrado en la animación de salida del panel de Servicios y, si el elemento se desmonta antes de
 * terminar (pasa con estos bucles), el panel nunca termina de salir y deja de cambiar.
 */
const pop = {
  initial: { opacity: 0, y: 8, scale: 0.96 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -6, scale: 0.98 },
  transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
};

/* ---------- Sistemas de gestión: turnos que se van confirmando ---------- */
function AgendaDemo() {
  const rows = [
    ["09:30", "Luna", "Vacuna"],
    ["11:00", "Toby", "Control"],
    ["15:30", "Mía", "Consulta"],
    ["17:00", "Rocco", "Control"],
  ];
  const step = useLoop(rows.length + 2, 1100);
  const confirmed = Math.min(step, rows.length);
  return (
    <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-zinc-950/80 p-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-widest text-zinc-500">Agenda de hoy</div>
          <div className="font-display text-sm font-semibold text-white">{rows.length} turnos</div>
        </div>
        <div className="text-right">
          <div className="text-[11px] uppercase tracking-widest text-zinc-500">Caja</div>
          <div className="font-display text-sm font-semibold tabular-nums text-emerald-300">
            ${(confirmed * 12500).toLocaleString("es-AR")}
          </div>
        </div>
      </div>
      <div className="space-y-1.5">
        {rows.map(([time, pet, kind], i) => {
          const ok = i < confirmed;
          return (
            <div key={time} className="flex items-center gap-3 rounded-lg bg-white/[0.04] px-3 py-2 text-xs">
              <span className="w-10 font-semibold tabular-nums text-ice">{time}</span>
              <span className="flex-1 text-zinc-200">
                {pet} <span className="text-zinc-500">· {kind}</span>
              </span>
              <motion.span
                key={ok ? "ok" : "pend"}
                initial={pop.initial}
                animate={pop.animate}
                transition={pop.transition}
                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                  ok ? "bg-emerald-400/15 text-emerald-300" : "bg-amber-400/10 text-amber-300"
                }`}
              >
                {ok ? "Confirmado" : "Pendiente"}
              </motion.span>
            </div>
          );
        })}
      </div>
      <div className="mt-auto pt-3">
        <motion.div
          key={confirmed >= rows.length ? "done" : "sync"}
          initial={pop.initial}
          animate={pop.animate}
          transition={pop.transition}
          className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-[11px] text-zinc-300"
        >
          <Bell className="h-3.5 w-3.5 text-ice" />
          {confirmed >= rows.length ? "Recordatorios enviados a los 4 clientes" : "Confirmando turnos…"}
        </motion.div>
      </div>
    </div>
  );
}

/* ---------- Web y e-commerce: producto al carrito y pago aprobado ---------- */
function StoreDemo() {
  const step = useLoop(5, 1200); // 0 producto, 1 botón presionado, 2 en el carrito, 3 pago, 4 pausa
  const inCart = step >= 2;
  return (
    <div className="relative flex h-full flex-col rounded-2xl border border-white/10 bg-zinc-950/80 p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm bg-gradient-to-br from-ice to-violet-400" />
          <span className="h-2 w-16 rounded bg-white/20" />
        </div>
        <div className="relative">
          <ShoppingBag className="h-5 w-5 text-zinc-300" />
          <AnimatePresence>
            {inCart && (
              <motion.span
                {...pop}
                className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-ice text-[9px] font-bold text-black"
              >
                1
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>
      <div className="my-auto grid grid-cols-[1fr_1.1fr] items-center gap-4">
        <div className="aspect-square rounded-xl bg-[radial-gradient(circle_at_30%_30%,#7dd3fc55,transparent_60%),linear-gradient(135deg,#27272a,#18181b)]" />
        <div className="flex flex-col justify-center">
          <div className="h-2.5 w-3/4 rounded bg-white/60" />
          <div className="mt-2 h-2 w-1/2 rounded bg-white/20" />
          <div className="mt-3 font-display text-lg font-semibold text-white">$24.900</div>
          <motion.div
            animate={{ scale: step === 1 ? 0.94 : 1 }}
            className={`mt-3 rounded-full py-2 text-center text-xs font-semibold transition-colors ${
              inCart ? "bg-emerald-400/15 text-emerald-300" : "bg-white text-black"
            }`}
          >
            {inCart ? "En el carrito ✓" : "Agregar al carrito"}
          </motion.div>
        </div>
      </div>
      <AnimatePresence>
        {step === 3 && (
          <motion.div
            {...pop}
            className="absolute inset-x-4 bottom-4 flex items-center gap-2 rounded-xl border border-emerald-400/30 bg-zinc-900/95 px-3 py-2.5 text-xs text-white shadow-xl"
          >
            <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Pago aprobado · Pedido #1042
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------- Apps: notificación que llega al celular ---------- */
function PhoneDemo() {
  const step = useLoop(4, 1300);
  return (
    <div className="flex h-full items-center justify-center">
      <div className="relative h-full max-h-60 w-32 device rounded-[26px] border border-white/15 bg-zinc-950 p-1.5 shadow-2xl">
        <div className="relative h-full overflow-hidden device rounded-[20px] bg-[linear-gradient(160deg,#1e293b,#0b0b0c_65%)] p-2.5">
          <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-white/15" />
          <div className="font-display text-xl font-semibold text-white">10:24</div>
          <div className="text-[9px] text-zinc-400">viernes 13</div>
          <AnimatePresence>
            {step >= 1 && step <= 2 && (
              <motion.div
                initial={{ opacity: 0, y: -24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ type: "spring", stiffness: 300, damping: 24 }}
                className="mt-3 rounded-xl bg-white/90 p-2 text-black"
              >
                <div className="flex items-center gap-1.5 text-[8px] font-semibold uppercase text-zinc-500">
                  <Bell className="h-2.5 w-2.5" /> Tu app · ahora
                </div>
                <div className="mt-0.5 text-[10px] font-semibold leading-tight">Tu pedido está en camino</div>
                <div className="text-[9px] leading-tight text-zinc-600">Llega en 15 minutos</div>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="absolute inset-x-2.5 bottom-2.5 grid grid-cols-4 gap-1.5">
            {[0, 1, 2, 3].map((k) => (
              <div key={k} className="aspect-square rounded-lg bg-white/10" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Automatizaciones e IA: asistente que responde solo ---------- */
function ChatDemo() {
  const msgs: { me: boolean; text: string }[] = [
    { me: true, text: "¿Tienen turno el viernes?" },
    { me: false, text: "¡Sí! Hay a las 10:30 y 17:00. ¿Te reservo uno?" },
    { me: true, text: "10:30 porfa" },
    { me: false, text: "Listo ✓ Te mandé la confirmación." },
  ];
  // Cuadros de la conversación: [mensajes visibles, "escribiendo…"]. Antes de cada respuesta, el asistente escribe.
  const frames: [number, boolean][] = [
    [0, false], [1, false], [1, true], [2, false], [3, false], [3, true], [4, false], [4, false],
  ];
  const step = useLoop(frames.length, 950);
  const [shown, typing] = frames[step];
  return (
    <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-zinc-950/80 p-4">
      <div className="mb-3 flex items-center gap-2 border-b border-white/10 pb-3">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-ice to-violet-400 text-[10px] font-bold text-black">
          IA
        </span>
        <span className="text-xs font-semibold text-white">Asistente</span>
        <span className="ml-auto flex items-center gap-1 text-[10px] text-emerald-300">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> en línea
        </span>
      </div>
      <div className="flex flex-1 flex-col justify-end gap-1.5 overflow-hidden">
        <AnimatePresence initial={false}>
          {msgs.slice(0, shown).map((m) => (
            <motion.div
              key={m.text}
              {...pop}
              className={`max-w-[80%] rounded-2xl px-3 py-1.5 text-xs ${
                m.me ? "self-end rounded-br-sm bg-white text-black" : "self-start rounded-bl-sm bg-white/10 text-zinc-100"
              }`}
            >
              {m.text}
            </motion.div>
          ))}
          {typing && (
            <motion.div key="typing" {...pop} className="flex gap-1 self-start rounded-2xl rounded-bl-sm bg-white/10 px-3 py-2">
              {[0, 1, 2].map((k) => (
                <span key={k} className="h-1.5 w-1.5 animate-pulse rounded-full bg-white/60" style={{ animationDelay: `${k * 0.15}s` }} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ---------- Mantenimiento: monitoreo con un error que se corrige ---------- */
function MonitorDemo() {
  const step = useLoop(5, 1200); // 2: aparece un error, 3: corregido
  const services = ["Sitio web", "Sistema", "Base de datos"];
  const failing = step === 2;
  return (
    <div className="relative flex h-full flex-col rounded-2xl border border-white/10 bg-zinc-950/80 p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-[11px] uppercase tracking-widest text-zinc-500">Estado del sistema</div>
        <span className={`text-[11px] font-semibold ${failing ? "text-amber-300" : "text-emerald-300"}`}>
          {failing ? "Revisando…" : "Todo funcionando"}
        </span>
      </div>
      <div className="space-y-1.5">
        {services.map((s, i) => {
          const bad = failing && i === 1;
          return (
            <div key={s} className="flex items-center gap-2.5 rounded-lg bg-white/[0.04] px-3 py-2 text-xs text-zinc-200">
              <span className={`h-2 w-2 rounded-full ${bad ? "animate-pulse bg-amber-400" : "bg-emerald-400"}`} />
              {s}
              <span className="ml-auto text-[10px] text-zinc-500">{bad ? "lento" : "ok"}</span>
            </div>
          );
        })}
      </div>
      {/* Historial: barras de las últimas horas */}
      <div className="mt-auto flex h-10 items-end gap-[3px] pt-3">
        {Array.from({ length: 28 }).map((_, k) => (
          <span
            key={k}
            className={`flex-1 rounded-sm ${failing && k === 27 ? "bg-amber-400" : "bg-emerald-400/60"}`}
            style={{ height: `${55 + ((k * 37) % 45)}%` }}
          />
        ))}
      </div>
      <AnimatePresence>
        {step === 3 && (
          <motion.div
            {...pop}
            className="absolute inset-x-4 bottom-4 flex items-center gap-2 rounded-xl border border-ice/30 bg-zinc-900/95 px-3 py-2.5 text-xs text-white shadow-xl"
          >
            <Wrench className="h-4 w-4 text-ice" /> Error corregido antes de que lo notes
            <Check className="ml-auto h-4 w-4 text-emerald-400" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const demos: Record<Demo, () => React.JSX.Element> = {
  agenda: AgendaDemo,
  store: StoreDemo,
  phone: PhoneDemo,
  chat: ChatDemo,
  monitor: MonitorDemo,
};

export function ServiceDemo({ demo }: { demo: Demo }) {
  const Demo = demos[demo];
  return <Demo />;
}

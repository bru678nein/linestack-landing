/**
 * "Por qué LineStack": compromisos concretos, en pocas palabras (la gente escanea, no lee).
 * Cada uno: el problema típico (se muestra tachado) y la promesa.
 * IMPORTANTE: poner solo lo que el equipo efectivamente cumple.
 */
export type Guarantee = {
  fear: string;
  title: string;
};

/** Días de garantía de corrección de errores después de la entrega */
export const WARRANTY_DAYS = 30;

export const guarantees: Guarantee[] = [
  { fear: "Nunca hablé con quien programaba", title: "Hablás directo con quien programa" },
  { fear: "El presupuesto se duplicó", title: "Precio cerrado y por escrito" },
  { fear: "Meses sin ver avances", title: "Una demo nueva cada semana" },
  { fear: "El código no era mío", title: "El código y los accesos son tuyos" },
  { fear: "Me cobraron por sus errores", title: `${WARRANTY_DAYS} días de garantía sin costo` },
  { fear: "Nunca nos vimos en persona", title: "Estamos en Mendoza, cara a cara" },
];

export const steps = [
  { title: "Descubrimiento", description: "Entendemos tu negocio, tus objetivos y definimos el alcance juntos." },
  { title: "Diseño", description: "Prototipos interactivos para validar la experiencia antes de programar." },
  { title: "Desarrollo", description: "Construimos en sprints cortos con demos semanales y feedback real." },
  { title: "Lanzamiento", description: "Pruebas, puesta en producción y capacitación para tu equipo." },
  { title: "Crecimiento", description: "Medimos, optimizamos y sumamos nuevas funciones según los datos." },
];

// Placeholders: reemplazar por testimonios reales.
export const testimonials = [
  {
    quote:
      "Nos entregaron el CRM en tiempo récord y el equipo lo adoptó desde el primer día. Las ventas se ordenaron por completo.",
    name: "Martina G.",
    role: "Gerente comercial",
  },
  {
    quote:
      "Lo que más valoro es la comunicación: cada semana veíamos avances concretos. Cero sorpresas en el presupuesto.",
    name: "Lucas R.",
    role: "Fundador de startup",
  },
  {
    quote:
      "La web quedó increíble. Varios clientes nos dijeron que nos contactaron por lo profesional que se ve.",
    name: "Sofía M.",
    role: "Directora de estudio",
  },
];

// Preguntas frecuentes: las dudas que suelen frenar a alguien antes de escribir.
// Revisar y ajustar las respuestas con la información real del estudio.
export const faqs = [
  {
    q: "¿Cuánto cuesta un proyecto?",
    a: "Depende del alcance: no es lo mismo una landing que un sistema de gestión. Después de una primera reunión gratuita te pasamos una propuesta con precio cerrado por etapa, así sabés exactamente qué pagás antes de empezar.",
  },
  {
    q: "¿Cuánto tarda?",
    a: "Trabajamos por etapas cortas y ves avances desde la primera semana. Una primera versión usable suele estar en pocas semanas; los tiempos exactos quedan definidos en la propuesta.",
  },
  {
    q: "¿El código y el diseño son míos?",
    a: "Sí, 100%. Al terminar te entregamos el código, los accesos y la documentación. No quedás atado a nosotros para seguir.",
  },
  {
    q: "¿Qué pasa después del lanzamiento?",
    a: "Podemos seguir acompañándote con mantenimiento, monitoreo y mejoras. Si preferís manejarlo con tu equipo, también te dejamos todo listo para hacerlo.",
  },
  {
    q: "No sé bien qué necesito, ¿igual puedo escribirles?",
    a: "Claro. La mayoría de los proyectos arrancan con una idea o un problema, no con una lista de requisitos. En la primera charla lo ordenamos juntos.",
  },
  {
    q: "¿Trabajan con clientes de otras ciudades o países?",
    a: "Sí. Somos de Mendoza: si estás cerca nos juntamos en persona, y si no, trabajamos por videollamada con demos semanales. La distancia no es un problema.",
  },
];

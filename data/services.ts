/**
 * Servicios presentados como situaciones del cliente: la persona elige "en qué está" y ve cómo lo
 * resolvemos, una demo animada del servicio y, si hay, el proyecto real que lo respalda.
 */

/** Tipos de proyecto del formulario de contacto (components/sections/Contact.tsx) */
export const projectTypes = [
  "Aplicación web",
  "App móvil",
  "Sistema de gestión",
  "Landing / E-commerce",
  "Automatización / IA",
  "Otro",
] as const;
export type ProjectType = (typeof projectTypes)[number];

export type Demo = "store" | "agenda" | "phone" | "chat" | "monitor";

export type Situation = {
  id: string;
  /** Cómo lo diría el cliente */
  situation: string;
  /** Nombre del servicio que lo resuelve */
  service: string;
  description: string;
  /** Qué incluye (3 o 4 ítems cortos) */
  includes: string[];
  /** Para quién suele ser */
  idealFor: string;
  demo: Demo;
  /** slug de data/projects.ts que lo respalda (opcional) */
  project?: string;
  /** Tipo que queda elegido en el formulario al tocar "Contanos tu caso" */
  contactType: ProjectType;
};

export const situations: Situation[] = [
  {
    id: "planillas",
    situation: "Mi equipo se maneja con planillas y mensajes",
    service: "Sistemas de gestión a medida",
    description:
      "Juntamos en un solo lugar lo que hoy está repartido: turnos, clientes, stock, cobros y reportes. Hecho a la forma en que ya trabaja tu equipo, no al revés.",
    includes: ["Agenda y turnos", "Clientes y stock", "Cobros y caja", "Reportes y estadísticas"],
    idealFor: "Consultorios, veterinarias, comercios y equipos de ventas",
    demo: "agenda",
    project: "medimai",
    contactType: "Sistema de gestión",
  },
  {
    id: "online",
    situation: "Quiero mostrar o vender mi negocio online",
    service: "Sitios web y e-commerce",
    description:
      "Una web propia que se ve profesional, carga rápido y lleva a la acción: que te escriban, reserven o compren. Con un panel para que actualices el contenido sin depender de nadie.",
    includes: ["Diseño a medida", "Velocidad y posicionamiento en Google", "Pagos, reservas o catálogo", "Panel para editar contenido"],
    idealFor: "Marcas, profesionales, comercios y comunidades",
    demo: "store",
    project: "team-anexo",
    contactType: "Landing / E-commerce",
  },
  {
    id: "app",
    situation: "Tengo una idea de app",
    service: "Apps para iOS y Android",
    description:
      "Bajamos la idea a tierra, diseñamos la experiencia y la construimos para iPhone y Android. Empezamos por una primera versión que se pueda probar con usuarios reales.",
    includes: ["Diseño de la experiencia", "App para iOS y Android", "Notificaciones y ubicación", "Publicación en las tiendas"],
    idealFor: "Emprendimientos y empresas que quieren estar en el celular de sus clientes",
    demo: "phone",
    contactType: "App móvil",
  },
  {
    id: "tareas",
    situation: "Pierdo horas en tareas repetitivas",
    service: "Automatizaciones e IA",
    description:
      "Identificamos las tareas que se repiten todos los días y las automatizamos: respuestas, carga de datos, avisos y reportes. Sumamos inteligencia artificial solo donde realmente ahorra tiempo.",
    includes: ["Respuestas automáticas", "Conexión entre tus sistemas", "Asistentes con IA", "Reportes que se arman solos"],
    idealFor: "Equipos que atienden muchas consultas o cargan datos a mano",
    demo: "chat",
    contactType: "Automatización / IA",
  },
  {
    id: "cuidar",
    situation: "Ya tengo un sistema y necesito que alguien lo cuide",
    service: "Mantenimiento y evolución",
    description:
      "Nos hacemos cargo de que tu software siga funcionando: lo monitoreamos, corregimos errores, lo mantenemos seguro y lo seguimos mejorando con lo que tu negocio necesite.",
    includes: ["Monitoreo", "Corrección de errores", "Mejoras continuas", "Backups y seguridad"],
    idealFor: "Negocios con un sistema o web que no puede dejar de andar",
    demo: "monitor",
    contactType: "Otro",
  },
];

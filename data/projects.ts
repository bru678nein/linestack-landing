export type ProjectCategory = "Web" | "Mobile" | "Sistemas";

export type Project = {
  slug: string;
  title: string;
  client: string;
  category: ProjectCategory;
  summary: string;
  problem: string;
  solution: string;
  results: string[];
  tags: string[];
  /** Dos colores para el fondo de la tarjeta (y para el dibujo de ejemplo si todavía no hay capturas) */
  accent: [string, string];
  /**
   * Capturas reales, dentro de public/projects/<slug>/ (ej: "/projects/patas-seguras/1.webp").
   * La primera es la portada. Web: capturas de compu (16:10 aprox.). Mobile: capturas del celular
   * (vertical), se muestran dentro de un marco de teléfono. Ver PROYECTOS.md.
   */
  images?: string[];
  /**
   * Capturas de la versión para celular de una web o sistema (opcional). La primera se muestra en un
   * celular apoyado sobre la ventana del navegador; todas aparecen en el detalle.
   */
  mobileImages?: string[];
  /** Link a la web publicada o a la tienda de apps (opcional) */
  url?: string;
};

// El orden de esta lista es el orden en la página. Guía para agregar uno: PROYECTOS.md
// Los textos marcados como BORRADOR los escribimos a partir de las capturas: revisarlos con los datos reales.
export const projects: Project[] = [
  {
    slug: "medimai",
    title: "MediMai",
    client: "Patas Seguras · Veterinaria",
    category: "Sistemas",
    summary: "Sistema de gestión para veterinarias: turnos, clientes, mascotas, cobros y estadísticas, en compu y celular.",
    // BORRADOR
    problem: "La agenda, las fichas de cada mascota y los cobros estaban repartidos entre cuadernos, planillas y mensajes, y era difícil saber quién debía qué.",
    // BORRADOR
    solution: "Un sistema web con agenda diaria de turnos, fichas de clientes y mascotas con buscador, registro de pagos con la caja del día y un panel de estadísticas. Se adapta al celular con navegación por pestañas.",
    // BORRADOR: reemplazar por resultados reales si los hay
    results: ["Agenda del día en una sola pantalla", "Caja diaria y deudas por cliente", "Funciona en compu y celular"],
    tags: ["Web app", "Responsive", "Turnos y pagos"], // BORRADOR: poner las tecnologías usadas
    accent: ["#a855f7", "#ec4899"],
    images: ["/projects/medimai/1.webp"],
    mobileImages: ["/projects/medimai/movil-1.webp", "/projects/medimai/movil-2.webp", "/projects/medimai/movil-3.webp"],
  },
  {
    slug: "team-anexo",
    title: "Team Anexo",
    client: "Comunidad de fighting games · Mendoza",
    category: "Web",
    summary: "Sitio de la comunidad que organiza torneos de fighting games en Mendoza, con ranking de la liga, resultados y contacto para eventos.",
    // BORRADOR
    problem: "Los torneos, el ranking y las novedades vivían en grupos y redes: los jugadores no tenían un lugar fijo para ver fechas y posiciones, y los organizadores de eventos no tenían a quién contactar.",
    // BORRADOR
    solution: "Una web con dos caminos claros —para jugadores y para quien organiza un evento—, ranking de la Premier Smash League por temporada, resultados e historial de torneos, ingreso de jugadores y contacto directo por WhatsApp.",
    // BORRADOR: reemplazar por resultados reales si los hay
    results: ["Ranking de la temporada siempre al día", "Sede mendocina de Smash Bros Argentina", "Contacto directo para eventos"],
    tags: ["Next.js", "Ranking", "Responsive"],
    accent: ["#facc15", "#7c3aed"],
    images: ["/projects/team-anexo/1.webp", "/projects/team-anexo/2.webp", "/projects/team-anexo/3.webp"],
    mobileImages: ["/projects/team-anexo/movil-1.webp"],
    url: "https://www.teamanexo.com/",
  },
];

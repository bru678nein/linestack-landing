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
  {
    slug: "trainets",
    title: "Trainets",
    client: "Producto propio · Entrenadores",
    category: "Sistemas",
    summary: "Plataforma para que los entrenadores programen mesociclos y sus atletas registren cada serie desde el teléfono.",
    problem: "Con varios atletas, la planilla se vuelve una tarde por semana copiando celdas, archivos que van y vienen por WhatsApp y resultados que el entrenador tiene que transcribir a mano.",
    solution: "Una app web donde el entrenador arma programa, mesociclo, sesión y series, y duplica una semana o un mesociclo entero para ajustar solo lo que cambia. Cada atleta entra con un link, ve su plan en el teléfono y registra lo que hizo.",
    results: ["En uso en trainets.com", "El atleta registra desde el teléfono", "Adherencia y progresión de carga a la vista"],
    tags: ["Web app", "Astro", "Python"],
    accent: ["#4a7fae", "#94a3b8"],
    images: ["/projects/trainets/1.webp"],
    url: "https://www.trainets.com/",
  },
  {
    slug: "julian",
    title: "Julian",
    client: "Producción y edición audiovisual",
    category: "Web",
    summary: "Portfolio de un editor de video: sus trabajos para marcas en un carrusel de celulares que se arrastra y se reproduce en la página.",
    // BORRADOR
    problem: "Sus videos vivían sueltos en redes y no tenía un lugar propio para mostrarle a una marca qué hace y cómo trabaja.",
    // BORRADOR
    solution: "Una web liviana con los videos verticales en marcos de celular, una grilla de trabajos que se reproducen ahí mismo y contacto directo, pensada primero para el teléfono.",
    results: ["Publicado en miportfoliojulian.netlify.app", "9 trabajos para marcas en video", "Los videos se reproducen en la página"],
    tags: ["React", "Vite", "Responsive"],
    accent: ["#d4d4d4", "#525252"],
    images: ["/projects/julian/1.webp", "/projects/julian/2.webp"],
    mobileImages: ["/projects/julian/movil-1.webp"],
    url: "https://miportfoliojulian.netlify.app/",
  },
];

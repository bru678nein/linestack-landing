export const site = {
  name: "LineStack",
  tagline: "Software a medida, capa por capa.",
  description:
    "Desarrollo de software a medida en Argentina: sistemas de gestión, aplicaciones web, apps móviles y automatizaciones para tu negocio. Equipo en Mendoza.",
  /** Título de la página de inicio: la búsqueda primero, la marca al final. */
  homeTitle: "Desarrollo de software a medida en Argentina | LineStack",
  url: "https://www.linestack.com.ar",
  email: "contacto@linestack.com.ar",
  telephone: "+54 9 261 209-4560",
  // Número de WhatsApp en formato internacional, sin + ni espacios (ej: 5491112345678)
  whatsapp: "5492612094560",
  whatsappMessage: "¡Hola LineStack! Quiero contarles sobre un proyecto.",
  // Perfiles públicos del estudio (ej: instagram: "https://instagram.com/linestack").
  // Vacío hasta tener cuentas reales: el pie y los datos para Google solo muestran los que existan.
  socials: {} as Record<string, string>,
};

export const whatsappUrl = (msg: string = site.whatsappMessage) =>
  `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(msg)}`;

// Las secciones llevan "/" adelante para que funcionen también desde la página de contacto
export const navLinks = [
  { href: "/#proyectos", label: "Proyectos" },
  { href: "/#servicios", label: "Servicios" },
  { href: "/#proceso", label: "Proceso" },
  { href: "/#por-que", label: "Por qué nosotros" },
  { href: "/contacto", label: "Contacto" },
];

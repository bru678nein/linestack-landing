import { BrainCircuit } from "lucide-react";
import {
  siDocker,
  siFlutter,
  siMercadopago,
  siNextdotjs,
  siNodedotjs,
  siPostgresql,
  siReact,
  siStripe,
  siSupabase,
  siTailwindcss,
  siTypescript,
  siVercel,
  type SimpleIcon,
} from "simple-icons";

type Tech = { name: string; icon: SimpleIcon | "ai" };

// OpenAI no está en simple-icons (lo retiraron por marca), así que usa un ícono genérico de IA
const techs: Tech[] = [
  { name: "React", icon: siReact },
  { name: "Next.js", icon: siNextdotjs },
  { name: "TypeScript", icon: siTypescript },
  { name: "Node.js", icon: siNodedotjs },
  { name: "Supabase", icon: siSupabase },
  { name: "PostgreSQL", icon: siPostgresql },
  { name: "Flutter", icon: siFlutter },
  { name: "Tailwind", icon: siTailwindcss },
  { name: "Vercel", icon: siVercel },
  { name: "OpenAI", icon: "ai" },
  { name: "Stripe", icon: siStripe },
  { name: "Mercado Pago", icon: siMercadopago },
  { name: "Docker", icon: siDocker },
];

function TechLogo({ icon }: { icon: Tech["icon"] }) {
  if (icon === "ai") return <BrainCircuit aria-hidden className="h-8 w-8 sm:h-10 sm:w-10" />;
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="h-8 w-8 sm:h-10 sm:w-10" fill="currentColor">
      <path d={icon.path} />
    </svg>
  );
}

export function TechMarquee() {
  const items = [...techs, ...techs];
  return (
    <section aria-label="Tecnologías" className="border-b border-line py-10">
      <p className="mb-7 text-center text-xs uppercase tracking-[0.25em] text-zinc-500">
        Construimos con tecnología de primer nivel
      </p>
      <div className="mask-fade-x overflow-hidden">
        {/* Solo logos: el nombre queda para lectores de pantalla y como tooltip al pasar el mouse */}
        <ul className="flex w-max animate-marquee items-center gap-14 hover:[animation-play-state:paused] sm:gap-20">
          {items.map((t, i) => (
            <li
              key={i}
              aria-hidden={i >= techs.length}
              title={t.name}
              className="flex items-center text-zinc-500 transition-colors duration-300 hover:text-white"
            >
              <TechLogo icon={t.icon} />
              <span className="sr-only">{t.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

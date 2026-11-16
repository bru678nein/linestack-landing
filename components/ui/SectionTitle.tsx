import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

type Props = {
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
  /**
   * - `center`: clásico, centrado.
   * - `left`: alineado a la izquierda, para usar dentro de una columna.
   * - `split`: título a la izquierda y descripción a la derecha, a todo el ancho.
   */
  align?: "center" | "left" | "split";
  /** Nivel del título: h1 en páginas propias (como /contacto), h2 dentro de la landing */
  as?: "h1" | "h2";
  className?: string;
};

const heading = "font-display text-3xl font-bold leading-tight tracking-tight text-metal sm:text-5xl";

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-line bg-white/[0.03] px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-silver">
      <span className="h-1.5 w-1.5 rounded-full bg-ice shadow-[0_0_12px_#7dd3fc]" />
      {children}
    </span>
  );
}

export function SectionTitle({ eyebrow, title, description, align = "center", as: Heading = "h2", className }: Props) {
  if (align === "split") {
    return (
      <Reveal className={cn("mb-12 grid items-end gap-5 sm:mb-16 lg:grid-cols-[1.3fr_1fr] lg:gap-16", className)}>
        <div>
          <Eyebrow>{eyebrow}</Eyebrow>
          <Heading className={heading}>{title}</Heading>
        </div>
        {description && (
          <p className="text-base text-muted sm:text-lg lg:mb-1.5 lg:border-l lg:border-line lg:pl-8">{description}</p>
        )}
      </Reveal>
    );
  }

  return (
    <Reveal className={cn("mb-14 max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <Heading className={heading}>{title}</Heading>
      {description && <p className="mt-5 text-base text-muted sm:text-lg">{description}</p>}
    </Reveal>
  );
}

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "ghost";
type Size = "sm" | "md" | "lg";

type CommonProps = {
  children: React.ReactNode;
  /** Ícono que acompaña al texto en reposo (ej. WhatsApp) */
  icon?: React.ReactNode;
  /** Ícono que aparece junto al texto al hacer hover (por defecto, flecha) */
  hoverIcon?: React.ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
};

type LinkButtonProps = CommonProps & {
  href: string;
  external?: boolean;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
};

type NativeButtonProps = CommonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children" | "className"> & { href?: undefined };

export type ButtonProps = LinkButtonProps | NativeButtonProps;

const variants: Record<Variant, { root: string; dot: string; hover: string }> = {
  // Blanco en reposo; al pasar el mouse se llena de negro
  primary: {
    root: "border-white bg-gradient-to-b from-white to-zinc-200 text-black shadow-[0_8px_30px_rgba(255,255,255,0.15)] hover:shadow-[0_10px_40px_rgba(255,255,255,0.25)]",
    dot: "bg-black",
    hover: "text-white",
  },
  // Oscuro en reposo; al pasar el mouse se llena de blanco
  ghost: {
    root: "border-white/20 bg-white/[0.03] text-white backdrop-blur",
    dot: "bg-white",
    hover: "text-black",
  },
};

const sizes: Record<Size, string> = {
  sm: "px-5 py-2 text-sm",
  md: "px-6 py-3 text-sm",
  lg: "px-7 py-3.5 text-base",
};

/**
 * Botón con animación "interactive hover": el punto crece hasta llenar el botón,
 * el texto sale hacia la derecha y vuelve a entrar acompañado de una flecha.
 * Con `href` renderiza un link; sin `href`, un <button>.
 */
export function Button(props: ButtonProps) {
  const { children, icon, hoverIcon, variant = "primary", size = "md", className } = props;
  const v = variants[variant];

  const classes = cn(
    "group relative isolate inline-flex cursor-pointer items-center justify-center overflow-hidden rounded-full border font-semibold transition-[box-shadow,transform] duration-300 active:scale-[0.97]",
    "disabled:pointer-events-none disabled:opacity-60",
    sizes[size],
    v.root,
    className,
  );

  const content = (
    <>
      {/* Punto que se expande */}
      <span
        aria-hidden
        className={cn(
          "absolute left-[1.15rem] top-[calc(50%-4px)] -z-10 h-2 w-2 rounded-lg transition-all duration-300 ease-out",
          "group-hover:left-0 group-hover:top-0 group-hover:h-full group-hover:w-full group-hover:scale-[1.8] group-hover:opacity-100",
          "group-focus-visible:left-0 group-focus-visible:top-0 group-focus-visible:h-full group-focus-visible:w-full group-focus-visible:scale-[1.8] group-focus-visible:opacity-100",
          // Con ícono propio, el punto queda oculto en reposo y solo aparece al expandirse
          icon ? "opacity-0" : "opacity-100",
          v.dot,
        )}
      />
      {/* Contenido en reposo */}
      <span
        className={cn(
          "inline-flex items-center gap-2 transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0 group-focus-visible:translate-x-12 group-focus-visible:opacity-0",
          !icon && "pl-4",
        )}
      >
        {icon}
        {children}
      </span>
      {/* Contenido en hover */}
      <span
        aria-hidden
        className={cn(
          "absolute inset-0 flex translate-x-12 items-center justify-center gap-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100",
          v.hover,
        )}
      >
        {children}
        {hoverIcon ?? <ArrowRight className="h-4 w-4" />}
      </span>
    </>
  );

  if (props.href !== undefined) {
    const { href, external, onClick } = props;
    const ext = external ? { target: "_blank", rel: "noopener noreferrer" } : {};
    return (
      <Link href={href} onClick={onClick} className={classes} {...ext}>
        {content}
      </Link>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { icon: _i, hoverIcon: _h, variant: _v, size: _s, className: _c, children: _ch, href: _href, ...rest } = props;
  return (
    <button className={classes} {...rest}>
      {content}
    </button>
  );
}

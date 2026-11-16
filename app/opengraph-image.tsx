import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/config/site";

/** Imagen que aparece al compartir el link (WhatsApp, LinkedIn, X, etc.) */
export const alt = `${site.name} — Software a medida, capa por capa`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

function Mark({ s = 1 }: { s?: number }) {
  // Mismo dibujo que el logo (components/ui/Logo.tsx), en coordenadas de 64×64
  const layers = [0, 1, 2, 3, 4];
  return (
    <svg width={64 * s} height={64 * s} viewBox="0 0 64 64">
      <defs>
        <linearGradient id="l" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#f5f5f5" />
          <stop offset="1" stopColor="#bdbdbd" />
        </linearGradient>
        <linearGradient id="r" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#d4d4d4" />
          <stop offset="1" stopColor="#8f8f8f" />
        </linearGradient>
      </defs>
      <polygon points="32,4 54,10.5 32,17 10,10.5" fill="#fff" />
      {layers.map((i) => {
        const y = 13 + i * 9;
        return (
          <g key={i}>
            <polygon points={`10,${y} 32,${y + 6.5} 32,${y + 12} 10,${y + 5.5}`} fill="url(#l)" />
            <polygon points={`32,${y + 6.5} 54,${y} 54,${y + 5.5} 32,${y + 12}`} fill="url(#r)" />
          </g>
        );
      })}
    </svg>
  );
}

export default async function OgImage() {
  const [clash, satoshi] = await Promise.all([
    readFile(join(process.cwd(), "app/fonts/ClashDisplay-Semibold.ttf")),
    readFile(join(process.cwd(), "app/fonts/Satoshi-Medium.otf")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 90px",
          background: "radial-gradient(ellipse 60% 80% at 78% 50%, #1c1c20 0%, #050505 70%)",
          color: "#fff",
          fontFamily: "Satoshi",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 660 }}>
          <div style={{ display: "flex", fontFamily: "Clash", fontSize: 30, letterSpacing: 6, color: "#a1a1aa" }}>
            LINE<span style={{ color: "#fff" }}>STACK</span>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: 36,
              fontFamily: "Clash",
              fontSize: 76,
              lineHeight: 1.04,
              backgroundImage: "linear-gradient(180deg, #ffffff 0%, #d4d4d8 55%, #8b8b90 100%)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            <span>Software a medida,</span>
            <span>capa por capa.</span>
          </div>
          <div style={{ display: "flex", marginTop: 28, fontSize: 28, color: "#a1a1aa", lineHeight: 1.4 }}>
            Apps web, móviles, sistemas de gestión y automatizaciones.
          </div>
        </div>
        <Mark s={5.2} />
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Clash", data: clash, weight: 600, style: "normal" },
        { name: "Satoshi", data: satoshi, weight: 500, style: "normal" },
      ],
    },
  );
}

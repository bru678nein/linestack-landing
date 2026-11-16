import { ImageResponse } from "next/og";

/** Ícono para "agregar a pantalla de inicio" en iPhone/iPad */
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  const layers = [0, 1, 2, 3, 4];
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#050505" }}>
        <svg width={128} height={128} viewBox="0 0 64 64">
          <polygon points="32,4 54,10.5 32,17 10,10.5" fill="#fff" />
          {layers.map((i) => {
            const y = 13 + i * 9;
            return (
              <g key={i}>
                <polygon points={`10,${y} 32,${y + 6.5} 32,${y + 12} 10,${y + 5.5}`} fill="#e5e5e5" />
                <polygon points={`32,${y + 6.5} 54,${y} 54,${y + 5.5} 32,${y + 12}`} fill="#a3a3a3" />
              </g>
            );
          })}
        </svg>
      </div>
    ),
    size,
  );
}

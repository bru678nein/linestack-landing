export function LogoMark({ className = "h-8 w-8" }: { className?: string }) {
  const layers = [0, 1, 2, 3, 4];
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <defs>
        <linearGradient id="lm-l" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#f5f5f5" />
          <stop offset="1" stopColor="#bdbdbd" />
        </linearGradient>
        <linearGradient id="lm-r" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#d4d4d4" />
          <stop offset="1" stopColor="#8f8f8f" />
        </linearGradient>
      </defs>
      <polygon points="32,4 54,10.5 32,17 10,10.5" fill="#fff" />
      {layers.map((i) => {
        const y = 13 + i * 9;
        return (
          <g key={i}>
            <polygon points={`10,${y} 32,${y + 6.5} 32,${y + 12} 10,${y + 5.5}`} fill="url(#lm-l)" />
            <polygon points={`32,${y + 6.5} 54,${y} 54,${y + 5.5} 32,${y + 12}`} fill="url(#lm-r)" />
          </g>
        );
      })}
    </svg>
  );
}

export function Logo() {
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark />
      <span className="font-display text-lg font-bold tracking-[0.18em]">
        <span className="text-zinc-400">LINE</span>
        <span className="text-white">STACK</span>
      </span>
    </span>
  );
}

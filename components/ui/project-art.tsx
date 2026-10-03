import type { Project } from "@/lib/data";

/** Small looping SVG animations for projects without a photo. */
export function ProjectArt({ kind, color }: { kind: NonNullable<Project["art"]>; color: string }) {
  const box = "absolute inset-0 m-auto h-full max-h-[210px] w-full";

  if (kind === "led") {
    // isometric 4×4×4 LED cube; LEDs blink in a travelling wave
    const pts: { x: number; y: number; d: number }[] = [];
    for (let i = 0; i < 4; i++)
      for (let j = 0; j < 4; j++)
        for (let k = 0; k < 4; k++) {
          const x = 100 + (i - j) * 17;
          const y = 40 + (i + j) * 9.5 + k * 19 - 8;
          pts.push({ x, y, d: ((i + j + k) * 0.18) % 2.4 });
        }
    return (
      <svg viewBox="0 0 200 150" className={box} aria-hidden="true">
        <g stroke={color} strokeOpacity="0.18" strokeWidth="0.6" fill="none">
          <path d="M100 32 L151 60.5 L151 117.5 L100 146 L49 117.5 L49 60.5 Z" />
          <path d="M100 32 L100 89 M49 60.5 L100 89 L151 60.5" />
        </g>
        {pts.map((p, n) => (
          <circle key={n} cx={p.x} cy={p.y} r="2.6" fill={color} className="art-led" style={{ animationDelay: `${p.d}s` }} />
        ))}
      </svg>
    );
  }

  if (kind === "control") {
    // step input and a damped response being traced — a control loop settling
    return (
      <svg viewBox="0 0 200 140" className={box} fill="none" aria-hidden="true">
        <path d="M14 120 H186 M14 120 V14" stroke="#fff" strokeOpacity="0.15" />
        <path d="M14 112 H44 V46 H186" stroke="#fff" strokeOpacity="0.35" strokeDasharray="4 4" />
        <path className="art-draw" d="M44 112 C60 112 62 26 78 30 C92 34 96 58 108 54 C120 50 124 44 134 46 C146 48 150 47 186 46" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
        <line x1="118" y1="10" x2="118" y2="124" stroke={color} strokeOpacity=".35" strokeDasharray="3 4" className="art-strobe" />
      </svg>
    );
  }

  if (kind === "layers") {
    // a part being printed layer by layer
    return (
      <svg viewBox="0 0 200 140" className={box} fill="none" aria-hidden="true">
        {Array.from({ length: 14 }).map((_, i) => (
          <rect key={i} className="art-layer" style={{ animationDelay: `${(13 - i) * 0.12}s` }} x={60 + Math.sin(i / 2.2) * 6} y={18 + i * 8} width={80 - Math.abs(7 - i) * 3} height="5" rx="2.5" fill={color} fillOpacity={0.35 + (i % 3) * 0.2} />
        ))}
        <path d="M100 4 v10" stroke="#fff" strokeOpacity=".6" strokeWidth="3" strokeLinecap="round" className="art-nozzle" />
      </svg>
    );
  }

  // "wave": digital test patterns with a strobe sweeping across — ATE
  return (
    <svg viewBox="0 0 200 140" className={box} fill="none" stroke={color} strokeWidth="2" aria-hidden="true">
      {[0, 1, 2, 3].map((r) => (
        <path key={r} className="art-wave" style={{ animationDelay: `${r * 0.35}s` }} d={`M10 ${30 + r * 26} h20 v-12 h24 v12 h14 v-12 h30 v12 h20 v-12 h16 v12 h20 v-12 h12 v12 h24`} />
      ))}
      <line x1="118" y1="10" x2="118" y2="130" stroke="#fff" strokeOpacity=".35" strokeDasharray="3 4" className="art-strobe" />
    </svg>
  );
}

// Hand-built SVG illustrations of Newcastle / Gateshead landmarks.

const r = (n: number) => Math.round(n * 10) / 10;

/* ---------------- Tyne Bridge (sunset) ---------------- */
export function TyneBridge({ className = "" }: { className?: string }) {
  // Outer & inner arch: quadratic curves, x is linear in t.
  const outer = (t: number) => ({ x: 70 + 260 * t, y: 215 - 480 * t * (1 - t) });
  const inner = (t: number) => ({ x: 84 + 232 * t, y: 215 - 420 * t * (1 - t) });
  const zig: string[] = [];
  for (let i = 0; i <= 24; i++) {
    const t = i / 24;
    const p = i % 2 ? inner(t) : outer(t);
    zig.push(`${i ? "L" : "M"}${r(p.x)} ${r(p.y)}`);
  }
  const hangers: { x: number; y: number }[] = [];
  for (let x = 118; x <= 282; x += 9) {
    const t = (x - 84) / 232;
    hangers.push({ x, y: 215 - 420 * t * (1 - t) });
  }
  const skyline = [
    [0, 30, 50], [28, 22, 70], [48, 30, 40], [80, 18, 85], [96, 34, 55], [128, 24, 66],
    [150, 40, 45], [188, 20, 78], [206, 36, 52], [240, 26, 64], [264, 30, 44], [292, 22, 90],
    [312, 38, 56], [348, 24, 70], [370, 30, 48],
  ];

  return (
    <svg viewBox="0 0 400 260" className={className} role="img" aria-label="Illustration of the Tyne Bridge at sunset">
      <defs>
        <linearGradient id="tb-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffc98f" />
          <stop offset="1" stopColor="#fdeedd" />
        </linearGradient>
      </defs>
      <rect width="400" height="260" fill="url(#tb-sky)" />
      <circle cx="318" cy="64" r="26" fill="#ffad4d" />
      {skyline.map(([x, w, h]) => (
        <rect key={x} x={x} y={200 - h} width={w} height={h} fill="#e9c9a3" />
      ))}
      <rect y="203" width="400" height="57" fill="#3e6ea5" />
      {[218, 232, 246].map((y, i) => (
        <path key={y} d={`M${20 + i * 30} ${y} h40 M${150 + i * 20} ${y + 4} h55 M${290 - i * 15} ${y} h45`} stroke="#ffffff" strokeOpacity=".35" strokeWidth="2" />
      ))}
      {/* arch */}
      <path d="M70 215 Q200 -25 330 215" fill="none" stroke="#2f6b47" strokeWidth="7" />
      <path d="M84 215 Q200 5 316 215" fill="none" stroke="#2f6b47" strokeWidth="5" />
      <path d={zig.join(" ")} fill="none" stroke="#2f6b47" strokeWidth="2.5" />
      {hangers.map((h) => (
        <line key={h.x} x1={h.x} y1={r(h.y)} x2={h.x} y2="150" stroke="#2f6b47" strokeWidth="1.6" />
      ))}
      {/* deck */}
      <rect y="148" width="400" height="9" fill="#2f6b47" />
      <rect y="157" width="400" height="3" fill="#1f4a31" />
      {/* towers */}
      {[22, 334].map((x) => (
        <g key={x}>
          <rect x={x} y="102" width="44" height="113" fill="#cfb994" stroke="#8a7552" strokeWidth="2" />
          <rect x={x - 3} y="98" width="50" height="8" fill="#b9a27b" stroke="#8a7552" strokeWidth="2" />
          {[0, 1].map((c) =>
            [0, 1, 2].map((row) => (
              <rect key={`${c}${row}`} x={x + 8 + c * 18} y={112 + row * 28} width="10" height="16" rx="5" fill="#5a4a33" />
            )),
          )}
        </g>
      ))}
      <rect y="210" width="70" height="10" fill="#a88f68" />
      <rect x="330" y="210" width="70" height="10" fill="#a88f68" />
      {/* gulls */}
      <path d="M120 60 q6 -6 12 0 q6 -6 12 0 M170 40 q5 -5 10 0 q5 -5 10 0" fill="none" stroke="#5b4a3a" strokeWidth="2" />
    </svg>
  );
}

/* ------------- Gateshead Millennium Bridge (night) ------------- */
const STARS = [[30, 30], [80, 18], [140, 44], [190, 22], [240, 50], [300, 20], [360, 40], [60, 70], [210, 80], [380, 90], [120, 95]];

export function MillenniumBridge({ className = "" }: { className?: string }) {
  const arch = (t: number) => ({ x: 30 + 340 * t, y: 208 - 500 * t * (1 - t) });
  const deck = (t: number) => ({ x: 30 + 340 * t, y: 204 - 48 * t * (1 - t) });
  const cables = [];
  for (let i = 1; i < 14; i++) {
    const t = i / 14;
    cables.push({ a: arch(t), d: deck(t) });
  }
  return (
    <svg viewBox="0 0 400 300" className={className} role="img" aria-label="Illustration of the Gateshead Millennium Bridge at night">
      <defs>
        <linearGradient id="mb-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0d1838" />
          <stop offset="1" stopColor="#2c3f73" />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill="url(#mb-sky)" />
      {STARS.map(([x, y]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r="1.6" fill="#fff" opacity=".8" />
      ))}
      <circle cx="70" cy="58" r="18" fill="#fdf3c4" />
      <circle cx="78" cy="52" r="16" fill="#0f1a3c" />
      {/* Baltic */}
      <rect x="282" y="72" width="78" height="140" fill="#6e3826" />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x={290 + i * 14} y="82" width="6" height="120" fill="#5a2c1d" />
      ))}
      <rect x="278" y="66" width="86" height="10" fill="#4b2417" />
      {/* Glasshouse */}
      <path d="M40 212 C 40 160, 90 140, 125 158 C 150 128, 210 128, 232 162 C 252 150, 272 168, 272 212 Z" fill="#9db6cc" opacity=".9" />
      <path d="M70 212 C 75 175, 100 160, 125 160 M150 212 C 150 165, 180 140, 210 150 M232 212 C 236 185, 250 170, 262 178" fill="none" stroke="#e8f2fb" strokeOpacity=".6" strokeWidth="2" />
      {/* river */}
      <rect y="210" width="400" height="90" fill="#0f2147" />
      {[[60, 235], [180, 250], [300, 238], [120, 270], [250, 280]].map(([x, y]) => (
        <rect key={`${x}${y}`} x={x} y={y} width="40" height="2.5" fill="#ffc400" opacity=".55" />
      ))}
      {/* bridge */}
      <path d="M30 208 Q200 -42 370 208" fill="none" stroke="#f3f3f3" strokeWidth="7" />
      {cables.map((c, i) => (
        <line key={i} x1={r(c.a.x)} y1={r(c.a.y)} x2={r(c.d.x)} y2={r(c.d.y)} stroke="#f3f3f3" strokeWidth="1.3" opacity=".8" />
      ))}
      <path d="M30 204 Q200 156 370 204" fill="none" stroke="#f3f3f3" strokeWidth="6" />
      {[0.15, 0.3, 0.45, 0.6, 0.75, 0.9].map((t) => {
        const p = deck(t);
        return <circle key={t} cx={r(p.x)} cy={r(p.y) + 5} r="2.5" fill="#ffc400" />;
      })}
    </svg>
  );
}

/* ---------------- Grey's Monument ---------------- */
export function GreysMonument({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 300 340" className={className} role="img" aria-label="Illustration of Grey's Monument">
      <defs>
        <linearGradient id="gm-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9cc7e8" />
          <stop offset="1" stopColor="#e3f0f8" />
        </linearGradient>
      </defs>
      <rect width="300" height="340" fill="url(#gm-sky)" />
      <ellipse cx="70" cy="60" rx="40" ry="14" fill="#fff" opacity=".9" />
      <ellipse cx="230" cy="40" rx="34" ry="11" fill="#fff" opacity=".9" />
      {/* Georgian terraces */}
      {[0, 210].map((x) => (
        <g key={x}>
          <rect x={x} y="170" width="90" height="170" fill="#d9c7a3" />
          <rect x={x} y="164" width="90" height="8" fill="#bca880" />
          {[0, 1, 2].map((c) =>
            [0, 1, 2, 3].map((row) => (
              <rect key={`${c}${row}`} x={x + 10 + c * 27} y={182 + row * 36} width="14" height="22" fill="#4d5a66" />
            )),
          )}
        </g>
      ))}
      {/* plinth */}
      <rect x="112" y="290" width="76" height="50" fill="#c4ae86" />
      <rect x="106" y="284" width="88" height="10" fill="#b29a70" />
      {/* column */}
      <rect x="133" y="88" width="34" height="198" fill="#d8c59c" />
      {[140, 148, 156, 162].map((x) => (
        <line key={x} x1={x} y1="92" x2={x} y2="282" stroke="#b9a57c" strokeWidth="1.5" />
      ))}
      <rect x="126" y="78" width="48" height="12" fill="#bba477" />
      <rect x="138" y="70" width="24" height="9" fill="#a99064" />
      {/* Earl Grey */}
      <rect x="143" y="40" width="14" height="30" rx="3" fill="#7d7a6e" />
      <circle cx="150" cy="34" r="7" fill="#7d7a6e" />
      <path d="M143 48 l-6 14 M157 48 l5 12" stroke="#7d7a6e" strokeWidth="4" strokeLinecap="round" />
      {/* pigeons */}
      <path d="M60 120 q5 -5 10 0 q5 -5 10 0 M220 110 q4 -4 8 0 q4 -4 8 0" fill="none" stroke="#3b3b3b" strokeWidth="2" />
    </svg>
  );
}

/* ---------------- Angel of the North ---------------- */
const RAIN = Array.from({ length: 26 }, (_, i) => [((i * 53) % 300) + 5, ((i * 37) % 220) + 5]);

export function AngelOfTheNorth({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 300 340" className={className} role="img" aria-label="Illustration of the Angel of the North in the rain">
      <defs>
        <linearGradient id="an-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9aa5b1" />
          <stop offset="1" stopColor="#d5dbe1" />
        </linearGradient>
      </defs>
      <rect width="300" height="340" fill="url(#an-sky)" />
      <ellipse cx="80" cy="40" rx="70" ry="24" fill="#7f8a96" />
      <ellipse cx="220" cy="55" rx="80" ry="26" fill="#86919d" />
      {RAIN.map(([x, y], i) => (
        <line key={i} x1={x} y1={y} x2={x - 6} y2={y + 14} stroke="#ffffff" strokeOpacity=".55" strokeWidth="1.5" />
      ))}
      <path d="M0 300 C 80 268, 220 268, 300 300 V340 H0 Z" fill="#5f8a4a" />
      {/* body: feet → shoulders, with the slight forward lean shown as a shaded side */}
      <polygon points="132,294 168,294 160,204 158,184 142,184 140,204" fill="#9b4a24" />
      <polygon points="150,294 168,294 160,204 158,184 150,184" fill="#84391a" />
      {[220, 245, 270].map((y) => (
        <line key={y} x1="137" y1={y} x2="164" y2={y} stroke="#6e2f14" strokeWidth="2" />
      ))}
      {/* wings: ~2.7x wider than tall, angled slightly forward */}
      <polygon points="8,196 142,190 158,190 292,196 292,214 158,208 142,208 8,214" fill="#9b4a24" />
      <polygon points="8,208 142,204 158,204 292,208 292,214 158,208 142,208 8,214" fill="#84391a" />
      {[30, 55, 80, 105, 125, 175, 195, 220, 245, 270].map((x) => (
        <line key={x} x1={x} y1="195" x2={x} y2="213" stroke="#6e2f14" strokeWidth="1.6" />
      ))}
      {/* head */}
      <ellipse cx="150" cy="174" rx="7" ry="10" fill="#9b4a24" />
    </svg>
  );
}

export const ART = {
  tyne: TyneBridge,
  millennium: MillenniumBridge,
  monument: GreysMonument,
  angel: AngelOfTheNorth,
};
export type ArtKey = keyof typeof ART;

import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, H, VH, VW, VX, VY, W } from "./theme";

// Shared SVG filters: watercolor edges + paper grain.
const Filters: React.FC = () => (
  <defs>
    <filter id="wc" x="-30%" y="-30%" width="160%" height="160%">
      <feTurbulence type="fractalNoise" baseFrequency="0.011" numOctaves="4" seed="7" result="n" />
      <feDisplacementMap in="SourceGraphic" in2="n" scale="70" xChannelSelector="R" yChannelSelector="G" result="d" />
      <feGaussianBlur in="d" stdDeviation="9" />
    </filter>
    <filter id="wcLeaf" x="-30%" y="-30%" width="160%" height="160%">
      <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" seed="3" result="n" />
      <feDisplacementMap in="SourceGraphic" in2="n" scale="6" xChannelSelector="R" yChannelSelector="G" result="d" />
      <feGaussianBlur in="d" stdDeviation="0.8" />
    </filter>
    <filter id="grain">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="11" />
      <feColorMatrix type="matrix" values="0 0 0 0 0.45  0 0 0 0 0.36  0 0 0 0 0.28  0 0 0 0.09 0" />
    </filter>
    <radialGradient id="vign" cx="50%" cy="50%" r="70%">
      <stop offset="60%" stopColor={C.cream} stopOpacity="0" />
      <stop offset="100%" stopColor={C.beigeDeep} stopOpacity="0.28" />
    </radialGradient>
  </defs>
);

type Blob = { x: number; y: number; rx: number; ry: number; c: string; o: number };

const WASHES: Blob[] = [
  { x: 120, y: 120, rx: 360, ry: 260, c: C.beige, o: 0.6 },
  { x: 260, y: 40, rx: 260, ry: 150, c: C.pink, o: 0.55 },
  { x: 1820, y: 980, rx: 380, ry: 260, c: C.beige, o: 0.6 },
  { x: 1640, y: 1060, rx: 280, ry: 150, c: C.pink, o: 0.55 },
  { x: 1840, y: 90, rx: 240, ry: 200, c: C.pink, o: 0.4 },
  { x: 90, y: 1000, rx: 260, ry: 200, c: C.beige, o: 0.55 },
  { x: 960, y: 1090, rx: 520, ry: 70, c: C.beige, o: 0.35 },
  { x: 960, y: -10, rx: 520, ry: 60, c: C.pink, o: 0.25 },
  { x: 330, y: 230, rx: 200, ry: 120, c: C.beigeDeep, o: 0.18 },
  { x: 1600, y: 860, rx: 220, ry: 130, c: C.beigeDeep, o: 0.18 },
  { x: 1500, y: 120, rx: 160, ry: 90, c: C.beige, o: 0.35 },
  { x: 420, y: 960, rx: 180, ry: 90, c: C.pink, o: 0.3 },
];

export const PaperBackground: React.FC<{ drift?: boolean }> = ({ drift = true }) => {
  const frame = useCurrentFrame();
  const t = drift ? frame / 30 : 0;
  return (
    <AbsoluteFill style={{ backgroundColor: C.cream }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <Filters />
        <rect width={W} height={H} fill={C.cream} />
        <g filter="url(#wc)">
          {WASHES.map((b, i) => (
            <ellipse
              key={i}
              cx={b.x + Math.sin(t * 0.15 + i) * 12}
              cy={b.y + Math.cos(t * 0.12 + i * 2) * 10}
              rx={b.rx}
              ry={b.ry}
              fill={b.c}
              opacity={b.o}
            />
          ))}
        </g>
        <rect width={W} height={H} fill="url(#vign)" />
        <rect width={W} height={H} filter="url(#grain)" />
      </svg>
    </AbsoluteFill>
  );
};

// A watercolor sprig: curved stem with beige leaves and a few dusty-pink blossoms.
const Sprig: React.FC<{ x: number; y: number; rot: number; scale: number; flip?: boolean }> = ({
  x,
  y,
  rot,
  scale,
  flip,
}) => {
  const leaves = [0.12, 0.24, 0.36, 0.48, 0.6, 0.72, 0.84];
  // Stem: quadratic curve from (0,0) to (300,-40) via (150,-90)
  const pt = (t: number) => ({
    x: (1 - t) * (1 - t) * 0 + 2 * (1 - t) * t * 150 + t * t * 300,
    y: (1 - t) * (1 - t) * 0 + 2 * (1 - t) * t * -90 + t * t * -40,
  });
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${flip ? -scale : scale} ${scale})`} filter="url(#wcLeaf)">
      <path d="M0 0 Q150 -90 300 -40" stroke={C.sand} strokeWidth={2.2} fill="none" opacity={0.55} />
      {leaves.map((t, i) => {
        const p = pt(t);
        const side = i % 2 === 0 ? -1 : 1;
        const ang = side * 48 - 20 + t * 30;
        return (
          <g key={i} transform={`translate(${p.x} ${p.y}) rotate(${ang})`}>
            <ellipse cx={0} cy={side * 18} rx={10} ry={24} fill={C.beigeDeep} opacity={0.55} />
            <ellipse cx={-2} cy={side * 16} rx={6} ry={17} fill={C.beige} opacity={0.6} />
          </g>
        );
      })}
      {[
        { t: 1, r: 1 },
        { t: 0.55, r: 0.75 },
      ].map(({ t, r }, i) => {
        const p = pt(t);
        return (
          <g key={i} transform={`translate(${p.x} ${p.y}) scale(${r})`}>
            {[0, 72, 144, 216, 288].map((a) => (
              <ellipse
                key={a}
                cx={0}
                cy={-15}
                rx={11}
                ry={16}
                transform={`rotate(${a})`}
                fill={C.pink}
                opacity={0.7}
              />
            ))}
            <circle r={6} fill={C.rose} opacity={0.55} />
          </g>
        );
      })}
    </g>
  );
};

// Thin pink satin bow sitting on the frame's top edge (outside the footage area).
const Bow: React.FC<{ cx: number; cy: number }> = ({ cx, cy }) => (
  <g transform={`translate(${cx} ${cy})`}>
    {/* tails */}
    <path d="M-6 4 C-16 18 -26 30 -36 40 L-25 39 L-22 49 C-12 34 -6 22 4 8 Z" fill={C.pinkDeep} opacity={0.9} />
    <path d="M6 4 C16 18 26 30 36 40 L25 39 L22 49 C12 34 6 22 -4 8 Z" fill={C.pinkDeep} opacity={0.9} />
    {/* loops */}
    <path d="M0 0 C-30 -34 -78 -30 -74 -2 C-70 22 -26 16 0 0 Z" fill={C.pink} stroke={C.pinkDeep} strokeWidth={1.5} />
    <path d="M0 0 C30 -34 78 -30 74 -2 C70 22 26 16 0 0 Z" fill={C.pink} stroke={C.pinkDeep} strokeWidth={1.5} />
    <path d="M-8 -2 C-30 -18 -56 -18 -58 -4" stroke={C.cream} strokeWidth={2} fill="none" opacity={0.7} />
    <path d="M8 -2 C30 -18 56 -18 58 -4" stroke={C.cream} strokeWidth={2} fill="none" opacity={0.7} />
    <ellipse cx={0} cy={0} rx={11} ry={12} fill={C.pinkDeep} />
    <ellipse cx={-2} cy={-3} rx={4} ry={4} fill={C.pink} opacity={0.8} />
  </g>
);

const Corner: React.FC<{ x: number; y: number; sx: number; sy: number }> = ({ x, y, sx, sy }) => (
  <g transform={`translate(${x} ${y}) scale(${sx} ${sy})`} stroke={C.gold} fill="none" strokeWidth={1.6} opacity={0.9}>
    <path d="M0 34 C0 14 14 0 34 0" />
    <path d="M10 46 C8 22 22 8 46 10" opacity={0.6} />
    <circle cx={6} cy={6} r={3} fill={C.gold} stroke="none" />
  </g>
);

// Classic double-line frame around the footage window + florals in the margins + bow.
export const FrameDecor: React.FC<{ showBow?: boolean }> = ({ showBow = true }) => {
  const o1 = 16;
  const o2 = 26;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <Filters />
        <rect x={VX - o1} y={VY - o1} width={VW + o1 * 2} height={VH + o1 * 2} fill="none" stroke={C.gold} strokeWidth={2} opacity={0.85} />
        <rect x={VX - o2} y={VY - o2} width={VW + o2 * 2} height={VH + o2 * 2} fill="none" stroke={C.gold} strokeWidth={1} opacity={0.6} />
        <Corner x={VX - o2 - 10} y={VY - o2 - 10} sx={1} sy={1} />
        <Corner x={VX + VW + o2 + 10} y={VY - o2 - 10} sx={-1} sy={1} />
        <Corner x={VX - o2 - 10} y={VY + VH + o2 + 10} sx={1} sy={-1} />
        <Corner x={VX + VW + o2 + 10} y={VY + VH + o2 + 10} sx={-1} sy={-1} />
        {showBow ? <Bow cx={W / 2} cy={VY - o2 - 30} /> : null}
      </svg>
    </AbsoluteFill>
  );
};

// Sprigs drawn BEHIND the footage window (they peek out in the margins only).
export const MarginFlorals: React.FC = () => (
  <AbsoluteFill>
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      <Filters />
      <Sprig x={-10} y={250} rot={-60} scale={0.9} />
      <Sprig x={60} y={60} rot={10} scale={0.7} />
      <Sprig x={1930} y={830} rot={120} scale={0.9} />
      <Sprig x={1860} y={1030} rot={190} scale={0.7} />
    </svg>
  </AbsoluteFill>
);

// Footage window: cream mat + soft shadow; children fill VW x VH.
export const Window: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      position: "absolute",
      left: VX,
      top: VY,
      width: VW,
      height: VH,
      overflow: "hidden",
      boxShadow: "0 10px 40px rgba(122,94,74,0.22), 0 0 0 6px #FBF6EE",
      backgroundColor: C.paper,
    }}
  >
    {children}
  </div>
);

export const BigFlorals: React.FC = () => (
  <AbsoluteFill>
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      <Filters />
      <Sprig x={-20} y={330} rot={-55} scale={1.3} />
      <Sprig x={120} y={70} rot={15} scale={1} />
      <Sprig x={1940} y={760} rot={125} scale={1.3} />
      <Sprig x={1800} y={1020} rot={195} scale={1} />
    </svg>
  </AbsoluteFill>
);

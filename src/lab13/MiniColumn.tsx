import React from "react";
import { useCurrentFrame } from "remotion";
import { C, Pt } from "./theme";

export type Mode = "dry" | "wet" | "loading" | "flooding";

const HOLDUP: Record<Mode, number> = { dry: 0, wet: 0.25, loading: 0.6, flooding: 1 };
const AIR_SPEED: Record<Mode, number> = { dry: 2.6, wet: 2.6, loading: 3.4, flooding: 3.9 };
const DROP_SPEED: Record<Mode, number> = { dry: 0, wet: 3.4, loading: 1.8, flooding: 0.8 };

const ROWS = [112, 157, 202, 247, 292, 337, 382];
const RINGS: Pt[] = [];
ROWS.forEach((y, r) => {
  const off = r % 2 === 0 ? 0 : 20;
  for (let c = 0; c < 4; c++) {
    const x = 52 + off + c * 40;
    if (x < 185) RINGS.push([x, y]);
  }
});

/** Close-up of a packed section. `level` (0..1) blends from the start of the state to its full effect. */
export const MiniColumn: React.FC<{ mode: Mode; level?: number; style?: React.CSSProperties }> = ({ mode, level = 1, style }) => {
  const f = useCurrentFrame();
  const h = HOLDUP[mode] * level;
  const wet = mode !== "dry";

  const bubbles = [];
  for (let i = 0; i < 13; i++) {
    const sp = AIR_SPEED[mode];
    const y = 448 - ((f * sp + i * 34) % 430);
    const x = 40 + ((i * 47) % 140) + Math.sin((f + i * 9) / 8) * 6;
    const edge = Math.min(1, (448 - y) / 18, (y - 18) / 18);
    bubbles.push(<circle key={i} cx={x} cy={y} r={6} fill={C.air} stroke={C.white} strokeWidth={1.4} opacity={edge} />);
  }
  const drops = [];
  if (wet) {
    const sp = DROP_SPEED[mode] * (1 - 0.3 * level) + 0.5 * (1 - level);
    for (let i = 0; i < 12; i++) {
      const y = 70 + ((f * sp + i * 31) % 370);
      const x = 40 + ((i * 59) % 140) + Math.sin((f + i * 13) / 10) * 4;
      const edge = Math.min(1, (y - 70) / 18, (440 - y) / 18);
      drops.push(<ellipse key={i} cx={x} cy={y} rx={4} ry={6} fill={C.water} opacity={edge} />);
    }
  }
  const pools: React.ReactNode[] = [];
  if (mode === "loading" || mode === "flooding") {
    ROWS.slice(0, -1).forEach((y, r) => {
      for (let c = 0; c < 4; c++) {
        const x = 52 + (r % 2 === 0 ? 20 : 0) + c * 40;
        if (x > 185) continue;
        pools.push(
          <ellipse key={`${r}-${c}`} cx={x} cy={y + 22} rx={4 + h * 11} ry={3 + h * 7} fill={C.water} opacity={0.55} />,
        );
      }
    });
  }
  const floodH = mode === "flooding" ? 20 + 190 * level : 0;
  const ripple = Math.sin(f / 5) * 3;

  return (
    <svg viewBox="0 0 220 470" style={style}>
      <rect x={20} y={10} width={180} height={450} rx={14} fill={C.glass} stroke={C.title} strokeWidth={3.5} />
      <rect x={30} y={90} width={160} height={310} rx={4} fill={C.pack} stroke={C.sage} strokeWidth={2} />
      {wet ? <rect x={52} y={56} width={116} height={12} rx={6} fill={C.water} /> : null}
      {pools}
      {RINGS.map(([x, y], i) => (
        <ellipse key={i} cx={x} cy={y} rx={14} ry={10} fill="none" stroke={C.sage} strokeWidth={3} />
      ))}
      {wet
        ? RINGS.map(([x, y], i) => (
            <ellipse key={`f${i}`} cx={x} cy={y} rx={16} ry={12} fill="none" stroke={C.water} strokeWidth={1.5 + h * 4} opacity={0.75} />
          ))
        : null}
      {floodH > 0 ? (
        <path
          d={`M24,${72 + floodH} L24,${72 + ripple} Q65,${66 - ripple} 110,${72 + ripple} T196,${72 - ripple} L196,${72 + floodH} Z`}
          fill={C.water}
          opacity={0.45}
        />
      ) : null}
      {drops}
      {bubbles}
      <line x1={26} x2={194} y1={412} y2={412} stroke={C.title} strokeWidth={5} />
    </svg>
  );
};

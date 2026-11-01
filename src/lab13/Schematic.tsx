import React from "react";
import { useCurrentFrame } from "remotion";
import { C, FONT, Pt, polyD } from "./theme";
import { Arrow, FlowDots } from "./ui";

// Simplified operating schematic (not the exact piping layout of the CE 400 unit).
// viewBox 0 0 1100 800.

export type Part = "column" | "rings" | "tank" | "pump" | "wmeter" | "dist" | "air" | "mano";

const BOX: Record<Part, [number, number, number, number]> = {
  column: [405, 55, 230, 610],
  rings: [426, 182, 188, 366],
  tank: [50, 640, 260, 130],
  pump: [128, 508, 104, 104],
  wmeter: [150, 218, 60, 176],
  dist: [436, 118, 168, 46],
  air: [780, 600, 330, 170],
  mano: [850, 150, 160, 400],
};

const FEED: Pt[] = [
  [180, 652],
  [180, 30],
  [500, 30],
  [500, 140],
];
const RETURN: Pt[] = [
  [520, 652],
  [520, 705],
  [302, 705],
];
const AIR_IN: Pt[] = [
  [1100, 740],
  [820, 740],
  [820, 600],
  [622, 600],
];
const AIR_OUT: Pt[] = [
  [590, 68],
  [590, -20],
];

const RING_ROWS = [212, 254, 296, 338, 380, 422, 464, 506];
const ringPos = (): Pt[] => {
  const out: Pt[] = [];
  RING_ROWS.forEach((y, r) => {
    const off = r % 2 === 0 ? 0 : 21;
    for (let c = 0; c < 4; c++) {
      const x = 459 + off + c * 40;
      if (x < 600) out.push([x, y]);
    }
  });
  return out;
};
export const RINGS = ringPos();

const Label: React.FC<{ x: number; y: number; anchor?: "start" | "middle" | "end"; children: React.ReactNode; size?: number; color?: string; weight?: number }> = ({
  x,
  y,
  anchor = "start",
  children,
  size = 23,
  color = C.title,
  weight = 700,
}) => (
  <text x={x} y={y} textAnchor={anchor} fontFamily={FONT} fontSize={size} fontWeight={weight} fill={color}>
    {children}
  </text>
);

const Leader: React.FC<{ x1: number; y1: number; x2: number; y2: number }> = (p) => (
  <line {...p} stroke={C.muted} strokeWidth={1.6} />
);

export type SchematicProps = {
  vis?: Partial<Record<Part, number>>;
  water?: number; // 0..1 water circulation intensity
  air?: number; // 0..1 air flow level (0 = off)
  pumpOn?: boolean;
  pumpBadge?: "ON" | "OFF" | null;
  dh?: number; // manometer level difference in px
  holdup?: number; // 0..1 liquid held in packing
  arrows?: number; // countercurrent arrows opacity
  glow?: Part | null;
  style?: React.CSSProperties;
};

export const Schematic: React.FC<SchematicProps> = ({
  vis = {},
  water = 0,
  air = 0,
  pumpOn = false,
  pumpBadge = null,
  dh = 0,
  holdup = 0,
  arrows = 0,
  glow = null,
  style,
}) => {
  const f = useCurrentFrame();
  const v = (p: Part) => (vis[p] === undefined ? 1 : (vis[p] as number));
  const levelL = 350 - dh / 2; // leg connected to the TOP tap (lower pressure) → higher level
  const levelR = 350 + dh / 2; // leg connected to the BOTTOM tap (higher pressure) → lower level

  // droplets inside the packed bed (falling) and air bubbles (rising)
  const drops = [];
  if (water > 0.01) {
    const sp = 3.2 * (1 - 0.55 * holdup);
    for (let i = 0; i < 18; i++) {
      const y = 150 + ((f * sp + i * 27) % 455);
      const x = 446 + ((i * 53) % 150) + Math.sin((f + i * 11) / 9) * 5;
      const edge = Math.min(1, (y - 150) / 20, (605 - y) / 20);
      drops.push(<ellipse key={i} cx={x} cy={y} rx={4.5} ry={6.5} fill={C.water} opacity={water * edge} />);
    }
  }
  const bubbles = [];
  if (air > 0.01) {
    const sp = 1.6 + air * 4.4;
    for (let i = 0; i < 16; i++) {
      const y = 598 - ((f * sp + i * 33) % 528);
      const x = 444 + ((i * 61) % 156) + Math.sin((f + i * 7) / 8) * 7;
      const edge = Math.min(1, (598 - y) / 20, (y - 70) / 20);
      bubbles.push(
        <circle key={i} cx={x} cy={y} r={6.5} fill={C.air} stroke={C.white} strokeWidth={1.5} opacity={Math.min(1, air * 2.5) * edge} />,
      );
    }
  }

  const glowBox = glow ? BOX[glow] : null;
  const pulse = 0.55 + 0.45 * Math.sin(f / 6);
  const impeller = pumpOn ? f * 14 : 0;

  return (
    <svg viewBox="0 0 1100 800" style={{ overflow: "visible", ...style }}>
      {/* ---------- water pipes ---------- */}
      <g opacity={v("pump")}>
        <path d={polyD(FEED)} stroke={C.waterPipe} strokeWidth={10} fill="none" strokeLinejoin="round" />
        <path d={polyD(RETURN)} stroke={C.waterPipe} strokeWidth={10} fill="none" strokeLinejoin="round" />
      </g>
      {/* ---------- air pipes ---------- */}
      <g opacity={v("air")}>
        <path d={polyD(AIR_IN)} stroke={C.airPipe} strokeWidth={10} fill="none" strokeLinejoin="round" />
      </g>
      <g opacity={v("column")}>
        <path d={polyD(AIR_OUT)} stroke={C.airPipe} strokeWidth={10} fill="none" />
        <Arrow from={[590, 0]} to={[590, -42]} color={C.airPipe} width={10} head={22} />
      </g>

      {/* ---------- manometer tap lines + U-tube ---------- */}
      <g opacity={v("mano")}>
        <path d="M622,175 H880 V232" stroke={C.title} strokeWidth={4} fill="none" />
        <path d="M622,572 H1070 V205 H960 V232" stroke={C.title} strokeWidth={4} fill="none" />
        <circle cx={622} cy={175} r={7} fill={C.title} />
        <circle cx={622} cy={572} r={7} fill={C.title} />
        <path d="M880,232 V470 A40,40 0 0 0 960,470 V232" stroke={C.title} strokeWidth={22} fill="none" />
        <path d="M880,232 V470 A40,40 0 0 0 960,470 V232" stroke={C.white} strokeWidth={15} fill="none" />
        <path
          d={`M880,${levelL} V470 A40,40 0 0 0 960,470 V${levelR}`}
          stroke={C.water}
          strokeWidth={15}
          fill="none"
        />
        {/* scale ticks */}
        {[260, 290, 320, 350, 380, 410, 440].map((y) => (
          <line key={y} x1={905} x2={935} y1={y} y2={y} stroke={C.muted} strokeWidth={y === 350 ? 2.5 : 1.5} />
        ))}
        {dh > 24 ? (
          <g>
            <line x1={860} x2={1000} y1={levelL} y2={levelL} stroke={C.note} strokeWidth={2} strokeDasharray="6 5" />
            <line x1={860} x2={1000} y1={levelR} y2={levelR} stroke={C.note} strokeWidth={2} strokeDasharray="6 5" />
            <Label x={850} y={levelL + 8} anchor="end" size={22} color={C.note}>
              H1
            </Label>
            <Label x={1008} y={levelR + 8} size={22} color={C.note}>
              H2
            </Label>
            <line x1={1000} x2={1000} y1={levelL} y2={levelR} stroke={C.title} strokeWidth={2.5} />
            {dh > 40 ? (
              <Label x={1010} y={(levelL + levelR) / 2 + 8} size={24}>
                Δh
              </Label>
            ) : null}
          </g>
        ) : null}
        <Label x={920} y={540} anchor="middle">
          U-tube manometer
        </Label>
        <Label x={745} y={163} anchor="middle" size={19} color={C.body} weight={500}>
          Pressure tap (top)
        </Label>
        <Label x={760} y={562} anchor="middle" size={19} color={C.body} weight={500}>
          Pressure tap (bottom)
        </Label>
      </g>

      {/* ---------- tank ---------- */}
      <g opacity={v("tank")}>
        <rect x={60} y={652} width={242} height={108} rx={8} fill="#EAF0F3" stroke={C.title} strokeWidth={3} />
        <rect x={63} y={682} width={236} height={75} rx={5} fill={C.water} opacity={0.35} />
        <Label x={181} y={728} anchor="middle">
          Water tank
        </Label>
      </g>

      {/* ---------- pump ---------- */}
      <g opacity={v("pump")}>
        <circle cx={180} cy={560} r={42} fill="#E3EBE6" stroke={C.title} strokeWidth={4} />
        <g transform={`rotate(${impeller} 180 560)`}>
          {[0, 120, 240].map((a) => (
            <path key={a} d="M180,560 Q196,540 180,526" stroke={C.title} strokeWidth={5} fill="none" transform={`rotate(${a} 180 560)`} />
          ))}
          <circle cx={180} cy={560} r={6} fill={C.title} />
        </g>
        <Label x={124} y={568} anchor="end">
          Pump
        </Label>
        {pumpBadge ? (
          <g>
            <rect x={226} y={508} width={70} height={36} rx={18} fill={pumpBadge === "ON" ? C.sage : C.off} />
            <Label x={261} y={534} anchor="middle" color={C.white} size={21}>
              {pumpBadge}
            </Label>
          </g>
        ) : null}
      </g>

      {/* ---------- water flow meter (rotameter) ---------- */}
      <g opacity={v("wmeter")}>
        <polygon points="171,384 189,384 199,228 161,228" fill="#FBFCFC" stroke={C.title} strokeWidth={3} />
        {[250, 280, 310, 340, 370].map((y) => (
          <line key={y} x1={192} x2={200} y1={y} y2={y} stroke={C.muted} strokeWidth={1.5} />
        ))}
        <polygon
          points={`${170},${368 - water * 110} ${190},${368 - water * 110} ${185},${382 - water * 110} ${175},${382 - water * 110}`}
          fill={C.water}
        />
        <Label x={150} y={296} anchor="end" size={22}>
          Water flow
        </Label>
        <Label x={150} y={322} anchor="end" size={22}>
          meter
        </Label>
      </g>

      {/* ---------- column ---------- */}
      <g opacity={v("column")}>
        <rect x={420} y={68} width={200} height={584} rx={18} fill={C.glass} stroke={C.title} strokeWidth={4} />
        <line x1={436} x2={436} y1={90} y2={630} stroke={C.white} strokeWidth={5} opacity={0.9} />
        {/* support plate */}
        <line x1={430} x2={610} y1={556} y2={556} stroke={C.title} strokeWidth={6} />
        {/* sump water */}
        <rect x={424} y={612} width={192} height={36} rx={10} fill={C.water} opacity={0.45 * Math.min(1, water * 1.5)} />
        <Label x={398} y={86} anchor="end">
          Packed glass column
        </Label>
        <Leader x1={402} y1={80} x2={420} y2={92} />
        <Label x={610} y={28} size={21}>
          Air outlet
        </Label>
      </g>
      <g opacity={v("rings")}>
        <rect x={430} y={190} width={180} height={350} rx={4} fill={C.pack} stroke={C.sage} strokeWidth={2} />
        <rect x={430} y={190} width={180} height={350} rx={4} fill={C.water} opacity={holdup * 0.3} />
        {RINGS.map(([x, y], i) => (
          <ellipse key={i} cx={x} cy={y} rx={14} ry={10} fill="none" stroke={C.sage} strokeWidth={3.2} />
        ))}
        {water > 0.01
          ? RINGS.map(([x, y], i) => (
              <ellipse
                key={`w${i}`}
                cx={x}
                cy={y}
                rx={16}
                ry={12}
                fill="none"
                stroke={C.water}
                strokeWidth={1.5 + holdup * 4}
                opacity={Math.min(1, water) * 0.7}
              />
            ))
          : null}
        <Label x={398} y={368} anchor="end">
          Raschig rings
        </Label>
        <Leader x1={402} y1={362} x2={446} y2={362} />
      </g>
      <g opacity={v("dist")}>
        <rect x={446} y={134} width={148} height={14} rx={7} fill={C.water} />
        {[462, 492, 522, 552, 580].map((x) => (
          <line key={x} x1={x} x2={x} y1={148} y2={160} stroke={C.water} strokeWidth={4} />
        ))}
        <Label x={398} y={150} anchor="end">
          Distributor
        </Label>
        <Leader x1={402} y1={144} x2={446} y2={141} />
      </g>

      {/* ---------- air valve + air flow meter ---------- */}
      <g opacity={v("air")}>
        <polygon points="942,722 942,758 978,722 978,758" fill={C.white} stroke={C.title} strokeWidth={3} />
        <line x1={960} x2={960} y1={740} y2={706} stroke={C.title} strokeWidth={4} />
        <line x1={944} x2={976} y1={706} y2={706} stroke={C.title} strokeWidth={5} strokeLinecap="round" />
        <Label x={960} y={790} anchor="middle" size={21}>
          Air control valve
        </Label>
        <polygon points="811,724 829,724 839,616 801,616" fill="#FBFCFC" stroke={C.title} strokeWidth={3} />
        <polygon
          points={`${810},${706 - air * 78} ${830},${706 - air * 78} ${825},${718 - air * 78} ${815},${718 - air * 78}`}
          fill={C.air}
        />
        <Label x={850} y={650} size={21}>
          Air flow
        </Label>
        <Label x={850} y={675} size={21}>
          meter
        </Label>
        <Label x={1096} y={724} anchor="end" size={21}>
          Air supply
        </Label>
      </g>

      {/* ---------- flows ---------- */}
      <FlowDots pts={FEED} color={C.water} speed={4.2} opacity={water} />
      <FlowDots pts={RETURN} color={C.water} speed={3.2} opacity={water} spacing={38} />
      <FlowDots pts={AIR_IN} color={C.air} speed={1.5 + air * 5} opacity={Math.min(1, air * 2.5)} spacing={40} />
      <FlowDots pts={AIR_OUT} color={C.air} speed={1.5 + air * 5} opacity={Math.min(1, air * 2.5)} spacing={30} />
      {drops}
      {bubbles}

      {/* ---------- countercurrent arrows ---------- */}
      {arrows > 0 ? (
        <g>
          <Arrow from={[474, 205]} to={[474, 520]} color={C.water} width={16} head={34} opacity={arrows} />
          <Arrow from={[568, 530]} to={[568, 205]} color={C.air} width={16} head={34} opacity={arrows} />
        </g>
      ) : null}

      {glowBox ? (
        <rect
          x={glowBox[0]}
          y={glowBox[1]}
          width={glowBox[2]}
          height={glowBox[3]}
          rx={16}
          fill="none"
          stroke={C.note}
          strokeWidth={4}
          strokeDasharray="12 8"
          opacity={pulse}
        />
      ) : null}
    </svg>
  );
};

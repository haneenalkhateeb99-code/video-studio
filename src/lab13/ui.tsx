import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { C, FONT, Pt, appear, fadeUp, pathLength, pointAt } from "./theme";

/** Content-slide template mirroring the deck: washed plant photo, centred bold title,
 *  sage accent line, small page number bottom-right, optional footnote. */
export const Slide: React.FC<{
  title: string;
  subtitle: string;
  page: string;
  footnote?: string;
  children?: React.ReactNode;
}> = ({ title, subtitle, page, footnote, children }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, fontFamily: FONT }}>
      <Img
        src={staticFile("lab13/plant-bg.jpg")}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.1, filter: "grayscale(0.4)" }}
      />
      <div style={{ position: "absolute", top: 58, left: 0, right: 0, textAlign: "center", ...fadeUp(f, 0) }}>
        <div style={{ fontSize: 82, fontWeight: 800, color: C.title, lineHeight: 1.05, letterSpacing: -0.5 }}>{title}</div>
        <div dir="rtl" lang="ar" style={{ fontSize: 38, fontWeight: 800, color: C.sage, marginTop: 6 }}>
          {subtitle}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          top: 236,
          right: 96,
          height: 6,
          width: 240 * appear(f, 6, 24),
          backgroundColor: C.sage,
        }}
      />
      {children}
      {footnote ? (
        <div
          dir="rtl"
          lang="ar"
          style={{ position: "absolute", left: 96, bottom: 34, fontSize: 24, color: C.body, opacity: appear(f, 20) }}
        >
          {footnote}
        </div>
      ) : null}
      <div style={{ position: "absolute", right: 96, bottom: 34, fontSize: 22, color: C.body }}>{page}</div>
    </AbsoluteFill>
  );
};

/** RTL text card with a coloured marker. */
export const Card: React.FC<{
  start: number;
  color: string;
  title: React.ReactNode;
  children?: React.ReactNode;
  active?: boolean;
  style?: React.CSSProperties;
}> = ({ start, color, title, children, active = true, style }) => {
  const f = useCurrentFrame();
  return (
    <div
      dir="rtl"
      lang="ar"
      style={{
        display: "flex",
        gap: 20,
        alignItems: "flex-start",
        padding: "18px 24px",
        borderRadius: 16,
        backgroundColor: active ? "rgba(255,255,255,0.82)" : "rgba(255,255,255,0.45)",
        border: `2px solid ${active ? color : "rgba(120,150,138,0.25)"}`,
        ...fadeUp(f, start),
        ...style,
      }}
    >
      <div style={{ width: 14, minWidth: 14, height: 14, borderRadius: 7, backgroundColor: color, marginTop: 16 }} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 34, fontWeight: 800, color: C.title, lineHeight: 1.35 }}>{title}</div>
        {children ? <div style={{ fontSize: 30, color: C.body, lineHeight: 1.5, marginTop: 4 }}>{children}</div> : null}
      </div>
    </div>
  );
};

/** Latin/term run inside Arabic text (kept LTR). */
export const T: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color }) => (
  <bdi dir="ltr" style={{ fontWeight: 700, color: color ?? C.title }}>
    {children}
  </bdi>
);

/** Moving particles along a polyline (SVG). */
export const FlowDots: React.FC<{
  pts: Pt[];
  color: string;
  speed: number;
  spacing?: number;
  r?: number;
  opacity?: number;
  offset?: number;
}> = ({ pts, color, speed, spacing = 42, r = 6, opacity = 1, offset = 0 }) => {
  const f = useCurrentFrame();
  if (opacity <= 0.001) return null;
  const L = pathLength(pts);
  const n = Math.max(1, Math.floor(L / spacing));
  const dots = [];
  for (let k = 0; k < n; k++) {
    const d = (((f * speed + offset + k * spacing) % L) + L) % L;
    const [x, y] = pointAt(pts, d);
    const edge = Math.min(1, d / 18, (L - d) / 18);
    dots.push(<circle key={k} cx={x} cy={y} r={r} fill={color} opacity={opacity * edge} />);
  }
  return <g>{dots}</g>;
};

/** Thick arrow (SVG). */
export const Arrow: React.FC<{ from: Pt; to: Pt; color: string; width?: number; opacity?: number; head?: number }> = ({
  from,
  to,
  color,
  width = 12,
  opacity = 1,
  head = 28,
}) => {
  const ang = Math.atan2(to[1] - from[1], to[0] - from[0]);
  const bx = to[0] - Math.cos(ang) * head;
  const by = to[1] - Math.sin(ang) * head;
  const px = Math.cos(ang + Math.PI / 2) * head * 0.6;
  const py = Math.sin(ang + Math.PI / 2) * head * 0.6;
  return (
    <g opacity={opacity}>
      <line x1={from[0]} y1={from[1]} x2={bx} y2={by} stroke={color} strokeWidth={width} strokeLinecap="round" />
      <polygon points={`${to[0]},${to[1]} ${bx + px},${by + py} ${bx - px},${by - py}`} fill={color} />
    </g>
  );
};

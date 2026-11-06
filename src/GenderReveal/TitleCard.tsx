import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { BigFlorals, PaperBackground } from "./Decor";
import { BODY_FONT, C, TITLE_FONT } from "./theme";

// Word-by-word soft reveal (Arabic: animate words, never letters).
export const SoftWords: React.FC<{
  text: string;
  delay?: number;
  stagger?: number;
  size: number;
  font?: string;
  color?: string;
  weight?: number;
}> = ({ text, delay = 0, stagger = 6, size, font = TITLE_FONT, color = C.ink, weight = 400 }) => {
  const frame = useCurrentFrame();
  const words = text.split(" ");
  return (
    <div
      dir="rtl"
      lang="ar"
      style={{
        fontFamily: font,
        fontSize: size,
        fontWeight: weight,
        color,
        lineHeight: 1.5,
        textAlign: "center",
        whiteSpace: "nowrap",
      }}
    >
      {words.map((w, i) => {
        const p = interpolate(frame - delay - i * stagger, [0, 22], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.cubic),
        });
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: p,
              translate: `0 ${(1 - p) * 14}px`,
              filter: `blur(${(1 - p) * 6}px)`,
              marginInline: size * 0.12,
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};

const Divider: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame - delay, [0, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  return (
    <svg width={520} height={40} viewBox="0 0 520 40" style={{ opacity: p }}>
      <line x1={260 - 230 * p} y1={20} x2={240} y2={20} stroke={C.gold} strokeWidth={1.5} />
      <line x1={280} y1={20} x2={260 + 230 * p} y2={20} stroke={C.gold} strokeWidth={1.5} />
      <path
        d="M260 30 C246 20 246 10 254 10 C258 10 260 14 260 14 C260 14 262 10 266 10 C274 10 274 20 260 30 Z"
        fill={C.pinkDeep}
      />
    </svg>
  );
};

export const TitleCard: React.FC<{ title: string; subtitle?: string; titleSize?: number }> = ({
  title,
  subtitle,
  titleSize = 150,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const zoom = interpolate(frame, [0, durationInFrames], [1, 1.04]);
  return (
    <AbsoluteFill>
      <PaperBackground />
      <BigFlorals />
      <AbsoluteFill
        style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", scale: String(zoom) }}
      >
        <SoftWords text={title} size={titleSize} delay={8} stagger={7} />
        <Divider delay={26} />
        {subtitle ? (
          <div style={{ marginTop: 18 }}>
            <SoftWords text={subtitle} size={54} font={BODY_FONT} color={C.rose} delay={36} stagger={5} />
          </div>
        ) : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

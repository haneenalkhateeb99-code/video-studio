import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { fontFamily } from "./fonts";

type Props = {
  title: string;
  subtitle: string;
};

export const HelloWorld: React.FC<Props> = ({ title, subtitle }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const titleScale = spring({ frame, fps, config: { damping: 12 } });
  const subtitleOpacity = interpolate(frame, [25, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 20, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const hue = interpolate(frame, [0, durationInFrames], [220, 300]);
  const progress = frame / (durationInFrames - 1);

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, hsl(${hue}, 70%, 18%), hsl(${hue + 40}, 70%, 35%))`,
        justifyContent: "center",
        alignItems: "center",
        fontFamily,
        color: "white",
        opacity: fadeOut,
      }}
    >
      <div
        dir="rtl"
        style={{
          fontSize: 130,
          fontWeight: 800,
          transform: `scale(${titleScale})`,
          textShadow: "0 10px 40px rgba(0,0,0,0.4)",
        }}
      >
        {title}
      </div>
      <div dir="rtl" style={{ fontSize: 52, marginTop: 30, opacity: subtitleOpacity }}>
        {subtitle}
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 80,
          left: 160,
          right: 160,
          height: 10,
          borderRadius: 5,
          background: "rgba(255,255,255,0.2)",
        }}
      >
        <div
          style={{
            width: `${progress * 100}%`,
            height: "100%",
            borderRadius: 5,
            background: "white",
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

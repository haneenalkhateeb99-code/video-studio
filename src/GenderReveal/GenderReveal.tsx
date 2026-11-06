import React, { useMemo } from "react";
import { Audio, Video } from "@remotion/media";
import { AbsoluteFill, Easing, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import edl from "./edl.json";
import { FrameDecor, MarginFlorals, PaperBackground, Window } from "./Decor";
import { TitleCard } from "./TitleCard";
import "./theme";

type Item = {
  id: string;
  type: "card" | "shot";
  start: number;
  frames: number;
  trans: "fade" | "cut";
  music: number;
  title?: string;
  subtitle?: string;
  file?: string;
  kind?: string;
  gain?: number;
  zoom?: string | null;
  portrait?: boolean;
};

const ITEMS = (edl as unknown as { items: Item[] }).items;
const FADE = edl.fade;
export const GENDER_REVEAL_FRAMES = edl.total;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Opacity of an item at its local frame: fade in when entering with a dissolve;
// cards also fade out when the next item dissolves in (so the frame decor returns smoothly).
const useItemOpacity = (it: Item, index: number) => {
  const f = useCurrentFrame();
  const fadeIn = it.trans === "fade" && index > 0 ? interpolate(f, [0, FADE], [0, 1], clamp) : 1;
  const next = ITEMS[index + 1];
  const fadeOut =
    it.type === "card" && next && next.trans === "fade"
      ? interpolate(f, [it.frames - FADE, it.frames], [1, 0], clamp)
      : it.type === "card" && !next
        ? interpolate(f, [it.frames - 45, it.frames], [1, 0], clamp)
        : 1;
  return Math.min(fadeIn, fadeOut);
};

const Shot: React.FC<{ it: Item; index: number }> = ({ it, index }) => {
  const f = useCurrentFrame();
  const opacity = useItemOpacity(it, index);
  const src = staticFile(it.file!);
  const gentle = it.kind === "decor" || it.kind === "guest" || it.kind === "after";
  const z0 = 1;
  const z1 = it.zoom === "in" ? 1.06 : gentle ? 1.025 : 1;
  const scale = interpolate(f, [0, it.frames], [z0, z1], { ...clamp, easing: Easing.inOut(Easing.sin) });
  const gain = it.gain ?? 0;
  const next = ITEMS[index + 1];
  const volume = (vf: number) => {
    // short ramps at edges; longer ramps under dissolves
    const inLen = it.trans === "fade" ? FADE : 4;
    const outLen = next && next.trans === "fade" ? FADE : 4;
    const a = interpolate(vf, [0, inLen], [0, 1], clamp);
    const b = interpolate(vf, [it.frames - outLen, it.frames], [1, 0], clamp);
    return gain * Math.min(a, b);
  };
  const muted = gain === 0;
  return (
    <AbsoluteFill style={{ opacity }}>
      <Window>
        {it.portrait ? (
          <>
            <Video
              src={src}
              muted
              style={{
                position: "absolute",
                inset: -60,
                width: "calc(100% + 120px)",
                height: "calc(100% + 120px)",
                objectFit: "cover",
                filter: "blur(36px) saturate(0.8)",
              }}
            />
            <AbsoluteFill style={{ backgroundColor: "rgba(238,224,206,0.6)" }} />
            <div
              style={{
                position: "absolute",
                left: (1600 - 506) / 2,
                top: 0,
                width: 506,
                height: 900,
                boxShadow: "0 0 0 5px #FBF6EE, 0 8px 30px rgba(122,94,74,0.25)",
                scale: String(scale),
              }}
            >
              <Video src={src} volume={volume} muted={muted} style={{ width: "100%", height: "100%" }} />
            </div>
          </>
        ) : (
          <Video
            src={src}
            volume={volume}
            muted={muted}
            style={{ width: "100%", height: "100%", objectFit: "cover", scale: String(scale) }}
          />
        )}
      </Window>
    </AbsoluteFill>
  );
};

const Card: React.FC<{ it: Item; index: number }> = ({ it, index }) => {
  const opacity = useItemOpacity(it, index);
  return (
    <AbsoluteFill style={{ opacity }}>
      <TitleCard title={it.title!} subtitle={it.subtitle} titleSize={it.id === "mid" ? 120 : 150} />
    </AbsoluteFill>
  );
};

// Music level per frame: targets from each item, smoothed so the piano rises/dips gradually.
const useMusicCurve = () =>
  useMemo(() => {
    const total = GENDER_REVEAL_FRAMES;
    const target = new Float32Array(total);
    for (const it of ITEMS) {
      for (let f = it.start; f < Math.min(total, it.start + it.frames); f++) target[f] = it.music;
    }
    // asymmetric smoothing: dip fast-ish before speech (look-ahead), rise slowly afterwards
    const out = new Float32Array(total);
    const look = 15;
    for (let f = 0; f < total; f++) {
      let lo = Infinity;
      for (let k = f; k <= Math.min(total - 1, f + look); k++) lo = Math.min(lo, target[k]);
      out[f] = lo;
    }
    const sm = new Float32Array(total);
    let v = out[0];
    for (let f = 0; f < total; f++) {
      const rate = out[f] < v ? 0.09 : 0.035;
      v += (out[f] - v) * rate;
      sm[f] = v;
    }
    for (let f = 0; f < total; f++) {
      const fin = interpolate(f, [0, 90], [0, 1], clamp);
      const fout = interpolate(f, [total - 150, total - 5], [1, 0], clamp);
      sm[f] *= fin * fout;
    }
    return sm;
  }, []);

export const GenderReveal: React.FC = () => {
  const curve = useMusicCurve();
  return (
    <AbsoluteFill style={{ backgroundColor: "#FBF6EE" }}>
      <PaperBackground />
      <MarginFlorals />
      {ITEMS.map((it, i) =>
        it.type === "shot" ? (
          <Sequence key={it.id} name={it.id} from={it.start} durationInFrames={it.frames} premountFor={30}>
            <Shot it={it} index={i} />
          </Sequence>
        ) : null,
      )}
      <FrameDecor />
      {ITEMS.map((it, i) =>
        it.type === "card" ? (
          <Sequence key={it.id} name={it.id} from={it.start} durationInFrames={it.frames}>
            <Card it={it} index={i} />
          </Sequence>
        ) : null,
      )}
      <Audio src={staticFile("gender-reveal/music.m4a")} volume={(f) => curve[Math.min(curve.length - 1, f)] ?? 0} />
    </AbsoluteFill>
  );
};

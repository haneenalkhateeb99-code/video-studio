import { loadFont } from "@remotion/fonts";
import { Easing, interpolate, staticFile } from "remotion";
import "../fonts"; // Cairo (Arabic + Latin), local files

// Visual identity taken from the CMET205 Lab 13 deck:
// off-white background, dark slate titles, grey-teal body text, sage accent line,
// sage/green packing, blue water. Air is orange (per the brief).
// The deck uses Aptos; Public Sans (local, OFL) is the closest free substitute.
loadFont({
  family: "Public Sans",
  url: staticFile("fonts/PublicSans-latin-var.woff2"),
  weight: "100 900",
  format: "woff2",
});

export const FONT = "'Public Sans', 'Cairo', sans-serif";

export const C = {
  bg: "#F5F4EE",
  title: "#263F46",
  body: "#627378",
  sage: "#78968A",
  pack: "#D7E2D9",
  glass: "#EEF2EF",
  water: "#4F8DB8",
  waterSoft: "#DCE8EF",
  waterPipe: "#A9C6DA",
  air: "#D9822B",
  airSoft: "#F6E6D2",
  airPipe: "#EBC59B",
  note: "#6693AC",
  muted: "#9AA7AA",
  off: "#B5544A",
  white: "#FFFFFF",
};

const ease = Easing.bezier(0.16, 1, 0.3, 1);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** 0 → 1 progress starting at `start`, lasting `dur` frames (eased). */
export const appear = (f: number, start: number, dur = 20) =>
  interpolate(f, [start, start + dur], [0, 1], { ...clamp, easing: ease });

/** Linear clamped mapping. */
export const ramp = (f: number, a: number, b: number, from: number, to: number) =>
  interpolate(f, [a, b], [from, to], clamp);

export const fadeUp = (f: number, start: number, dist = 26) => {
  const p = appear(f, start);
  return { opacity: p, translate: `0px ${(1 - p) * dist}px` };
};

export type Pt = [number, number];

const segLen = (a: Pt, b: Pt) => Math.hypot(b[0] - a[0], b[1] - a[1]);

export const pathLength = (pts: Pt[]) => {
  let L = 0;
  for (let i = 1; i < pts.length; i++) L += segLen(pts[i - 1], pts[i]);
  return L;
};

/** Point at distance d along a polyline. */
export const pointAt = (pts: Pt[], d: number): Pt => {
  let rest = d;
  for (let i = 1; i < pts.length; i++) {
    const l = segLen(pts[i - 1], pts[i]);
    if (rest <= l) {
      const t = l === 0 ? 0 : rest / l;
      return [
        pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * t,
        pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * t,
      ];
    }
    rest -= l;
  }
  return pts[pts.length - 1];
};

export const polyD = (pts: Pt[]) =>
  pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]},${p[1]}`).join(" ");

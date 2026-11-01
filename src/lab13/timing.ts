import DUR from "./vo-durations.json";
import { NARRATION, SceneKey } from "./narration";

// Scene timing is derived from the recorded voice-over:
// each cue starts after the previous clip (+ GAP + optional hold),
// so animations stay in sync if the audio is re-generated or re-recorded.
export const FPS = 30;
const LEAD = 0.7; // s before the first sentence (covers the 0.5 s cross-fade)
const GAP = 0.25; // s between sentences (clips already end with ~1 s of silence)
const TAIL = 0.6; // s after the last sentence

export type Cues = { s: Record<string, number>; e: Record<string, number>; dur: number; ids: string[] };

const durations = DUR as Record<string, number>;

export const cues = (key: SceneKey): Cues => {
  const s: Record<string, number> = {};
  const e: Record<string, number> = {};
  let t = LEAD;
  const segs = NARRATION[key] as { id: string; hold?: number }[];
  segs.forEach((seg, i) => {
    s[seg.id] = Math.round(t * FPS);
    t += durations[seg.id];
    e[seg.id] = Math.round(t * FPS);
    if (i < segs.length - 1) t += GAP + (seg.hold ?? 0);
    else t += seg.hold ?? 0;
  });
  return { s, e, dur: Math.round((t + TAIL) * FPS), ids: segs.map((x) => x.id) };
};

/** Frame inside a cue: fraction 0..1 of the sentence's length. */
export const at = (q: Cues, id: string, frac: number) => Math.round(q.s[id] + (q.e[id] - q.s[id]) * frac);

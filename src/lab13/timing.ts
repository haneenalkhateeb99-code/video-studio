import DUR from "./vo-durations.json";
import WORDS from "./vo-words.json";
import { NARRATION, SceneKey, SILENT_SCENE_SECONDS } from "./narration";

// Scene timing is derived from the recorded voice-over:
// each cue starts after the previous clip (+ GAP + optional hold),
// so animations stay in sync if the audio is re-generated or re-recorded.
export const FPS = 30;
const LEAD = 0.55; // s before the first sentence (covers the 0.5 s cross-fade)
const GAP = 0.3; // s pause between sentences, on top of the 0.25 s of silence kept at each clip end
const TAIL = 0.3; // s after the last sentence

export type Cues = { s: Record<string, number>; e: Record<string, number>; dur: number; ids: string[]; end: number };

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
  const ids = segs.map((x) => x.id);
  if (ids.length === 0) return { s, e, dur: Math.round(SILENT_SCENE_SECONDS * FPS), ids, end: 0 };
  return { s, e, dur: Math.round((t + TAIL) * FPS), ids, end: e[ids[ids.length - 1]] };
};

/** Frame inside a cue: fraction 0..1 of the sentence's length. */
export const at = (q: Cues, id: string, frac: number) => Math.round(q.s[id] + (q.e[id] - q.s[id]) * frac);

const words = WORDS as unknown as Record<string, [number, string][]>;

const strip = (x: string) => x.replace(/[\u064B-\u065F\u0670\u0640.,،:;]/g, "").toLowerCase();

/** Frame at which `needle` is spoken in the scene (searched in clip `id` first, then in all
 *  clips of the scene; tashkeel is ignored). Falls back to a fraction of clip `id` when no
 *  word timings exist (e.g. a human recording). */
export const word = (q: Cues, id: string, needle: string, nth = 1, fallback = 0) => {
  const n0 = strip(needle);
  for (const clip of [id, ...q.ids.filter((x) => x !== id)]) {
    let n = 0;
    for (const [t, w] of words[clip] ?? []) {
      const ww = strip(w);
      if (ww === n0 || ww.includes(n0)) {
        n++;
        if (n === nth) return q.s[clip] + Math.round(t * FPS);
      }
    }
  }
  return q.s[id] !== undefined ? at(q, id, fallback) : q.s[q.ids[0]];
};

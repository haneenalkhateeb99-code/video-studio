import React from "react";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { SceneKey } from "./lab13/narration";
import { DiagramScene, DryScene, FlowScene, ObjectivesScene, TitleScene, WetScene } from "./lab13/ScenesA";
import { CurvesScene, EndScene, ManometerScene, ReadingsScene, RegimesScene, ShutdownScene } from "./lab13/ScenesB";
import { cues } from "./lab13/timing";
import { Voice } from "./lab13/Voice";

// CMET205 Lab 13 — Measurement of Pressure Drop in a Packed Column.
// Visual identity follows the supplied lab deck. Arabic voice-over, no music.
// Each scene lasts as long as its narration (see lab13/timing.ts).
const SCENES: { key: SceneKey; name: string; C: React.FC }[] = [
  { key: "title", name: "Title", C: TitleScene },
  { key: "objectives", name: "Objectives", C: ObjectivesScene },
  { key: "diagram", name: "Equipment diagram", C: DiagramScene },
  { key: "flow", name: "Water & air flow", C: FlowScene },
  { key: "dry", name: "Dry column test", C: DryScene },
  { key: "wet", name: "Wet column test", C: WetScene },
  { key: "manometer", name: "Manometer", C: ManometerScene },
  { key: "regimes", name: "Dry / Wet / Loading / Flooding", C: RegimesScene },
  { key: "curves", name: "Illustrative curves", C: CurvesScene },
  { key: "readings", name: "Reliable readings", C: ReadingsScene },
  { key: "shutdown", name: "Shutdown", C: ShutdownScene },
  { key: "end", name: "Closing", C: EndScene },
];
const FADE = 15;

export const LAB13_DURATION =
  SCENES.reduce((s, x) => s + cues(x.key).dur, 0) - (SCENES.length - 1) * FADE;

export const PackedColumnLab: React.FC = () => (
  <TransitionSeries>
    {SCENES.map(({ key, name, C }, i) => (
      <React.Fragment key={key}>
        {i > 0 ? (
          <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: FADE })} />
        ) : null}
        <TransitionSeries.Sequence name={name} durationInFrames={cues(key).dur}>
          <C />
          <Voice scene={key} />
        </TransitionSeries.Sequence>
      </React.Fragment>
    ))}
  </TransitionSeries>
);

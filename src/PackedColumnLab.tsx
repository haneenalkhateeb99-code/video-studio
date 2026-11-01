import React from "react";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { DiagramScene, DryScene, FlowScene, ObjectivesScene, TitleScene, WetScene } from "./lab13/ScenesA";
import { CurvesScene, EndScene, ManometerScene, ReadingsScene, RegimesScene, ShutdownScene } from "./lab13/ScenesB";

// CMET205 Lab 13 — Measurement of Pressure Drop in a Packed Column.
// Visual identity follows the supplied lab deck. Silent version (no music / voice-over).
const SCENES: { name: string; seconds: number; C: React.FC }[] = [
  { name: "Title", seconds: 7, C: TitleScene },
  { name: "Objectives", seconds: 11, C: ObjectivesScene },
  { name: "Equipment diagram", seconds: 14, C: DiagramScene },
  { name: "Water & air flow", seconds: 16, C: FlowScene },
  { name: "Dry column test", seconds: 14, C: DryScene },
  { name: "Wet column test", seconds: 14, C: WetScene },
  { name: "Manometer", seconds: 18, C: ManometerScene },
  { name: "Dry / Wet / Loading / Flooding", seconds: 20, C: RegimesScene },
  { name: "Illustrative curves", seconds: 14, C: CurvesScene },
  { name: "Reliable readings", seconds: 10, C: ReadingsScene },
  { name: "Shutdown", seconds: 11, C: ShutdownScene },
  { name: "Closing", seconds: 5, C: EndScene },
];
const FPS = 30;
const FADE = 15;

export const LAB13_DURATION =
  SCENES.reduce((s, x) => s + x.seconds * FPS, 0) - (SCENES.length - 1) * FADE;

export const PackedColumnLab: React.FC = () => (
  <TransitionSeries>
    {SCENES.map(({ name, seconds, C }, i) => (
      <React.Fragment key={name}>
        {i > 0 ? (
          <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: FADE })} />
        ) : null}
        <TransitionSeries.Sequence name={name} durationInFrames={seconds * FPS}>
          <C />
        </TransitionSeries.Sequence>
      </React.Fragment>
    ))}
  </TransitionSeries>
);

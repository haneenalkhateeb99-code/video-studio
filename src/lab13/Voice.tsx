import React from "react";
import { Audio } from "@remotion/media";
import { staticFile } from "remotion";
import { SceneKey } from "./narration";
import { cues } from "./timing";

/** Plays the voice-over clips of one scene at their cue frames. */
export const Voice: React.FC<{ scene: SceneKey }> = ({ scene }) => {
  const q = cues(scene);
  return (
    <>
      {q.ids.map((id) => (
        <Audio key={id} name={`VO ${id}`} from={q.s[id]} src={staticFile(`lab13/vo/${id}.mp3`)} />
      ))}
    </>
  );
};

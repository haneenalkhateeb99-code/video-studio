import React from "react";
import { AbsoluteFill } from "remotion";
import { BigFlorals, FrameDecor, MarginFlorals, PaperBackground } from "./Decor";

// Static design layers, rendered once to PNG (scripts/gender-reveal/layers.sh) so the
// expensive SVG watercolor filters are not recomputed on every video frame.
export const Layers: React.FC<{ layer: "bg" | "frame" | "card" }> = ({ layer }) => {
  if (layer === "frame") return <FrameDecor />;
  return (
    <AbsoluteFill>
      <PaperBackground drift={false} />
      {layer === "bg" ? <MarginFlorals /> : <BigFlorals />}
    </AbsoluteFill>
  );
};

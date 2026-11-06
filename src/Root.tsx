import { Composition } from "remotion";
import { HelloWorld } from "./HelloWorld";
import { GenderReveal, GENDER_REVEAL_FRAMES } from "./GenderReveal/GenderReveal";
import { Layers } from "./GenderReveal/Layers";

// Every video is registered here as a <Composition>.
// To render one: npx remotion render <id> out/<name>.mp4
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="HelloWorld"
        component={HelloWorld}
        durationInFrames={150} // 5 seconds × 30 fps
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          title: "مرحبًا من Remotion",
          subtitle: "اختبار الإعداد · Video Studio",
        }}
      />
      <Composition
        id="GenderReveal"
        component={GenderReveal}
        durationInFrames={GENDER_REVEAL_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="GenderRevealLayers"
        component={Layers}
        durationInFrames={1}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ layer: "bg" as "bg" | "frame" | "card" }}
      />
    </>
  );
};

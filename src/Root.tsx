import { Composition } from "remotion";
import { HelloWorld } from "./HelloWorld";

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
    </>
  );
};

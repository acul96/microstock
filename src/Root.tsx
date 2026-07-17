import { Composition } from "remotion";
import Main from "./Main";

export const Root = () => {
  return (
    <Composition
      id="HotAirBalloonLoop"
      component={Main}
      durationInFrames={300}
      fps={30}
      width={3840}
      height={2160}
      backgroundColor="transparent"
    />
  );
};
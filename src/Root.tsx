// src/Root.tsx
import { Composition } from "remotion";
import Main from "./Main";

export const Root = () => {
  return (
    <Composition
      id="PremiumCoffeeAnimation"
      component={Main}
      durationInFrames={300}
      fps={30}
      width={3840}
      height={2160}
    />
  );
};
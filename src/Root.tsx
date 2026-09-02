import React from "react";
import { Composition } from "remotion";
import { FullVideo_Part2_3 } from "./compositions/FullVideo_Part2_3";
import { Part2_DetailedReading } from "./compositions/Part2_DetailedReading";
import { Part3_PoeticMap } from "./compositions/Part3_PoeticMap";
import { FPS } from "./data/storyboardData";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Part 2 Only: 逐句精读 (4:25 - 5:28.5, Total 63.5s / 1905 frames) - 默认首选预览 */}
      <Composition
        id="Part2-DetailedReading"
        component={Part2_DetailedReading}
        durationInFrames={1905}
        fps={FPS}
        width={1920}
        height={1080}
      />
    </>
  );
};

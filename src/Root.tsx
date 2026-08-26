import React from "react";
import { Composition } from "remotion";
import { FullVideo_Part2_3 } from "./compositions/FullVideo_Part2_3";
import { Part2_DetailedReading } from "./compositions/Part2_DetailedReading";
import { Part3_PoeticMap } from "./compositions/Part3_PoeticMap";
import { FPS } from "./data/storyboardData";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Complete Video: Part 2 + Part 3 (4:25 - 6:30, Total 123.5s / 3705 frames) */}
      <Composition
        id="FullVideo"
        component={FullVideo_Part2_3}
        durationInFrames={3705}
        fps={FPS}
        width={1920}
        height={1080}
      />

      {/* Part 2 Only: 逐句精读 (4:25 - 5:28.5, Total 63.5s / 1905 frames) */}
      <Composition
        id="Part2-DetailedReading"
        component={Part2_DetailedReading}
        durationInFrames={1905}
        fps={FPS}
        width={1920}
        height={1080}
      />

      {/* Part 3 Only: 完整情感地图 (5:30 - 6:30, Total 60s / 1800 frames) */}
      <Composition
        id="Part3-PoeticMap"
        component={Part3_PoeticMap}
        durationInFrames={1800}
        fps={FPS}
        width={1920}
        height={1080}
      />
    </>
  );
};

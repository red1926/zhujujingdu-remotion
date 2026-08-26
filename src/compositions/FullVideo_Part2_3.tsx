import React from "react";
import { AbsoluteFill, Series } from "remotion";
import { Part2_DetailedReading } from "./Part2_DetailedReading";
import { Part3_PoeticMap } from "./Part3_PoeticMap";

export const FullVideo_Part2_3: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#06090e" }}>
      <Series>
        {/* Part 2: 4:25 - 5:28.5 (63.5s / 1905 frames) */}
        <Series.Sequence durationInFrames={1905}>
          <Part2_DetailedReading />
        </Series.Sequence>

        {/* Part 3: 5:30 - 6:30 (60s / 1800 frames) */}
        <Series.Sequence durationInFrames={1800}>
          <Part3_PoeticMap />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};

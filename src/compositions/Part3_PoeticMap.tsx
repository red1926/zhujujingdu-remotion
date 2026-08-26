import React from "react";
import { AbsoluteFill, interpolate, Series, useCurrentFrame, staticFile } from "remotion";
import { BackgroundLayer } from "../components/BackgroundLayer";
import { PoeticFullMap } from "../components/PoeticFullMap";
import { SHOT_CONFIGS, STYLE_TOKENS } from "../data/storyboardData";

const Shot13Sequence: React.FC = () => {
  return (
    <AbsoluteFill>
      <BackgroundLayer
        theme="full-map"
        shotNumber={13}
      />
      <PoeticFullMap shotNumber={13} />
    </AbsoluteFill>
  );
};

const Shot14Sequence: React.FC = () => {
  return (
    <AbsoluteFill>
      <BackgroundLayer
        theme="full-map"
        shotNumber={14}
      />
      <PoeticFullMap shotNumber={14} />
    </AbsoluteFill>
  );
};

export const Part3_PoeticMap: React.FC = () => {
  const shot13 = SHOT_CONFIGS[5]; // 660f (22s)
  const shot14 = SHOT_CONFIGS[6]; // 1140f (38s)

  return (
    <AbsoluteFill style={{ backgroundColor: "#06090e" }}>
      <Series>
        {/* Shot 13: 完整情感地图呈现 (22s / 660f) */}
        <Series.Sequence durationInFrames={shot13.durationInFrames}>
          <Shot13Sequence />
        </Series.Sequence>

        {/* Shot 14: 情感地图定格与小结 (38s / 1140f) */}
        <Series.Sequence durationInFrames={shot14.durationInFrames}>
          <Shot14Sequence />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};


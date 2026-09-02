import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { CoordinateMap } from "./CoordinateMap";
import { CalligraphyVerse } from "./CalligraphyVerse";

export const SpatiotemporalFold: React.FC = () => {
  const frame = useCurrentFrame();

  // Dual coordinates appear strictly when analyzing the fold (at frame >= 45)
  const showDual = frame >= 45;
  const foldProgress = interpolate(frame, [45, 85], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      {/* Left side: Coordinate Map transitioning into pure dual coordinates */}
      <CoordinateMap
        currentVerseIndex={4}
        localVerseFrame={frame}
        highlightFold={showDual}
        foldProgress={foldProgress}
        size={680}
        position={{ top: 180, left: 60 }}
      />

      {/* Right side Container: Vertically Centered */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          transform: "translateY(-50%)",
          left: 960,
          right: 70,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          pointerEvents: "none",
        }}
      >
        <CalligraphyVerse
          stageTag="【第 4 句 · 时空重影】"
          verse="却话巴山夜雨时"
          evidence="一个现在，被带进了将来。"
          subEvidence="双重时空在此重合，单点坐标失效"
          theme="spatiotemporal-fold"
        />
      </div>
    </AbsoluteFill>
  );
};

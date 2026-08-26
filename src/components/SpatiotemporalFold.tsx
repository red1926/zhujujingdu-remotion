import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { CoordinateMap } from "./CoordinateMap";
import { CalligraphyVerse } from "./CalligraphyVerse";

export const SpatiotemporalFold: React.FC = () => {
  const frame = useCurrentFrame();

  // Dual coordinates appear strictly when analyzing the fold (at frame >= 60 / 2 seconds into S12)
  const showDual = frame >= 60;

  return (
    <AbsoluteFill>
      {/* Left side: Coordinate Map transitioning into pure dual coordinates */}
      <CoordinateMap
        activePointIds={showDual ? ["4_scene", "4_topic"] : ["3"]}
        visitedPointIds={showDual ? ["4_scene", "4_topic"] : ["1", "2", "3"]}
        highlightFold={showDual}
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
          verse="却话巴山夜雨时"
          voiceover="西窗仍然在，但巴山的雨从烛光里浮现了——将来的人，在回忆此刻的夜雨。一个点容纳不了两层时空。"
          theme="spatiotemporal-fold"
          note={showDual ? "◎ 时空重影结构 · 双重坐标共振" : "④ 诗境精读 · 终极高潮"}
        />
      </div>
    </AbsoluteFill>
  );
};

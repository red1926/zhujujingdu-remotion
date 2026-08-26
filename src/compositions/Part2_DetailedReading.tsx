import React from "react";
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame, interpolate } from "remotion";
import { BackgroundLayer } from "../components/BackgroundLayer";
import { CoordinateMap } from "../components/CoordinateMap";
import { CalligraphyVerse } from "../components/CalligraphyVerse";
import { SpatiotemporalFold } from "../components/SpatiotemporalFold";
import { SHOT_CONFIGS } from "../data/storyboardData";

const CrossfadeWrapper: React.FC<{
  durationInFrames: number;
  overlap: number;
  isFirst?: boolean;
  isLast?: boolean;
  children: React.ReactNode;
}> = ({ durationInFrames, overlap, isFirst, isLast, children }) => {
  const frame = useCurrentFrame();
  
  let opacity = 1;
  if (!isFirst) {
    opacity = interpolate(frame, [0, overlap], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  }
  if (!isLast) {
    const outOpacity = interpolate(frame, [durationInFrames - overlap, durationInFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    opacity = Math.min(opacity, outOpacity);
  }

  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};

export const Part2_DetailedReading: React.FC = () => {
  const shot8 = SHOT_CONFIGS[0]; // 300f (10s)
  const shot9 = SHOT_CONFIGS[1]; // 390f (13s)
  const shot10 = SHOT_CONFIGS[2]; // 390f (13s)
  const shot11 = SHOT_CONFIGS[3]; // 390f (13s)
  const shot12 = SHOT_CONFIGS[4]; // 480f (16s)

  // Background Timing with 15 frames overlap for seamless video crossfade
  const bg1Duration = shot8.durationInFrames + shot9.durationInFrames; // 690f (0 to 690)
  const bg2Start = bg1Duration - 15; // 675f
  const bg2Duration = shot10.durationInFrames; // 390f (675 to 1065)
  const bg3Start = bg2Start + bg2Duration - 15; // 1050f
  const bg3Duration = shot11.durationInFrames; // 390f (1050 to 1440)
  const bg4Start = bg3Start + bg3Duration - 15; // 1425f
  const bg4Duration = shot12.durationInFrames; // 480f (1425 to 1905)

  // UI Timing (Switch cleanly at logical shot boundaries)
  const ui8Duration = shot8.durationInFrames; // 300f (0 to 300)
  const ui9Duration = shot9.durationInFrames; // 390f (300 to 690)
  const ui10Start = 690;
  const ui10Duration = 375; // 690 to 1065
  const ui11Start = 1065;
  const ui11Duration = 375; // 1065 to 1440
  const ui12Start = 1440;
  const ui12Duration = 465; // 1440 to 1905

  return (
    <AbsoluteFill style={{ backgroundColor: "#06090e" }}>
      {/* =========================================================================
          LAYER 1: BACKGROUND VIDEOS (Decoupled, Overlapping & Crossfading)
          ========================================================================= */}
      <AbsoluteFill style={{ zIndex: 0 }}>
        {/* Background 1: S8-S9 (夜雨连绵 2x 无缝循环) */}
        <Sequence from={0} durationInFrames={bg1Duration}>
          <CrossfadeWrapper durationInFrames={bg1Duration} overlap={15} isFirst>
            <BackgroundLayer
              theme={shot8.theme}
              shotNumber={8}
              videoSrc={staticFile("assets/s8-s9(2.0).mp4")}
              baseVideoMode="crossfade-loop-2x"
              volume={0.10}
            />
          </CrossfadeWrapper>
        </Sequence>

        {/* Background 2: S10 (暴雨涨池) */}
        <Sequence from={bg2Start} durationInFrames={bg2Duration}>
          <CrossfadeWrapper durationInFrames={bg2Duration} overlap={15}>
            <BackgroundLayer
              theme={shot10.theme}
              shotNumber={10}
              videoSrc={staticFile("assets/s10.mp4")}
              baseVideoMode="custom-rate"
              customPlaybackRate={300 / shot10.durationInFrames}
              volume={0.12}
            />
          </CrossfadeWrapper>
        </Sequence>

        {/* Background 3: S11 (冲破雨幕进入西窗) */}
        <Sequence from={bg3Start} durationInFrames={bg3Duration}>
          <CrossfadeWrapper durationInFrames={bg3Duration} overlap={15}>
            <BackgroundLayer
              theme={shot11.theme}
              shotNumber={11}
              videoSrc={staticFile("assets/s11(2.0).mp4")}
              baseVideoMode="time-remap-s11"
              volume={(f) =>
                interpolate(f, [130, 150], [0.12, 0.04], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                })
              }
            />
          </CrossfadeWrapper>
        </Sequence>

        {/* Background 4: S12 (时空定格西窗) */}
        <Sequence from={bg4Start} durationInFrames={bg4Duration}>
          <CrossfadeWrapper durationInFrames={bg4Duration} overlap={15} isLast>
            <BackgroundLayer
              theme={shot12.theme}
              shotNumber={12}
              videoSrc={staticFile("assets/s12.mp4")}
              baseVideoMode="custom-rate"
              customPlaybackRate={300 / shot12.durationInFrames}
              volume={0.04}
            />
          </CrossfadeWrapper>
        </Sequence>
      </AbsoluteFill>

      {/* =========================================================================
          LAYER 2: FOREGROUND UI (Cumulative Progressive Map Points & Centered Card)
          ========================================================================= */}
      <AbsoluteFill style={{ zIndex: 10 }}>
        {/* UI Shot 8: AI已退场 · 回到诗境 (0 - 300) */}
        <Sequence from={0} durationInFrames={ui8Duration}>
          <CoordinateMap
            activePointIds={[]}
            visitedPointIds={[]}
            size={680}
            position={{ top: 180, left: 60 }}
            showGrid={false}
          />
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
              verse="AI已退场 · 回到诗境"
              voiceover={shot8.voiceover}
              theme={shot8.theme}
              note="逐句精读序幕"
            />
          </div>
        </Sequence>

        {/* UI Shot 9: 君问归期未有期 (300 - 690) */}
        <Sequence from={ui8Duration} durationInFrames={ui9Duration}>
          <CoordinateMap
            activePointIds={["1"]}
            visitedPointIds={["1"]}
            size={680}
            position={{ top: 180, left: 60 }}
          />
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
              verse={shot9.verse || ""}
              voiceover={shot9.voiceover}
              theme={shot9.theme}
              note="① 现实现在 · 孤寂沉郁 (-2)"
            />
          </div>
        </Sequence>

        {/* UI Shot 10: 巴山夜雨涨秋池 (690 - 1065) */}
        <Sequence from={ui10Start} durationInFrames={ui10Duration}>
          <CoordinateMap
            activePointIds={["2"]}
            visitedPointIds={["1", "2"]}
            size={680}
            position={{ top: 180, left: 60 }}
          />
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
              verse={shot10.verse || ""}
              voiceover={shot10.voiceover}
              theme={shot10.theme}
              note="② 现实现在 · 夜雨涨池 (-4)"
            />
          </div>
        </Sequence>

        {/* UI Shot 11: 何当共剪西窗烛 (1065 - 1440) */}
        <Sequence from={ui11Start} durationInFrames={ui11Duration}>
          <CoordinateMap
            activePointIds={["3"]}
            visitedPointIds={["1", "2", "3"]}
            size={680}
            position={{ top: 180, left: 60 }}
          />
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
              verse={shot11.verse || ""}
              voiceover={shot11.voiceover}
              theme={shot11.theme}
              note="③ 想象将来 · 温暖期待 (+3)"
            />
          </div>
        </Sequence>

        {/* UI Shot 12: 却话巴山夜雨时 · 时空折叠 (1440 - 1905) */}
        <Sequence from={ui12Start} durationInFrames={ui12Duration}>
          <SpatiotemporalFold />
        </Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

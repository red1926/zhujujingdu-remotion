import React from "react";
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame, interpolate } from "remotion";
import { BackgroundLayer } from "../components/BackgroundLayer";
import { CoordinateMap } from "../components/CoordinateMap";
import { CalligraphyVerse } from "../components/CalligraphyVerse";
import { SHOT_CONFIGS } from "../data/storyboardData";

const ImageCrossfadeLayer: React.FC<{
  from: number;
  durationInFrames: number;
  fadeInFrames?: number;
  children: React.ReactNode;
}> = ({ from, durationInFrames, fadeInFrames = 0, children }) => {
  const currentFrame = useCurrentFrame();
  const localFrame = currentFrame - from;

  let opacity = 1;
  if (fadeInFrames > 0) {
    opacity = interpolate(localFrame, [0, fadeInFrames], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  }

  return (
    <Sequence from={from} durationInFrames={durationInFrames}>
      <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>
    </Sequence>
  );
};

const Shot11ImageBackground: React.FC = () => {
  const frame = useCurrentFrame();
  // 0 ~ 120 frames: s10-s11.jpg with push-in camera move
  // 90 ~ 375 frames: s11.jpg interior candle scene fades in
  const interiorOpacity = interpolate(frame, [80, 125], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <BackgroundLayer
        theme="cold"
        shotNumber={11}
        imageSrc={staticFile("分镜首尾帧/s10-s11.jpg")}
        kenBurns={{ startScale: 1.0, endScale: 1.08 }}
      />
      <AbsoluteFill style={{ opacity: interiorOpacity }}>
        <BackgroundLayer
          theme="warm"
          shotNumber={11}
          imageSrc={staticFile("分镜首尾帧/s11.jpg")}
          kenBurns={{ startScale: 1.0, endScale: 1.03 }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Shot12ImageBackground: React.FC = () => {
  const frame = useCurrentFrame();
  // Starts with close-up candle trimming s12.jpg, then smoothly transitions to s12 (2).jpg (时空重影)
  const foldOpacity = interpolate(frame, [45, 85], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <BackgroundLayer
        theme="warm"
        shotNumber={12}
        imageSrc={staticFile("分镜首尾帧/s12.jpg")}
        kenBurns={{ startScale: 1.0, endScale: 1.03 }}
      />
      <AbsoluteFill style={{ opacity: foldOpacity }}>
        <BackgroundLayer
          theme="spatiotemporal-fold"
          shotNumber={12}
          imageSrc={staticFile("分镜首尾帧/s12 (2).jpg")}
          kenBurns={{ startScale: 1.0, endScale: 1.04 }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const Part2_DetailedReading: React.FC = () => {
  const frame = useCurrentFrame();

  const shot8 = SHOT_CONFIGS[0]; // 300f (10s)
  const shot9 = SHOT_CONFIGS[1]; // 390f (13s)
  const shot10 = SHOT_CONFIGS[2]; // 375f (12.5s)
  const shot11 = SHOT_CONFIGS[3]; // 375f (12.5s)
  const shot12 = SHOT_CONFIGS[4]; // 465f (15.5s)

  // Timing for background layers with smooth crossfade
  const bg8Duration = 300;
  const bg9Start = 285;
  const bg9Duration = 390 + 15; // 285 to 690
  const bg10Start = 675;
  const bg10Duration = 375 + 15; // 675 to 1065
  const bg11Start = 1050;
  const bg11Duration = 375 + 15; // 1050 to 1440
  const bg12Start = 1425;
  const bg12Duration = 465 + 15; // 1425 to 1905

  // Determine current active verse index and local frame within that verse
  let currentVerseIndex = 0;
  let localVerseFrame = 0;
  let highlightFold = false;
  let foldProgress = 0;

  if (frame < 300) {
    // Shot 8 (0 - 300): AI退场，只有坐标系框架，无点
    currentVerseIndex = 0;
    localVerseFrame = frame;
    highlightFold = false;
    foldProgress = 0;
  } else if (frame < 690) {
    // Shot 9 (300 - 690): 第1句，点1下沉
    currentVerseIndex = 1;
    localVerseFrame = frame - 300;
    highlightFold = false;
    foldProgress = 0;
  } else if (frame < 1065) {
    // Shot 10 (690 - 1065): 第2句，点2沉到底部
    currentVerseIndex = 2;
    localVerseFrame = frame - 690;
    highlightFold = false;
    foldProgress = 0;
  } else if (frame < 1440) {
    // Shot 11 (1065 - 1440): 第3句，点3跨越跃升至西窗
    currentVerseIndex = 3;
    localVerseFrame = frame - 1065;
    highlightFold = false;
    foldProgress = 0;
  } else {
    // Shot 12 (1440 - 1905): 第4句，双坐标时空重影 / 规则断裂
    currentVerseIndex = 4;
    localVerseFrame = frame - 1440;
    if (localVerseFrame >= 45) {
      highlightFold = true;
      foldProgress = interpolate(localVerseFrame, [45, 85], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
    }
  }

  return (
    <AbsoluteFill style={{ backgroundColor: "#06090e" }}>
      {/* =========================================================================
          LAYER 1: BACKGROUND IMAGES (Storyboard Keyframes with Smooth Crossfade)
          ========================================================================= */}
      <AbsoluteFill style={{ zIndex: 0 }}>
        {/* Background 1: S8 (AI界面退场 · 序幕) */}
        <Sequence from={0} durationInFrames={bg8Duration}>
          <BackgroundLayer
            theme={shot8.theme}
            shotNumber={8}
            imageSrc={staticFile("分镜首尾帧/s8.0.jpg")}
            kenBurns={{ startScale: 1.0, endScale: 1.03 }}
          />
        </Sequence>

        {/* Background 2: S9 (君问归期未有期) */}
        <ImageCrossfadeLayer from={bg9Start} durationInFrames={bg9Duration} fadeInFrames={15}>
          <BackgroundLayer
            theme={shot9.theme}
            shotNumber={9}
            imageSrc={staticFile("分镜首尾帧/s9.jpg")}
            kenBurns={{ startScale: 1.0, endScale: 1.035 }}
          />
        </ImageCrossfadeLayer>

        {/* Background 3: S10 (巴山夜雨涨秋池) */}
        <ImageCrossfadeLayer from={bg10Start} durationInFrames={bg10Duration} fadeInFrames={15}>
          <BackgroundLayer
            theme={shot10.theme}
            shotNumber={10}
            imageSrc={staticFile("分镜首尾帧/s10.jpg")}
            kenBurns={{ startScale: 1.0, endScale: 1.04 }}
          />
        </ImageCrossfadeLayer>

        {/* Background 4: S11 (何当共剪西窗烛: 推镜头进入西窗暖室) */}
        <ImageCrossfadeLayer from={bg11Start} durationInFrames={bg11Duration} fadeInFrames={15}>
          <Shot11ImageBackground />
        </ImageCrossfadeLayer>

        {/* Background 5: S12 (却话巴山夜雨时: 西窗烛光转时空重影) */}
        <ImageCrossfadeLayer from={bg12Start} durationInFrames={bg12Duration} fadeInFrames={15}>
          <Shot12ImageBackground />
        </ImageCrossfadeLayer>
      </AbsoluteFill>

      {/* =========================================================================
          LAYER 2: PERSISTENT CONTINUOUS COORDINATE MAP (Dynamic Trajectories)
          ========================================================================= */}
      <AbsoluteFill style={{ zIndex: 10 }}>
        <CoordinateMap
          currentVerseIndex={currentVerseIndex}
          localVerseFrame={localVerseFrame}
          highlightFold={highlightFold}
          foldProgress={foldProgress}
          size={680}
          position={{ top: 180, left: 60 }}
          showGrid={true}
        />
      </AbsoluteFill>

      {/* =========================================================================
          LAYER 3: RIGHT-SIDE CALLIGRAPHY VERSE & EVIDENCE (Distinct Pedagogical Hierarchy)
          ========================================================================= */}
      <AbsoluteFill style={{ zIndex: 20 }}>
        {/* Shot 8: 序幕 (0 - 300f) */}
        <Sequence from={0} durationInFrames={300}>
          <div
            style={{
              position: "absolute",
              top: "50%",
              transform: "translateY(-50%)",
              left: 960,
              right: 70,
              pointerEvents: "none",
            }}
          >
            <CalligraphyVerse
              stageTag="【逐句精读序幕】"
              verse="AI已退场 · 回到诗境"
              evidence="现在，让我们回到诗本身，逐句看。"
              theme={shot8.theme}
            />
          </div>
        </Sequence>

        {/* Shot 9: 第一句 (300 - 690f) —— 层级一：确认现实 · 建立读图 */}
        <Sequence from={300} durationInFrames={390}>
          <div
            style={{
              position: "absolute",
              top: "50%",
              transform: "translateY(-50%)",
              left: 960,
              right: 70,
              pointerEvents: "none",
            }}
          >
            <CalligraphyVerse
              stageTag="【第 1 句 · 确认现实】"
              verse="君问归期未有期"
              evidence="归期未定，现实仍停在巴山。"
              subEvidence="诗意落点：① 巴山 · 此刻"
              theme={shot9.theme}
            />
          </div>
        </Sequence>

        {/* Shot 10: 第二句 (690 - 1065f) —— 层级二：同向加深 · 情感下沉 */}
        <Sequence from={690} durationInFrames={375}>
          <div
            style={{
              position: "absolute",
              top: "50%",
              transform: "translateY(-50%)",
              left: 960,
              right: 70,
              pointerEvents: "none",
            }}
          >
            <CalligraphyVerse
              stageTag="【第 2 句 · 情绪加深】"
              verse="巴山夜雨涨秋池"
              evidence="现实没有离开，情绪却继续下沉。"
              subEvidence="诗意落点：② 沉到底部"
              theme={shot10.theme}
            />
          </div>
        </Sequence>

        {/* Shot 11: 第三句 (1065 - 1440f) —— 层级三：解释退出主视觉，聚焦西窗与大跃升 */}
        <Sequence from={1065} durationInFrames={375}>
          <div
            style={{
              position: "absolute",
              top: "50%",
              transform: "translateY(-50%)",
              left: 960,
              right: 70,
              pointerEvents: "none",
            }}
          >
            <CalligraphyVerse
              stageTag="【第 3 句 · 跨越跃升】"
              verse="何当共剪西窗烛"
              evidence="从现实滑向想象。"
              subEvidence="诗意落点：③ 西窗 · 将来"
              theme={shot11.theme}
              subdued={true}
            />
          </div>
        </Sequence>

        {/* Shot 12: 第四句 / 时空折叠 (1440 - 1905f) —— 层级四：前3.5秒无文字，随后浮现终极诗性结语 */}
        <Sequence from={1440} durationInFrames={465}>
          {(() => {
            const localShot12 = frame - 1440;
            // First 105 frames (3.5s): Hide card to give full visual stage to the double exposure & dual points
            const cardFadeIn = interpolate(localShot12, [95, 125], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });

            if (cardFadeIn <= 0.01) return null;

            return (
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  transform: "translateY(-50%)",
                  left: 960,
                  right: 70,
                  opacity: cardFadeIn,
                  pointerEvents: "none",
                }}
              >
                <CalligraphyVerse
                  stageTag="【第 4 句 · 时空重影】"
                  verse="却话巴山夜雨时"
                  evidence="一个现在，被带进了将来。"
                  subEvidence="双重时空在此重合，单点坐标失效"
                  theme={shot12.theme}
                />
              </div>
            );
          })()}
        </Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

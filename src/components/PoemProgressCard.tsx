import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { STYLE_TOKENS } from "../data/storyboardData";

interface PoemProgressCardProps {
  activeVerseIndex: number;
  theme?: "cold" | "warm" | "spatiotemporal-fold" | "full-map";
  showDualCoords?: boolean;
}

interface VerseItem {
  index: number;
  text: string;
  spatiotemporal: string;
  emotionTag: string;
  themeColor: string;
}

const POEM_VERSES: VerseItem[] = [
  {
    index: 1,
    text: "君问归期未有期",
    spatiotemporal: "现实 · 巴山此刻",
    emotionTag: "孤寂 (-2)",
    themeColor: "#3a86ff",
  },
  {
    index: 2,
    text: "巴山夜雨涨秋池",
    spatiotemporal: "现实 · 巴山此刻",
    emotionTag: "沉郁 (-4)",
    themeColor: "#00b4d8",
  },
  {
    index: 3,
    text: "何当共剪西窗烛",
    spatiotemporal: "想象 · 西窗将来",
    emotionTag: "期待 (+3)",
    themeColor: "#ffb703",
  },
  {
    index: 4,
    text: "却话巴山夜雨时",
    spatiotemporal: "时空重影 · 虚实重叠",
    emotionTag: "双重坐标 ◎",
    themeColor: "#fb8500",
  },
];

export const PoemProgressCard: React.FC<PoemProgressCardProps> = ({
  activeVerseIndex,
  theme = "cold",
  showDualCoords = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 85 },
  });

  const translateY = interpolate(entrance, [0, 1], [15, 0]);
  const opacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  const pulse = interpolate(Math.sin(frame * 0.15), [-1, 1], [0.85, 1.15]);

  return (
    <div
      style={{
        width: "100%",
        height: 400, // Fixed height: 260 (upper) + 20 (gap) + 400 = 680px (exact bottom alignment at y: 860px)
        opacity,
        transform: `translateY(${translateY}px)`,
        backgroundColor: "rgba(8, 14, 24, 0.32)",
        border: "1px solid rgba(255, 255, 255, 0.12)",
        borderRadius: "0 16px 16px 0",
        borderLeft: "6px solid rgba(255, 183, 3, 0.8)",
        boxShadow: "0 16px 36px rgba(0,0,0,0.5)",
        backdropFilter: "blur(8px)",
        padding: "24px 36px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxSizing: "border-box",
        pointerEvents: "none",
      }}
    >
      {/* Header Row: Title & Poem Label */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          paddingBottom: 10,
        }}
      >
        <div
          style={{
            fontSize: 18,
            fontFamily: STYLE_TOKENS.fontKai,
            fontWeight: "bold",
            color: "#ffe8a3",
            letterSpacing: 2,
            textShadow: "0 2px 8px rgba(0,0,0,0.8)",
          }}
        >
          《夜雨寄北》全诗诗脉与时空进程
        </div>
        <div
          style={{
            fontSize: 14,
            fontFamily: STYLE_TOKENS.fontSong,
            color: "#cbd5e1",
            letterSpacing: 1,
          }}
        >
          [唐] 李商隐
        </div>
      </div>

      {/* 4 Verses Interactive Rows */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {POEM_VERSES.map((item) => {
          const isActive = activeVerseIndex === item.index;
          const isPassed = activeVerseIndex > item.index;
          const isVerse4Active = item.index === 4 && isActive;

          return (
            <div
              key={item.index}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 6,
                padding: "11px 18px",
                borderRadius: 8,
                backgroundColor: isActive
                  ? "rgba(255, 183, 3, 0.16)"
                  : isPassed
                  ? "rgba(255, 255, 255, 0.04)"
                  : "transparent",
                border: isActive
                  ? `1.5px solid ${item.themeColor}`
                  : "1.5px solid transparent",
                boxShadow: isActive
                  ? `0 0 16px ${item.themeColor}33`
                  : "none",
                transition: "all 0.3s ease",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                {/* Left Verse Text & Status indicator */}
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      backgroundColor: isActive
                        ? item.themeColor
                        : isPassed
                        ? "#38bdf8"
                        : "#475569",
                      transform: isActive ? `scale(${pulse})` : "scale(1)",
                      boxShadow: isActive
                        ? `0 0 10px ${item.themeColor}`
                        : "none",
                    }}
                  />

                  <div
                    style={{
                      fontSize: 21,
                      fontFamily: STYLE_TOKENS.fontKai,
                      fontWeight: isActive ? "bold" : "normal",
                      color: isActive
                        ? "#ffffff"
                        : isPassed
                        ? "#e2e8f0"
                        : "#94a3b8",
                      letterSpacing: 2,
                      textShadow: "0 2px 6px rgba(0,0,0,0.8)",
                    }}
                  >
                    {item.text}
                  </div>
                </div>

                {/* Right Tags (Spatiotemporal & Emotion) */}
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div
                    style={{
                      fontSize: 14,
                      fontFamily: STYLE_TOKENS.fontSong,
                      color: isActive ? "#ffd166" : isPassed ? "#cbd5e1" : "#64748b",
                      textShadow: "0 2px 4px rgba(0,0,0,0.7)",
                    }}
                  >
                    {item.spatiotemporal}
                  </div>
                  <div
                    style={{
                      padding: "3px 12px",
                      borderRadius: 6,
                      fontSize: 13,
                      fontFamily: STYLE_TOKENS.fontSong,
                      fontWeight: "500",
                      backgroundColor: isActive
                        ? `${item.themeColor}33`
                        : "rgba(255,255,255,0.06)",
                      color: isActive ? item.themeColor : "#94a3b8",
                      border: `1px solid ${isActive ? item.themeColor : "transparent"}`,
                    }}
                  >
                    {item.emotionTag}
                  </div>
                </div>
              </div>

              {/* In Shot 12, show delicate dual coordinates inline inside verse 4 */}
              {isVerse4Active && showDualCoords && (
                <div
                  style={{
                    borderTop: "1px dashed rgba(251, 133, 0, 0.4)",
                    paddingTop: 6,
                    marginTop: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 13.5,
                    fontFamily: STYLE_TOKENS.fontSong,
                    color: "#ffe8a3",
                  }}
                >
                  <div>
                    <span style={{ color: "#ffb703", fontWeight: "bold" }}>● 场景坐标：</span>西窗将来 (-3, +2)
                  </div>
                  <div>
                    <span style={{ color: "#2a9d8f", fontWeight: "bold" }}>● 话题坐标：</span>巴山此刻 (+4, -4)
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

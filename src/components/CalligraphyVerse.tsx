import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { STYLE_TOKENS } from "../data/storyboardData";

interface CalligraphyVerseProps {
  stageTag?: string; // e.g. "【第 1 句 · 确认现实】"
  verse: string; // e.g. "君问归期未有期"
  evidence?: string; // e.g. "归期未定，现实仍停在巴山。"
  subEvidence?: string; // e.g. "位置：① 巴山 · 此刻"
  theme?: "cold" | "warm" | "spatiotemporal-fold" | "full-map";
  subdued?: boolean; // For Verse 3: steps back visually
  style?: React.CSSProperties;
}

export const CalligraphyVerse: React.FC<CalligraphyVerseProps> = ({
  stageTag,
  verse,
  evidence,
  subEvidence,
  theme = "cold",
  subdued = false,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame,
    fps,
    config: { damping: 18, stiffness: 85 },
  });

  const translateY = interpolate(entrance, [0, 1], [10, 0]);
  const opacity = interpolate(frame, [0, 12], [0, subdued ? 0.82 : 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const isWarm = theme === "warm";
  const isFold = theme === "spatiotemporal-fold";

  // Natural classical text colors (no neon glows)
  const tagColor = isFold
    ? "#fca311"
    : isWarm
    ? "#ffd166"
    : "#90e0ef";

  const titleColor = isFold
    ? "#fff8e7"
    : isWarm
    ? "#fffbf0"
    : "#ffffff";

  return (
    <div
      style={{
        width: "100%",
        opacity,
        transform: `translateY(${translateY}px)`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        boxSizing: "border-box",
        pointerEvents: "none",
        background: "transparent",
        ...style,
      }}
    >
      {/* 1. Stage Identification Tag (Clean, pure classical seal/text) */}
      {stageTag && (
        <div
          style={{
            marginBottom: subdued ? 10 : 14,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div
            style={{
              padding: subdued ? "2px 10px" : "3px 14px",
              background: "rgba(10, 16, 26, 0.45)",
              border: `1px solid ${tagColor}77`,
              borderRadius: "3px",
              color: tagColor,
              fontSize: subdued ? 15 : 17,
              fontFamily: STYLE_TOKENS.fontSong,
              fontWeight: "600",
              letterSpacing: 2,
              textShadow: "0 2px 6px rgba(0,0,0,0.9)",
            }}
          >
            {stageTag}
          </div>
        </div>
      )}

      {/* 2. Main Verse Calligraphy Typography (Natural, Crisp, No Cyber Glowing Line) */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          boxSizing: "border-box",
          background: "transparent",
        }}
      >
        <div
          style={{
            fontSize: subdued ? 46 : 56,
            fontFamily: STYLE_TOKENS.fontKai,
            fontWeight: "bold",
            color: titleColor,
            letterSpacing: subdued ? 5 : 7,
            lineHeight: 1.25,
            textShadow: "0 3px 12px rgba(0,0,0,0.98), 0 0 20px rgba(0,0,0,0.9)",
          }}
        >
          {verse}
        </div>

        {/* 3. Subtle Tapered Hairline Divider */}
        {evidence && (
          <div
            style={{
              marginTop: subdued ? 14 : 18,
              marginBottom: subdued ? 10 : 14,
              height: 1,
              width: subdued ? "65%" : "85%",
              background: `linear-gradient(90deg, ${tagColor}88 0%, rgba(255, 255, 255, 0.2) 60%, transparent 100%)`,
            }}
          />
        )}

        {/* 4. Single-Sentence Text Evidence */}
        {evidence && (
          <div
            style={{
              fontSize: subdued ? 20 : 24,
              fontFamily: STYLE_TOKENS.fontSong,
              color: subdued ? "#cbd5e1" : "#f1f5f9",
              fontWeight: "500",
              lineHeight: 1.65,
              letterSpacing: 1.5,
              textShadow: "0 2px 10px rgba(0,0,0,0.98)",
            }}
          >
            {evidence}
          </div>
        )}

        {/* 5. Sub Evidence / Location Confirmation */}
        {subEvidence && (
          <div
            style={{
              marginTop: 8,
              fontSize: 16,
              fontFamily: STYLE_TOKENS.fontSong,
              color: tagColor,
              opacity: 0.9,
              letterSpacing: 1.5,
              textShadow: "0 2px 8px rgba(0,0,0,0.95)",
            }}
          >
            {subEvidence}
          </div>
        )}
      </div>
    </div>
  );
};

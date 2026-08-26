import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { STYLE_TOKENS } from "../data/storyboardData";

interface CalligraphyVerseProps {
  verse: string;
  voiceover?: string;
  theme?: "cold" | "warm" | "spatiotemporal-fold" | "full-map";
  note?: string;
  style?: React.CSSProperties;
}

export const CalligraphyVerse: React.FC<CalligraphyVerseProps> = ({
  verse,
  voiceover,
  theme = "cold",
  note,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 90 },
  });

  const translateY = interpolate(entrance, [0, 1], [15, 0]);
  const opacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const isWarm = theme === "warm";
  const isFold = theme === "spatiotemporal-fold";

  const borderColor = isFold
    ? "#fb8500"
    : isWarm
    ? "#ffb703"
    : "#48cae4";

  const textColor = isFold
    ? "#ffe8a3"
    : isWarm
    ? "#ffeaa7"
    : "#f0f8ff";

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
        ...style,
      }}
    >
      {/* Top Tag Row / Badge */}
      {note && (
        <div
          style={{
            marginBottom: 16,
            display: "flex",
            alignItems: "center",
          }}
        >
          <div
            style={{
              padding: "6px 22px",
              backgroundColor: "rgba(10, 18, 32, 0.85)",
              border: `1.8px solid ${borderColor}`,
              borderRadius: 8,
              color: borderColor,
              fontSize: 20,
              fontFamily: STYLE_TOKENS.fontKai,
              fontWeight: "bold",
              letterSpacing: 2,
              boxShadow: `0 0 20px ${borderColor}33`,
              backdropFilter: "blur(8px)",
            }}
          >
            {note}
          </div>
        </div>
      )}

      {/* Main Verse Card with Enlarged Legible Typography & Premium Card Design */}
      <div
        style={{
          padding: "36px 42px",
          backgroundColor: "rgba(6, 12, 22, 0.45)",
          borderLeft: `7px solid ${borderColor}`,
          borderTop: "1px solid rgba(255, 255, 255, 0.16)",
          borderRight: "1px solid rgba(255, 255, 255, 0.08)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "0 20px 20px 0",
          boxShadow: "0 20px 48px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.1)",
          backdropFilter: "blur(12px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          boxSizing: "border-box",
        }}
      >
        {/* Main Verse Title Line: Enlarged to 58px for maximum impact */}
        <div
          style={{
            fontSize: 58,
            fontFamily: STYLE_TOKENS.fontKai,
            fontWeight: "bold",
            color: textColor,
            letterSpacing: 6,
            lineHeight: 1.2,
            textShadow: `0 3px 18px rgba(0,0,0,0.95), 0 0 28px ${borderColor}66`,
          }}
        >
          {verse}
        </div>

        {/* Commentary Text Area: Enlarged to 25px with generous line-height */}
        {voiceover && (
          <div
            style={{
              marginTop: 22,
              borderTop: "1px solid rgba(255, 255, 255, 0.16)",
              paddingTop: 20,
              fontSize: 25,
              fontFamily: STYLE_TOKENS.fontSong,
              color: "#f1f5f9",
              fontWeight: "500",
              lineHeight: 1.75,
              letterSpacing: 1.4,
              textShadow: "0 2px 12px rgba(0,0,0,0.95)",
            }}
          >
            {voiceover}
          </div>
        )}
      </div>
    </div>
  );
};

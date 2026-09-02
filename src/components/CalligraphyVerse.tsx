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
    config: { damping: 15, stiffness: 80 },
  });

  const translateY = interpolate(entrance, [0, 1], [14, 0]);
  const opacity = interpolate(frame, [0, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const isWarm = theme === "warm";
  const isFold = theme === "spatiotemporal-fold";

  // Accent color palette
  const accentColor = isFold
    ? "#fb8500"
    : isWarm
    ? "#ffb703"
    : "#48cae4";

  const titleColor = isFold
    ? "#fff3d1"
    : isWarm
    ? "#fffae8"
    : "#f5faff";

  // Atmospheric translucent gradient based on poetic mood
  const cardGradient = isFold
    ? "linear-gradient(135deg, rgba(38, 22, 46, 0.65) 0%, rgba(20, 12, 28, 0.45) 60%, rgba(10, 6, 18, 0.30) 100%)"
    : isWarm
    ? "linear-gradient(135deg, rgba(46, 30, 14, 0.65) 0%, rgba(26, 18, 8, 0.45) 60%, rgba(12, 8, 5, 0.28) 100%)"
    : "linear-gradient(135deg, rgba(16, 28, 48, 0.65) 0%, rgba(8, 18, 32, 0.45) 60%, rgba(5, 12, 22, 0.28) 100%)";

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
      {/* Top Tag Row / Classical Silk Seal Badge */}
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
              padding: "6px 20px",
              background: `linear-gradient(90deg, ${accentColor}28 0%, rgba(8, 14, 26, 0.8) 100%)`,
              border: `1.2px solid ${accentColor}99`,
              borderRadius: "4px 12px 12px 4px",
              color: accentColor,
              fontSize: 19,
              fontFamily: STYLE_TOKENS.fontKai,
              fontWeight: "bold",
              letterSpacing: 2,
              boxShadow: `0 4px 18px rgba(0,0,0,0.5), inset 0 0 10px ${accentColor}22`,
              backdropFilter: "blur(12px)",
            }}
          >
            {note}
          </div>
        </div>
      )}

      {/* Main Verse Card: Translucent Poetic Plaque with Atmospheric Flow */}
      <div
        style={{
          position: "relative",
          padding: "36px 42px",
          background: cardGradient,
          border: "1px solid rgba(255, 255, 255, 0.14)",
          borderTop: "1px solid rgba(255, 255, 255, 0.28)",
          borderRadius: "4px 22px 22px 4px",
          boxShadow: `0 24px 50px rgba(0, 0, 0, 0.6), 0 0 35px ${accentColor}18, inset 0 1px 0 rgba(255, 255, 255, 0.15)`,
          backdropFilter: "blur(16px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          boxSizing: "border-box",
        }}
      >
        {/* Left Decorative Glowing Edge Ribbon */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 5,
            height: "100%",
            background: `linear-gradient(to bottom, ${accentColor} 0%, ${accentColor}66 70%, transparent 100%)`,
            boxShadow: `0 0 12px ${accentColor}`,
          }}
        />

        {/* Main Verse Title Line: Classical Calligraphy with Luminous Glow */}
        <div
          style={{
            fontSize: 56,
            fontFamily: STYLE_TOKENS.fontKai,
            fontWeight: "bold",
            color: titleColor,
            letterSpacing: 8,
            lineHeight: 1.25,
            textShadow: `0 4px 20px rgba(0,0,0,0.95), 0 0 30px ${accentColor}55`,
          }}
        >
          {verse}
        </div>

        {/* Tapered Brush Hairline Divider */}
        {voiceover && (
          <>
            <div
              style={{
                marginTop: 22,
                height: 1,
                width: "100%",
                background: `linear-gradient(90deg, ${accentColor}88 0%, rgba(255, 255, 255, 0.2) 60%, transparent 100%)`,
              }}
            />
            {/* Commentary Voiceover */}
            <div
              style={{
                marginTop: 18,
                fontSize: 24,
                fontFamily: STYLE_TOKENS.fontSong,
                color: "#e2e8f0",
                fontWeight: "500",
                lineHeight: 1.8,
                letterSpacing: 1.4,
                textShadow: "0 2px 14px rgba(0,0,0,0.95)",
              }}
            >
              {voiceover}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

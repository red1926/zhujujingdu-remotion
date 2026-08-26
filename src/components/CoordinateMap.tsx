import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COORDINATE_POINTS, STYLE_TOKENS } from "../data/storyboardData";

interface CoordinateMapProps {
  activePointIds: string[];
  visitedPointIds?: string[];
  showGrid?: boolean;
  highlightFold?: boolean;
  size?: number;
  position?: { top: number; left: number };
  opacity?: number;
  scale?: number;
}

export const CoordinateMap: React.FC<CoordinateMapProps> = ({
  activePointIds,
  visitedPointIds = [],
  showGrid = true,
  highlightFold = false,
  size = 680,
  position = { top: 180, left: 60 },
  opacity = 1,
  scale = 1,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const center = size / 2; // 340px
  const unit = 50; // 50px per unit
  const gridSpan = 5 * unit; // 250px from center (spans x/y: 90px to 590px)

  // Map logical coordinate (x, y) to SVG (cx, cy)
  const mapToCanvas = (x: number, y: number) => {
    return {
      cx: center + x * unit,
      cy: center - y * unit,
    };
  };

  const pulse = interpolate(Math.sin(frame * 0.12), [-1, 1], [0.85, 1.25]);

  // Smooth entrance spring for newly activated points in current sequence
  const entranceProgress = spring({
    frame,
    fps,
    config: { damping: 16, stiffness: 75 },
  });

  const smoothOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Strict collision-free floating text positioning directly ABOVE or BELOW points
  const getFloatingVerseConfig = (id: string, cx: number, cy: number) => {
    switch (id) {
      case "1":
        return {
          title: "① 君问归期未有期",
          textAnchor: "middle" as const,
          tx: cx,
          ty: cy - 26, // Directly ABOVE Point 1 (y: 414px)
        };
      case "2":
        return {
          title: "② 巴山夜雨涨秋池",
          textAnchor: "middle" as const,
          tx: cx,
          ty: cy - 26, // Directly ABOVE Point 2 (y: 514px)
        };
      case "3":
        return {
          title: "③ 何当共剪西窗烛",
          textAnchor: "middle" as const,
          tx: cx,
          ty: cy + 40, // Directly BELOW Point 3 (y: 230px)
        };
      case "4_scene":
        return {
          title: "④ 场景 · 西窗将来 (+3)",
          textAnchor: "middle" as const,
          tx: cx,
          ty: cy - 26, // Directly ABOVE Scene Point (y: 214px)
        };
      case "4_topic":
        return {
          title: "④ 话题 · 巴山此刻 (-4)",
          textAnchor: "middle" as const,
          tx: cx,
          ty: cy - 26, // Directly ABOVE Topic Point (y: 514px)
        };
      default:
        return {
          title: "",
          textAnchor: "middle" as const,
          tx: cx,
          ty: cy - 26,
        };
    }
  };

  return (
    <div
      style={{
        position: "absolute",
        top: position.top,
        left: position.left,
        width: size,
        height: size,
        opacity,
        transform: `scale(${scale})`,
        transformOrigin: "center center",
        pointerEvents: "none",
      }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <filter id="pointGlow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="7" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* High-Contrast Classical Text Halo Filter (Zero Dirty Glass Box) */}
          <filter id="floatingTextGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#000000" floodOpacity="0.98" />
            <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="#000000" floodOpacity="0.95" />
            <feDropShadow dx="0" dy="0" stdDeviation="16" floodColor="#000000" floodOpacity="0.85" />
          </filter>
        </defs>

        {/* 1. Subtle Grid Lines */}
        {showGrid && (
          <g opacity="0.09">
            {[-4, -3, -2, -1, 1, 2, 3, 4].map((step) => {
              const pos = center + step * unit;
              return (
                <React.Fragment key={step}>
                  <line
                    x1={pos}
                    y1={center - gridSpan}
                    x2={pos}
                    y2={center + gridSpan}
                    stroke="#ffffff"
                    strokeDasharray="3,4"
                  />
                  <line
                    x1={center - gridSpan}
                    y1={pos}
                    x2={center + gridSpan}
                    y2={pos}
                    stroke="#ffffff"
                    strokeDasharray="3,4"
                  />
                </React.Fragment>
              );
            })}
          </g>
        )}

        {/* 2. Main Axes and Ticks */}
        <g stroke="#94a3b8" strokeWidth="2.2" opacity="0.8">
          {/* X Axis */}
          <line
            x1={center - gridSpan - 15}
            y1={center}
            x2={center + gridSpan + 15}
            y2={center}
            filter="drop-shadow(0 2px 4px rgba(0,0,0,0.8))"
          />
          {/* Y Axis */}
          <line
            x1={center}
            y1={center + gridSpan + 15}
            x2={center}
            y2={center - gridSpan - 15}
            filter="drop-shadow(0 2px 4px rgba(0,0,0,0.8))"
          />

          {/* Delicate Tick Marks */}
          <g opacity="0.3">
            {[-5, -4, -3, -2, -1, 1, 2, 3, 4, 5].map((step) => {
              const pos = center + step * unit;
              return (
                <React.Fragment key={step}>
                  <line x1={pos} y1={center - 4} x2={pos} y2={center + 4} stroke="#ffffff" strokeWidth="1.4" />
                  <line x1={center - 4} y1={pos} x2={center + 4} y2={pos} stroke="#ffffff" strokeWidth="1.4" />
                </React.Fragment>
              );
            })}
          </g>
        </g>

        {/* 3. Enhanced Axis Labels */}
        {/* Top: 温暖期待 */}
        <text
          x={center}
          y={center - gridSpan - 28}
          fill="#ffd166"
          fontSize="21"
          fontFamily={STYLE_TOKENS.fontSong}
          textAnchor="middle"
          fontWeight="bold"
          letterSpacing="2"
          filter="drop-shadow(0 2px 8px rgba(0,0,0,0.95)) drop-shadow(0 0 16px rgba(255,209,102,0.65))"
        >
          ↑ 温暖期待 (+5)
        </text>

        {/* Bottom: 孤寂沉郁 */}
        <text
          x={center}
          y={center + gridSpan + 44}
          fill="#48cae4"
          fontSize="21"
          fontFamily={STYLE_TOKENS.fontSong}
          textAnchor="middle"
          fontWeight="bold"
          letterSpacing="2"
          filter="drop-shadow(0 2px 8px rgba(0,0,0,0.95)) drop-shadow(0 0 16px rgba(72,202,228,0.65))"
        >
          孤寂沉郁 ↓ (-5)
        </text>

        {/* Left: 西窗将来 */}
        <text
          x={16}
          y={center - 14}
          fill="#ffb703"
          fontSize="20"
          fontFamily={STYLE_TOKENS.fontSong}
          textAnchor="start"
          fontWeight="bold"
          letterSpacing="2"
          filter="drop-shadow(0 2px 8px rgba(0,0,0,0.95)) drop-shadow(0 0 16px rgba(255,183,3,0.65))"
        >
          ← 西窗将来 (-5)
        </text>

        {/* Right: 巴山此刻 */}
        <text
          x={size - 16}
          y={center - 14}
          fill="#00b4d8"
          fontSize="20"
          fontFamily={STYLE_TOKENS.fontSong}
          textAnchor="end"
          fontWeight="bold"
          letterSpacing="2"
          filter="drop-shadow(0 2px 8px rgba(0,0,0,0.95)) drop-shadow(0 0 16px rgba(0,180,216,0.65))"
        >
          巴山此刻 (+5) →
        </text>

        {/* Connecting breathing dashed line for fold points in Shot 12 */}
        {highlightFold && (
          <g>
            {(() => {
              const pScene = mapToCanvas(COORDINATE_POINTS["4_scene"].x, COORDINATE_POINTS["4_scene"].y);
              const pTopic = mapToCanvas(COORDINATE_POINTS["4_topic"].x, COORDINATE_POINTS["4_topic"].y);
              const dashOffset = (frame * 2.2) % 32;
              return (
                <line
                  x1={pScene.cx}
                  y1={pScene.cy}
                  x2={pTopic.cx}
                  y2={pTopic.cy}
                  stroke="#fb8500"
                  strokeWidth="3.5"
                  strokeDasharray="9,6"
                  strokeDashoffset={dashOffset}
                  opacity={interpolate(Math.sin(frame * 0.2), [-1, 1], [0.55, 1])}
                  filter="url(#pointGlow)"
                />
              );
            })()}
          </g>
        )}

        {/* 4. Progressive Cumulative Points & Standalone Pure Floating Glow Text */}
        {Object.values(COORDINATE_POINTS).map((pt) => {
          const isActive = activePointIds.includes(pt.id);
          const isVisited = visitedPointIds.includes(pt.id);

          // Only render if active currently or previously visited!
          if (!isActive && !isVisited) return null;

          const { cx, cy } = mapToCanvas(pt.x, pt.y);
          const tag = getFloatingVerseConfig(pt.id, cx, cy);

          // Active point gets smooth spring scale and dynamic pulse
          const pointScale = isActive
            ? 12 * Math.max(0.7, entranceProgress)
            : 7;

          const currentOpacity = isActive ? smoothOpacity : 0.45;

          return (
            <g key={pt.id} opacity={currentOpacity}>
              {/* Outer Pulsing Aura Ring (Only for current active point) */}
              {isActive && (
                <circle
                  cx={cx}
                  cy={cy}
                  r={28 * pulse}
                  fill="none"
                  stroke={pt.color}
                  strokeWidth="2.5"
                  opacity={0.75}
                  filter="url(#pointGlow)"
                />
              )}

              {/* Glowing Point Core Body */}
              <circle
                cx={cx}
                cy={cy}
                r={pointScale}
                fill={pt.color}
                filter="url(#pointGlow)"
              />

              {/* Small Inner Bright Spark */}
              {isActive && (
                <circle
                  cx={cx}
                  cy={cy}
                  r={4}
                  fill="#ffffff"
                  opacity={0.9}
                />
              )}

              {/* Pure Floating Verse Calligraphy Text (Directly Above/Below Point, 50% Bigger) */}
              <text
                x={tag.tx}
                y={tag.ty}
                textAnchor={tag.textAnchor}
                fill={isActive ? "#ffffff" : "rgba(255, 255, 255, 0.6)"}
                fontSize={isActive ? "28" : "24"}
                fontFamily={STYLE_TOKENS.fontKai}
                fontWeight="bold"
                letterSpacing="2.2"
                filter="url(#floatingTextGlow)"
              >
                {tag.title}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

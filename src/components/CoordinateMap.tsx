import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COORDINATE_POINTS, STYLE_TOKENS } from "../data/storyboardData";

interface CoordinateMapProps {
  currentVerseIndex: number; // 0: Shot 8, 1: Shot 9, 2: Shot 10, 3: Shot 11, 4: Shot 12
  localVerseFrame?: number; // frame within current verse (0 to duration)
  showGrid?: boolean;
  highlightFold?: boolean;
  foldProgress?: number; // 0 (start of Shot 12) to 1 (full resonance)
  size?: number;
  position?: { top: number; left: number };
  opacity?: number;
  scale?: number;
}

export const CoordinateMap: React.FC<CoordinateMapProps> = ({
  currentVerseIndex,
  localVerseFrame = 0,
  showGrid = true,
  highlightFold = false,
  foldProgress = 0,
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

  const pulse = interpolate(Math.sin(frame * 0.12), [-1, 1], [0.92, 1.15]);

  // Static target positions
  const targetP1 = mapToCanvas(COORDINATE_POINTS["1"].x, COORDINATE_POINTS["1"].y); // cx: 490, cy: 440 (x: 3, y: -2)
  const targetP2 = mapToCanvas(COORDINATE_POINTS["2"].x, COORDINATE_POINTS["2"].y); // cx: 540, cy: 540 (x: 4, y: -4)
  const targetP3 = mapToCanvas(COORDINATE_POINTS["3"].x, COORDINATE_POINTS["3"].y); // cx: 190, cy: 190 (x: -3, y: 3)
  const p4Scene = mapToCanvas(COORDINATE_POINTS["4_scene"].x, COORDINATE_POINTS["4_scene"].y); // cx: 190, cy: 240 (x: -3, y: 2)
  const p4Topic = mapToCanvas(COORDINATE_POINTS["4_topic"].x, COORDINATE_POINTS["4_topic"].y); // cx: 540, cy: 540 (x: 4, y: -4)

  // Dynamic Trajectory Calculations for each Verse
  // Verse 1 (Shot 9): Point 1 starts at y=0 and sinks down to y=-2
  const p1SinkingProgress = currentVerseIndex === 1
    ? interpolate(localVerseFrame, [20, 65], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 1;
  const currentP1Y = currentVerseIndex === 1
    ? interpolate(p1SinkingProgress, [0, 1], [0, COORDINATE_POINTS["1"].y])
    : COORDINATE_POINTS["1"].y;
  const dynP1 = mapToCanvas(COORDINATE_POINTS["1"].x, currentP1Y);

  // Verse 2 (Shot 10): Point 2 sinks deeper from (3, -2) to (4, -4)
  const p2SinkingProgress = currentVerseIndex === 2
    ? interpolate(localVerseFrame, [15, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 1;
  const currentP2X = currentVerseIndex === 2
    ? interpolate(p2SinkingProgress, [0, 1], [3, 4])
    : 4;
  const currentP2Y = currentVerseIndex === 2
    ? interpolate(p2SinkingProgress, [0, 1], [-2, -4])
    : -4;
  const dynP2 = mapToCanvas(currentP2X, currentP2Y);

  // Verse 3 (Shot 11): Point 3 takes a soaring leap from Ba mountain (4, -4) across to West Window (-3, 3)
  const p3LeapProgress = currentVerseIndex === 3
    ? interpolate(localVerseFrame, [15, 75], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 1;
  const dynP3X = currentVerseIndex === 3
    ? interpolate(p3LeapProgress, [0, 1], [4, -3])
    : -3;
  const leapArcHeight = currentVerseIndex === 3
    ? Math.sin(p3LeapProgress * Math.PI) * 4
    : 0;
  const dynP3Y = currentVerseIndex === 3
    ? interpolate(p3LeapProgress, [0, 1], [-4, 3]) + leapArcHeight
    : 3;
  const dynP3 = mapToCanvas(dynP3X, dynP3Y);

  // Total Euclidean distance between 4_scene and 4_topic for line drawing animation
  const foldLineLength = Math.hypot(p4Topic.cx - p4Scene.cx, p4Topic.cy - p4Scene.cy);

  // "你的落点呢？" brief prompt in Verse 1
  const promptOpacity = currentVerseIndex === 1
    ? interpolate(localVerseFrame, [0, 12, 35, 48], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 0;

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
        overflow: "visible",
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ overflow: "visible" }}
      >
        <defs>
          <filter id="pointGlow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* High-Contrast Classical Text Halo Filter */}
          <filter id="floatingTextGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#000000" floodOpacity="0.98" />
            <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="#000000" floodOpacity="0.95" />
          </filter>
        </defs>

        {/* 1. Subtle Aesthetic Grid Lines (No Math Ticks, Ultra-Light Watermark) */}
        {showGrid && (
          <g opacity="0.05">
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
                    strokeDasharray="2,4"
                  />
                  <line
                    x1={center - gridSpan}
                    y1={pos}
                    x2={center + gridSpan}
                    y2={pos}
                    stroke="#ffffff"
                    strokeDasharray="2,4"
                  />
                </React.Fragment>
              );
            })}
          </g>
        )}

        {/* 2. Main Directional Axes (Direction and Spatial Orientation Only) */}
        <g stroke="#94a3b8" strokeWidth="1.6" opacity="0.7">
          {/* X Axis (West Window <-> Ba Mountain) */}
          <line
            x1={center - gridSpan - 10}
            y1={center}
            x2={center + gridSpan + 10}
            y2={center}
          />
          {/* Y Axis (Warm Expectation <-> Cold Solitude) */}
          <line
            x1={center}
            y1={center + gridSpan + 10}
            x2={center}
            y2={center - gridSpan - 10}
          />
        </g>

        {/* 3. Pure Literary Axis Labels (No +5/-5 math numbers) */}
        {/* Top: 温暖 / 期待 */}
        <text
          x={center}
          y={center - gridSpan - 24}
          fill="#ffd166"
          fontSize="20"
          fontFamily={STYLE_TOKENS.fontSong}
          textAnchor="middle"
          fontWeight="bold"
          letterSpacing="2"
          filter="drop-shadow(0 2px 8px rgba(0,0,0,0.95))"
        >
          ↑ 温暖 · 期待
        </text>

        {/* Bottom: 孤寂 / 沉郁 */}
        <text
          x={center}
          y={center + gridSpan + 38}
          fill="#48cae4"
          fontSize="20"
          fontFamily={STYLE_TOKENS.fontSong}
          textAnchor="middle"
          fontWeight="bold"
          letterSpacing="2"
          filter="drop-shadow(0 2px 8px rgba(0,0,0,0.95))"
        >
          孤寂 · 沉郁 ↓
        </text>

        {/* Left: 归处西窗 · 将来 */}
        <text
          x={14}
          y={center - 12}
          fill="#ffb703"
          fontSize="19"
          fontFamily={STYLE_TOKENS.fontSong}
          textAnchor="start"
          fontWeight="bold"
          letterSpacing="2"
          filter="drop-shadow(0 2px 8px rgba(0,0,0,0.95))"
        >
          ← 归处西窗 · 将来
        </text>

        {/* Right: 巴山 · 此刻 */}
        <text
          x={size - 14}
          y={center - 12}
          fill="#00b4d8"
          fontSize="19"
          fontFamily={STYLE_TOKENS.fontSong}
          textAnchor="end"
          fontWeight="bold"
          letterSpacing="2"
          filter="drop-shadow(0 2px 8px rgba(0,0,0,0.95))"
        >
          巴山 · 此刻 →
        </text>

        {/* 3b. Brief Prompt: "你的落点呢？" (Only in first 1.5s of Verse 1) */}
        {promptOpacity > 0.01 && (
          <text
            x={targetP1.cx}
            y={mapToCanvas(3, 0).cy - 20}
            textAnchor="middle"
            fill="#a5f3fc"
            fontSize="22"
            fontFamily={STYLE_TOKENS.fontKai}
            fontWeight="bold"
            letterSpacing="2"
            opacity={promptOpacity}
            filter="url(#floatingTextGlow)"
          >
            你的落点呢？
          </text>
        )}

        {/* 4. Progressive Connecting Trajectory Lines */}
        {/* Sinking Trail for Point 1 (Shown during Verse 1) */}
        {currentVerseIndex === 1 && p1SinkingProgress > 0.1 && (
          <line
            x1={targetP1.cx}
            y1={mapToCanvas(3, 0).cy}
            x2={dynP1.cx}
            y2={dynP1.cy}
            stroke="#3a86ff"
            strokeWidth="2"
            strokeDasharray="4,4"
            opacity={0.6}
          />
        )}

        {/* Line 1 -> 2 (Shown when Verse >= 2) */}
        {currentVerseIndex >= 2 && (
          <line
            x1={targetP1.cx}
            y1={targetP1.cy}
            x2={dynP2.cx}
            y2={dynP2.cy}
            stroke="#00b4d8"
            strokeWidth="1.8"
            strokeDasharray="4,4"
            opacity={currentVerseIndex === 2 ? 0.75 : 0.25}
          />
        )}

        {/* Line 2 -> 3 (Big Leap across axis, shown when Verse >= 3) */}
        {currentVerseIndex >= 3 && (
          <path
            d={`M ${targetP2.cx} ${targetP2.cy} Q ${center + 30} ${center - 60} ${dynP3.cx} ${dynP3.cy}`}
            fill="none"
            stroke="#ffb703"
            strokeWidth="2"
            strokeDasharray="5,4"
            opacity={currentVerseIndex === 3 ? 0.85 : 0.25}
          />
        )}

        {/* 5. Point 1 (Generated in Verse 1 with Sinking Motion, stays as history path later) */}
        {currentVerseIndex >= 1 && (() => {
          const isActive = currentVerseIndex === 1;
          const ptOpacity = isActive ? 1 : 0.35;
          return (
            <g key="point_1" opacity={ptOpacity}>
              {isActive && (
                <circle
                  cx={dynP1.cx}
                  cy={dynP1.cy}
                  r={24 * pulse}
                  fill="none"
                  stroke="#3a86ff"
                  strokeWidth="1.8"
                  opacity={0.7}
                />
              )}
              <circle
                cx={dynP1.cx}
                cy={dynP1.cy}
                r={isActive ? 10 : 6}
                fill="#3a86ff"
                stroke={isActive ? "#ffffff" : "#3a86ff"}
                strokeWidth={isActive ? 1.5 : 1}
              />
              {isActive && <circle cx={dynP1.cx} cy={dynP1.cy} r={3} fill="#ffffff" />}
              {/* Text Tag reveals once point has settled */}
              {(p1SinkingProgress > 0.5 || !isActive) && (
                <text
                  x={dynP1.cx}
                  y={dynP1.cy - 22}
                  textAnchor="middle"
                  fill={isActive ? "#ffffff" : "rgba(226, 232, 240, 0.45)"}
                  fontSize={isActive ? "22" : "18"}
                  fontFamily={STYLE_TOKENS.fontKai}
                  fontWeight={isActive ? "bold" : "normal"}
                  letterSpacing="1.5"
                  filter={isActive ? "url(#floatingTextGlow)" : "drop-shadow(0 2px 4px rgba(0,0,0,0.8))"}
                >
                  ① 巴山 · 此刻
                </text>
              )}
            </g>
          );
        })()}

        {/* 6. Point 2 (Generated in Verse 2 with Sinking to Bottom Motion) */}
        {currentVerseIndex >= 2 && (() => {
          const isActive = currentVerseIndex === 2;
          const ptOpacity = isActive ? 1 : 0.35;
          // In Shot 12, when 4_topic awakens, fade Point 2 out so it doesn't clash
          if (currentVerseIndex === 4 && foldProgress > 0) {
            return null;
          }
          return (
            <g key="point_2" opacity={ptOpacity}>
              {isActive && (
                <circle
                  cx={dynP2.cx}
                  cy={dynP2.cy}
                  r={24 * pulse}
                  fill="none"
                  stroke="#00b4d8"
                  strokeWidth="1.8"
                  opacity={0.7}
                />
              )}
              <circle
                cx={dynP2.cx}
                cy={dynP2.cy}
                r={isActive ? 10 : 6}
                fill="#00b4d8"
                stroke={isActive ? "#ffffff" : "#00b4d8"}
                strokeWidth={isActive ? 1.5 : 1}
              />
              {isActive && <circle cx={dynP2.cx} cy={dynP2.cy} r={3} fill="#ffffff" />}
              {(p2SinkingProgress > 0.5 || !isActive) && (
                <text
                  x={dynP2.cx}
                  y={dynP2.cy - 22}
                  textAnchor="middle"
                  fill={isActive ? "#ffffff" : "rgba(226, 232, 240, 0.45)"}
                  fontSize={isActive ? "22" : "18"}
                  fontFamily={STYLE_TOKENS.fontKai}
                  fontWeight={isActive ? "bold" : "normal"}
                  letterSpacing="1.5"
                  filter={isActive ? "url(#floatingTextGlow)" : "drop-shadow(0 2px 4px rgba(0,0,0,0.8))"}
                >
                  ② 巴山 · 此刻
                </text>
              )}
            </g>
          );
        })()}

        {/* 7. Point 3 (Generated in Verse 3 with Soaring Leap across axis) */}
        {currentVerseIndex === 3 && (() => {
          return (
            <g key="point_3" opacity={1}>
              <circle
                cx={dynP3.cx}
                cy={dynP3.cy}
                r={24 * pulse}
                fill="none"
                stroke="#ffb703"
                strokeWidth="1.8"
                opacity={0.7}
              />
              <circle
                cx={dynP3.cx}
                cy={dynP3.cy}
                r={10}
                fill="#ffb703"
                stroke="#ffffff"
                strokeWidth={1.5}
              />
              <circle cx={dynP3.cx} cy={dynP3.cy} r={3} fill="#ffffff" />
              {p3LeapProgress > 0.6 && (
                <text
                  x={dynP3.cx}
                  y={dynP3.cy - 22}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="22"
                  fontFamily={STYLE_TOKENS.fontKai}
                  fontWeight="bold"
                  letterSpacing="1.5"
                  filter="url(#floatingTextGlow)"
                >
                  ③ 西窗 · 将来
                </text>
              )}
            </g>
          );
        })()}

        {/* 8. Point 4: Spatiotemporal Fold (Verse 4 / Shot 12) - STRICTLY DUAL COORDINATES (NO EXTRA MIDDLE POINT) */}
        {currentVerseIndex === 4 && (
          <g key="verse_4_fold">
            {/* 8a. First Coordinate: 🟡 西窗 · 将来 */}
            <g opacity={1}>
              <circle
                cx={p4Scene.cx}
                cy={p4Scene.cy}
                r={24 * pulse}
                fill="none"
                stroke="#ffb703"
                strokeWidth="1.8"
                opacity={0.8}
              />
              <circle
                cx={p4Scene.cx}
                cy={p4Scene.cy}
                r={10}
                fill="#ffb703"
                stroke="#ffffff"
                strokeWidth={1.5}
              />
              <circle cx={p4Scene.cx} cy={p4Scene.cy} r={3} fill="#ffffff" />
              <text
                x={p4Scene.cx}
                y={p4Scene.cy - 22}
                textAnchor="middle"
                fill="#ffffff"
                fontSize="22"
                fontFamily={STYLE_TOKENS.fontKai}
                fontWeight="bold"
                letterSpacing="1.5"
                filter="url(#floatingTextGlow)"
              >
                ④ 场景 · 西窗将来
              </text>
            </g>

            {/* 8b. Second Coordinate: 🔵 巴山 · 此刻 (Awakens when foldProgress > 0) */}
            {foldProgress > 0.05 && (() => {
              const topicOpacity = Math.min(1, foldProgress * 1.3);
              return (
                <g opacity={topicOpacity}>
                  <circle
                    cx={p4Topic.cx}
                    cy={p4Topic.cy}
                    r={24 * pulse}
                    fill="none"
                    stroke="#2a9d8f"
                    strokeWidth="1.8"
                    opacity={0.8}
                  />
                  <circle
                    cx={p4Topic.cx}
                    cy={p4Topic.cy}
                    r={10}
                    fill="#2a9d8f"
                    stroke="#ffffff"
                    strokeWidth={1.5}
                  />
                  <circle cx={p4Topic.cx} cy={p4Topic.cy} r={3} fill="#ffffff" />
                  <text
                    x={p4Topic.cx}
                    y={p4Topic.cy + 30}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="22"
                    fontFamily={STYLE_TOKENS.fontKai}
                    fontWeight="bold"
                    letterSpacing="1.5"
                    filter="url(#floatingTextGlow)"
                  >
                    ④ 话题 · 巴山此刻
                  </text>
                </g>
              );
            })()}

            {/* 8c. Delicate Relation/Traction Line Between Dual Coordinates (No Middle Point) */}
            {highlightFold && foldProgress > 0.05 && (
              <line
                x1={p4Scene.cx}
                y1={p4Scene.cy}
                x2={p4Topic.cx}
                y2={p4Topic.cy}
                stroke="#ffb703"
                strokeWidth="1.8"
                strokeDasharray="6,4"
                strokeDashoffset={(1 - foldProgress) * foldLineLength + ((frame * 1.5) % 20)}
                opacity={foldProgress * 0.85}
              />
            )}
          </g>
        )}
      </svg>
    </div>
  );
};

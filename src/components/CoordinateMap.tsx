import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { COORDINATE_POINTS, STYLE_TOKENS } from "../data/storyboardData";

interface CoordinateMapProps {
  activePointIds: string[];
  visitedPointIds?: string[];
  showGrid?: boolean;
  highlightFold?: boolean;
  foldProgress?: number; // 0 (start of Shot 12) to 1 (full resonance)
  size?: number;
  position?: { top: number; left: number };
  opacity?: number;
  scale?: number;
}

export const CoordinateMap: React.FC<CoordinateMapProps> = ({
  activePointIds,
  showGrid = true,
  highlightFold = false,
  foldProgress = 0,
  size = 680,
  position = { top: 180, left: 60 },
  opacity = 1,
  scale = 1,
}) => {
  const frame = useCurrentFrame();

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

  // Points coordinates
  const p1 = mapToCanvas(COORDINATE_POINTS["1"].x, COORDINATE_POINTS["1"].y); // cx: 490, cy: 440
  const p2 = mapToCanvas(COORDINATE_POINTS["2"].x, COORDINATE_POINTS["2"].y); // cx: 540, cy: 540
  const p3 = mapToCanvas(COORDINATE_POINTS["3"].x, COORDINATE_POINTS["3"].y); // cx: 190, cy: 190
  const p4Scene = mapToCanvas(COORDINATE_POINTS["4_scene"].x, COORDINATE_POINTS["4_scene"].y); // cx: 190, cy: 240
  const p4Topic = mapToCanvas(COORDINATE_POINTS["4_topic"].x, COORDINATE_POINTS["4_topic"].y); // cx: 540, cy: 540

  // Total Euclidean distance between 4_scene and 4_topic for line drawing animation
  const foldLineLength = Math.hypot(p4Topic.cx - p4Scene.cx, p4Topic.cy - p4Scene.cy);

  // Floating text label config
  const getFloatingVerseConfig = (id: string, cx: number, cy: number) => {
    switch (id) {
      case "1":
        return {
          title: "① 君问归期未有期",
          textAnchor: "middle" as const,
          tx: cx,
          ty: cy - 26,
        };
      case "2":
        return {
          title: "② 巴山夜雨涨秋池",
          textAnchor: "middle" as const,
          tx: cx,
          ty: cy - 26,
        };
      case "3":
        return {
          title: "③ 何当共剪西窗烛",
          textAnchor: "middle" as const,
          tx: cx,
          ty: cy - 26,
        };
      case "4_scene":
        return {
          title: foldProgress > 0.4 ? "④ 场景 · 西窗将来 (+3)" : "④ 却话巴山夜雨时",
          textAnchor: "middle" as const,
          tx: cx,
          ty: cy + 36, // Placed cleanly below Point 4
        };
      case "4_topic":
        return {
          title: "④ 话题 · 巴山此刻 (-4)",
          textAnchor: "middle" as const, // Centered directly under the point
          tx: cx,
          ty: cy + 36, // Placed below the point
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

  // Determine base rendering points: Points 1, 2, 3, 4_scene are always present
  const basePoints = [
    COORDINATE_POINTS["1"],
    COORDINATE_POINTS["2"],
    COORDINATE_POINTS["3"],
    COORDINATE_POINTS["4_scene"],
  ];

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
            <feGaussianBlur stdDeviation="7" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* High-Contrast Classical Text Halo Filter */}
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

        {/* 4. Spatiotemporal Fold Line: Smooth Progressive Laser Growth */}
        {highlightFold && foldProgress > 0 && (
          <g>
            {(() => {
              const dashOffset = (1 - foldProgress) * foldLineLength + ((frame * 2.2) % 32);
              return (
                <line
                  x1={p4Scene.cx}
                  y1={p4Scene.cy}
                  x2={p4Topic.cx}
                  y2={p4Topic.cy}
                  stroke="#fb8500"
                  strokeWidth="3.5"
                  strokeDasharray="9,6"
                  strokeDashoffset={dashOffset}
                  opacity={foldProgress * interpolate(Math.sin(frame * 0.2), [-1, 1], [0.65, 1])}
                  filter="url(#pointGlow)"
                />
              );
            })()}
          </g>
        )}

        {/* 5. Base 4 Points Rendering */}
        {basePoints.map((pt) => {
          const isActive = activePointIds.includes(pt.id);
          const { cx, cy } = mapToCanvas(pt.x, pt.y);
          const tag = getFloatingVerseConfig(pt.id, cx, cy);

          const pointRadius = isActive ? 12 : 7;
          let pointOpacity = isActive ? 1 : 0.38;

          // When fold is emerging in Shot 12, smoothly fade out Point 2's dimmed label so it doesn't clash with 4_topic
          if (pt.id === "2" && foldProgress > 0) {
            pointOpacity = Math.max(0, 0.38 * (1 - foldProgress * 1.5));
          }

          if (pointOpacity <= 0.01) return null;

          return (
            <g key={pt.id} opacity={pointOpacity}>
              {/* Outer Pulsing Aura Ring (Only for current active point) */}
              {isActive && (
                <circle
                  cx={cx}
                  cy={cy}
                  r={28 * pulse}
                  fill="none"
                  stroke={pt.color}
                  strokeWidth="2.5"
                  opacity={0.85}
                  filter="url(#pointGlow)"
                />
              )}

              {/* Glowing Point Core Body */}
              <circle
                cx={cx}
                cy={cy}
                r={pointRadius}
                fill={pt.color}
                stroke={isActive ? "#ffffff" : pt.color}
                strokeWidth={isActive ? 1.5 : 1}
                filter={isActive ? "url(#pointGlow)" : undefined}
              />

              {/* Small Inner Bright Spark (Active only) */}
              {isActive && (
                <circle
                  cx={cx}
                  cy={cy}
                  r={4}
                  fill="#ffffff"
                  opacity={0.95}
                />
              )}

              {/* Pure Floating Verse Calligraphy Text */}
              <text
                x={tag.tx}
                y={tag.ty}
                textAnchor={tag.textAnchor}
                fill={isActive ? "#ffffff" : "rgba(226, 232, 240, 0.45)"}
                fontSize={isActive ? "28" : "23"}
                fontFamily={STYLE_TOKENS.fontKai}
                fontWeight={isActive ? "bold" : "normal"}
                letterSpacing="2.2"
                filter={isActive ? "url(#floatingTextGlow)" : "drop-shadow(0 2px 4px rgba(0,0,0,0.8))"}
              >
                {tag.title}
              </text>
            </g>
          );
        })}

        {/* 6. Spatiotemporal Fold Second Coordinate (Point 4_topic): Progressive Awakening */}
        {highlightFold && foldProgress > 0.05 && (() => {
          const pt = COORDINATE_POINTS["4_topic"];
          const tag = getFloatingVerseConfig(pt.id, p4Topic.cx, p4Topic.cy);
          const topicOpacity = Math.min(1, foldProgress * 1.2);
          const topicScale = interpolate(foldProgress, [0, 1], [0.3, 1]);

          return (
            <g
              key="4_topic_awakening"
              opacity={topicOpacity}
              transform={`matrix(${topicScale} 0 0 ${topicScale} ${(1 - topicScale) * p4Topic.cx} ${(1 - topicScale) * p4Topic.cy})`}
            >
              {/* Outer Pulsing Aura Ring */}
              <circle
                cx={p4Topic.cx}
                cy={p4Topic.cy}
                r={28 * pulse}
                fill="none"
                stroke={pt.color}
                strokeWidth="2.5"
                opacity={0.85 * topicOpacity}
                filter="url(#pointGlow)"
              />

              {/* Glowing Point Core Body */}
              <circle
                cx={p4Topic.cx}
                cy={p4Topic.cy}
                r={12}
                fill={pt.color}
                stroke="#ffffff"
                strokeWidth={1.5}
                filter="url(#pointGlow)"
              />

              {/* Inner Bright Spark */}
              <circle
                cx={p4Topic.cx}
                cy={p4Topic.cy}
                r={4}
                fill="#ffffff"
                opacity={0.95}
              />

              {/* Floating Topic Label: Fully visible, right aligned inside canvas, below the point */}
              <text
                x={tag.tx}
                y={tag.ty}
                textAnchor={tag.textAnchor}
                fill="#ffffff"
                fontSize="28"
                fontFamily={STYLE_TOKENS.fontKai}
                fontWeight="bold"
                letterSpacing="2.2"
                filter="url(#floatingTextGlow)"
              >
                {tag.title}
              </text>
            </g>
          );
        })()}
      </svg>
    </div>
  );
};

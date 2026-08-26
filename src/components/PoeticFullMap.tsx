import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { STYLE_TOKENS } from "../data/storyboardData";

interface PoeticFullMapProps {
  shotNumber: 13 | 14;
}

export const PoeticFullMap: React.FC<PoeticFullMapProps> = ({ shotNumber }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ==========================================
  // SHOT 13 (5:30 - 5:52, 22s / 660 frames)
  // ==========================================
  // 1. Morphing: Coordinate map stretches outward & grid weakens (0 - 240 frames)
  const stretchProgress = interpolate(frame, [0, 240], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 2. Poetic scroll fade-in (200 - 360 frames)
  const poeticScrollOpacity =
    shotNumber === 13
      ? interpolate(frame, [180, 320], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 1;

  // 3. Leaf vein stroke growth animation (240 - 450 frames in Shot 13)
  const veinProgress =
    shotNumber === 13
      ? interpolate(frame, [220, 420], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 1;

  // 4. Node gliding positions (from Part 2 coordinate positions to Full Map poetic positions)
  // In Part 2: origin center is (450, 520) in coordinate box.
  // In Full Map: centered on 1920x1080 canvas (1520x860 map container).
  const glideT =
    shotNumber === 13
      ? interpolate(frame, [160, 360], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 1;

  // Node 1: (3, -2) -> (980, 490)
  const node1X = interpolate(glideT, [0, 1], [640, 980]);
  const node1Y = interpolate(glideT, [0, 1], [500, 490]);

  // Node 2: (4, -4) -> (1060, 650)
  const node2X = interpolate(glideT, [0, 1], [720, 1060]);
  const node2Y = interpolate(glideT, [0, 1], [600, 650]);

  // Node 3: (-3, 3) -> (320, 200)
  const node3X = interpolate(glideT, [0, 1], [240, 320]);
  const node3Y = interpolate(glideT, [0, 1], [240, 200]);

  // Node 4 (Spatiotemporal Fold): (-3, 2) -> (420, 330)
  const node4X = interpolate(glideT, [0, 1], [240, 420]);
  const node4Y = interpolate(glideT, [0, 1], [300, 330]);

  // 5. Annotations and poem cards entrance (400 - 520 frames)
  const cardOpacity =
    shotNumber === 13
      ? interpolate(frame, [380, 480], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 1;

  // ==========================================
  // SHOT 14 (5:52 - 6:30, 38s / 1140 frames)
  // ==========================================
  const isShot14 = shotNumber === 14;

  // 1. Voiceover-driven highlights
  // Phase 1: 0~140f (5:52-5:57) -> "用横轴读时间与空间——巴山此刻，西窗将来"
  const highlightX = isShot14 && frame >= 20 && frame < 150;
  // Phase 2: 150~280f (5:57-6:01) -> "用纵轴读情感——孤寂沉郁，温暖期待"
  const highlightY = isShot14 && frame >= 150 && frame < 280;
  // Phase 3: 280~420f (6:01-6:06) -> "找到折叠点——第四句，时空重影"
  const highlightFold = isShot14 && frame >= 280 && frame < 420;

  // 2. Sublimation Fade-out of technical axes and coordinate markings (frame 420 - 540)
  const technicalAxisOpacity = isShot14
    ? interpolate(frame, [420, 520], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;

  // 3. Gentle poetic pulse in final static frame
  const pulseScale = interpolate(
    Math.sin(frame * 0.08),
    [-1, 1],
    [0.97, 1.03]
  );
  const glowBeam = interpolate(Math.sin(frame * 0.15), [-1, 1], [0.6, 1.3]);

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* 1. Main Poetic Full Map Scroll Container */}
      <div
        style={{
          width: 1560,
          height: 880,
          backgroundColor: "rgba(8, 14, 24, 0.88)",
          backdropFilter: "blur(12px)",
          border: "2px solid rgba(212, 163, 115, 0.45)",
          borderRadius: 24,
          boxShadow: "0 28px 70px rgba(0, 0, 0, 0.9), inset 0 0 80px rgba(0, 0, 0, 0.6)",
          position: "relative",
          overflow: "hidden",
          opacity: poeticScrollOpacity,
        }}
      >
        {/* Top half: warm golden candlelight radiance (West Window / 想象将来) */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "50%",
            background:
              "radial-gradient(ellipse at 35% 25%, rgba(255, 183, 3, 0.22) 0%, rgba(251, 133, 0, 0.08) 50%, rgba(0,0,0,0) 80%)",
            pointerEvents: "none",
          }}
        />

        {/* Bottom half: cold ink teal rainy night depth (Ba Mountain / 现实此刻) */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "50%",
            background:
              "radial-gradient(ellipse at 70% 80%, rgba(27, 38, 59, 0.45) 0%, rgba(13, 27, 42, 0.2) 55%, rgba(0,0,0,0) 85%)",
            pointerEvents: "none",
          }}
        />

        {/* Subtle watercolor paper texture & wood-grain border lines */}
        <div
          style={{
            position: "absolute",
            inset: 8,
            border: "1px solid rgba(212, 163, 115, 0.18)",
            borderRadius: 18,
            pointerEvents: "none",
          }}
        />

        {/* 2. SVG Vector Canvas: Axes, Leaf Vein, Dynamic Glowing Lines */}
        <svg
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        >
          <defs>
            {/* S-curve Leaf Vein Gradient from Warm Gold to Cold Cyan */}
            <linearGradient id="leafVeinGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ffb703" stopOpacity="0.95" />
              <stop offset="35%" stopColor="#ffd166" stopOpacity="0.9" />
              <stop offset="65%" stopColor="#48cae4" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#1d3557" stopOpacity="0.95" />
            </linearGradient>

            {/* Glowing filter for highlighted axes */}
            <filter id="axisGlowEffect" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Cyan highlight gradient */}
            <linearGradient id="cyanAxisGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#ffb703" />
              <stop offset="50%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#00b4d8" />
            </linearGradient>

            {/* Gold highlight gradient */}
            <linearGradient id="goldAxisGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffd166" />
              <stop offset="50%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#3a86ff" />
            </linearGradient>
          </defs>

          {/* Sublimating Technical Axes (fades out at Shot 14 / 6:05) */}
          <g opacity={technicalAxisOpacity}>
            {/* Horizontal Axis: 西窗将来 ↔ 巴山此刻 */}
            <line
              x1={interpolate(stretchProgress, [0, 1], [300, 150])}
              y1="440"
              x2={interpolate(stretchProgress, [0, 1], [1150, 1200])}
              y2="440"
              stroke={highlightX ? "url(#cyanAxisGrad)" : "rgba(255, 255, 255, 0.22)"}
              strokeWidth={highlightX ? 4.5 : 1.8}
              strokeDasharray={highlightX ? undefined : "6,4"}
              filter={highlightX ? "url(#axisGlowEffect)" : undefined}
            />

            {/* Vertical Axis: 孤寂沉郁 ↕ 温暖期待 */}
            <line
              x1="740"
              y1={interpolate(stretchProgress, [0, 1], [220, 120])}
              x2="740"
              y2={interpolate(stretchProgress, [0, 1], [700, 810])}
              stroke={highlightY ? "url(#goldAxisGrad)" : "rgba(255, 255, 255, 0.22)"}
              strokeWidth={highlightY ? 4.5 : 1.8}
              strokeDasharray={highlightY ? undefined : "6,4"}
              filter={highlightY ? "url(#axisGlowEffect)" : undefined}
            />

            {/* Center Origin Mark */}
            <circle
              cx="740"
              cy="440"
              r="4"
              fill="rgba(255, 255, 255, 0.5)"
            />
          </g>

          {/* Continuous Water-Ink Leaf Vein (贯通全景的生命水墨叶脉) */}
          {/* Path starts at West Window ③ (300, 210), loops through Fold ④ (390, 340), ribbons across center (740, 440), reaches Ba Mountain ① (1060, 500) and ② (1150, 660) */}
          <path
            d="M 300 210 C 340 280, 360 310, 390 340 C 470 410, 580 430, 740 440 C 900 450, 990 470, 1060 500 C 1110 520, 1130 580, 1150 660"
            stroke="url(#leafVeinGradient)"
            strokeWidth={highlightFold ? 5 : 3.5}
            strokeDasharray="1400"
            strokeDashoffset={1400 * (1 - veinProgress)}
            fill="none"
            filter={highlightFold ? "url(#axisGlowEffect)" : undefined}
            opacity={0.88}
          />

          {/* Secondary branching poetic veins */}
          <path
            d="M 390 340 Q 520 280 680 320"
            stroke="rgba(255, 183, 3, 0.4)"
            strokeWidth="1.5"
            strokeDasharray="4,4"
            fill="none"
            opacity={veinProgress * (highlightFold ? 0.9 : 0.45)}
          />
          <path
            d="M 1060 500 Q 940 580 820 540"
            stroke="rgba(72, 202, 228, 0.4)"
            strokeWidth="1.5"
            strokeDasharray="4,4"
            fill="none"
            opacity={veinProgress * (highlightFold ? 0.9 : 0.45)}
          />

          {/* Energy pulse particles gliding along the vein in Shot 14 */}
          {isShot14 && (
            <circle
              cx={interpolate(
                (frame * 2.5) % 300,
                [0, 100, 200, 300],
                [300, 550, 850, 1150]
              )}
              cy={interpolate(
                (frame * 2.5) % 300,
                [0, 100, 200, 300],
                [210, 420, 460, 660]
              )}
              r="5"
              fill="#ffe8a3"
              filter="url(#axisGlowEffect)"
            />
          )}
        </svg>

        {/* 3. Top Center Grand Title */}
        <div
          style={{
            position: "absolute",
            top: 26,
            left: "50%",
            transform: "translateX(-50%)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 34,
              fontFamily: STYLE_TOKENS.fontKai,
              color: "#ffe8a3",
              letterSpacing: 8,
              fontWeight: "bold",
              textShadow: "0 0 24px rgba(255, 183, 3, 0.65), 0 2px 4px rgba(0,0,0,0.8)",
            }}
          >
            时空折叠 · 情感回环
          </div>
          <div
            style={{
              fontSize: 14,
              fontFamily: STYLE_TOKENS.fontSong,
              color: "rgba(226, 232, 240, 0.6)",
              letterSpacing: 3,
              marginTop: 4,
            }}
          >
            《夜雨寄北》全景诗意结构图
          </div>
        </div>

        {/* 4. Axis Labels (Fade out cleanly in Shot 14 at 6:05 / frame 420) */}
        <div
          style={{
            opacity: technicalAxisOpacity,
            transition: "opacity 0.4s ease",
            pointerEvents: "none",
          }}
        >
          {/* Left: ← 西窗将来 */}
          <div
            style={{
              position: "absolute",
              top: 450,
              left: 60,
              color: highlightX ? "#ffb703" : "#cbd5e1",
              fontSize: 20,
              fontWeight: "bold",
              fontFamily: STYLE_TOKENS.fontSong,
              textShadow: highlightX ? "0 0 16px #ffb703" : undefined,
            }}
          >
            ← 西窗将来
          </div>

          {/* Right: 巴山此刻 → */}
          <div
            style={{
              position: "absolute",
              top: 450,
              right: 300,
              color: highlightX ? "#00b4d8" : "#cbd5e1",
              fontSize: 20,
              fontWeight: "bold",
              fontFamily: STYLE_TOKENS.fontSong,
              textShadow: highlightX ? "0 0 16px #00b4d8" : undefined,
            }}
          >
            巴山此刻 →
          </div>

          {/* Top: ↑ 温暖期待 */}
          <div
            style={{
              position: "absolute",
              top: 90,
              left: 755,
              color: highlightY ? "#ffd166" : "#cbd5e1",
              fontSize: 20,
              fontWeight: "bold",
              fontFamily: STYLE_TOKENS.fontSong,
              textShadow: highlightY ? "0 0 16px #ffd166" : undefined,
            }}
          >
            ↑ 温暖期待
          </div>

          {/* Bottom: 孤寂沉郁 ↓ */}
          <div
            style={{
              position: "absolute",
              bottom: 40,
              left: 755,
              color: highlightY ? "#48cae4" : "#cbd5e1",
              fontSize: 20,
              fontWeight: "bold",
              fontFamily: STYLE_TOKENS.fontSong,
              textShadow: highlightY ? "0 0 16px #48cae4" : undefined,
            }}
          >
            孤寂沉郁 ↓
          </div>
        </div>

        {/* 5. Four Poetic Node Cards (Gliding into position, with 4-char annotations) */}

        {/* NODE ①: 君问归期未有期 (巴山现实 · 孤寂无奈) */}
        <div
          style={{
            position: "absolute",
            left: node1X,
            top: node1Y,
            transform: "translate(-50%, -50%)",
            opacity: cardOpacity,
          }}
        >
          {/* Glowing node point */}
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: "50%",
              backgroundColor: "#3a86ff",
              boxShadow: "0 0 18px #3a86ff, 0 0 35px rgba(58, 134, 255, 0.6)",
              margin: "0 auto 8px auto",
            }}
          />
          <div
            style={{
              backgroundColor: "rgba(13, 27, 42, 0.88)",
              border: "1.5px solid #3a86ff",
              borderRadius: 12,
              padding: "10px 18px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.6)",
              whiteSpace: "nowrap",
              backdropFilter: "blur(6px)",
            }}
          >
            <div
              style={{
                color: "#93c5fd",
                fontWeight: "bold",
                fontSize: 18,
                fontFamily: STYLE_TOKENS.fontKai,
              }}
            >
              ① 君问归期未有期
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginTop: 4,
              }}
            >
              <span
                style={{
                  color: "#3a86ff",
                  backgroundColor: "rgba(58, 134, 255, 0.15)",
                  padding: "2px 8px",
                  borderRadius: 4,
                  fontSize: 13,
                  fontWeight: "bold",
                }}
              >
                归期未定
              </span>
              <span style={{ color: "#94a3b8", fontSize: 13 }}>
                现实 · 孤寂 (-2)
              </span>
            </div>
          </div>
        </div>

        {/* NODE ②: 巴山夜雨涨秋池 (巴山现实 · 沉郁夜雨) */}
        <div
          style={{
            position: "absolute",
            left: node2X,
            top: node2Y,
            transform: "translate(-50%, -50%)",
            opacity: cardOpacity,
          }}
        >
          {/* Glowing node point */}
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: "50%",
              backgroundColor: "#2a9d8f",
              boxShadow: "0 0 18px #2a9d8f, 0 0 35px rgba(42, 157, 143, 0.6)",
              margin: "0 auto 8px auto",
            }}
          />
          <div
            style={{
              backgroundColor: "rgba(13, 27, 42, 0.88)",
              border: "1.5px solid #2a9d8f",
              borderRadius: 12,
              padding: "10px 18px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.6)",
              whiteSpace: "nowrap",
              backdropFilter: "blur(6px)",
            }}
          >
            <div
              style={{
                color: "#64dfdf",
                fontWeight: "bold",
                fontSize: 18,
                fontFamily: STYLE_TOKENS.fontKai,
              }}
            >
              ② 巴山夜雨涨秋池
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginTop: 4,
              }}
            >
              <span
                style={{
                  color: "#2a9d8f",
                  backgroundColor: "rgba(42, 157, 143, 0.15)",
                  padding: "2px 8px",
                  borderRadius: 4,
                  fontSize: 13,
                  fontWeight: "bold",
                }}
              >
                夜雨涨池
              </span>
              <span style={{ color: "#94a3b8", fontSize: 13 }}>
                现实 · 沉郁 (-4)
              </span>
            </div>
          </div>
        </div>

        {/* NODE ③: 何当共剪西窗烛 (西窗将来 · 温暖期待) */}
        <div
          style={{
            position: "absolute",
            left: node3X,
            top: node3Y,
            transform: "translate(-50%, -50%)",
            opacity: cardOpacity,
          }}
        >
          {/* Glowing node point */}
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: "50%",
              backgroundColor: "#ff9f1c",
              boxShadow: "0 0 18px #ff9f1c, 0 0 35px rgba(255, 159, 28, 0.7)",
              margin: "0 auto 8px auto",
            }}
          />
          <div
            style={{
              backgroundColor: "rgba(35, 23, 10, 0.88)",
              border: "1.5px solid #ff9f1c",
              borderRadius: 12,
              padding: "10px 18px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.6)",
              whiteSpace: "nowrap",
              backdropFilter: "blur(6px)",
            }}
          >
            <div
              style={{
                color: "#ffd166",
                fontWeight: "bold",
                fontSize: 18,
                fontFamily: STYLE_TOKENS.fontKai,
              }}
            >
              ③ 何当共剪西窗烛
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginTop: 4,
              }}
            >
              <span
                style={{
                  color: "#ff9f1c",
                  backgroundColor: "rgba(255, 159, 28, 0.18)",
                  padding: "2px 8px",
                  borderRadius: 4,
                  fontSize: 13,
                  fontWeight: "bold",
                }}
              >
                西窗共话
              </span>
              <span style={{ color: "#cbd5e1", fontSize: 13 }}>
                想象 · 期待 (+3)
              </span>
            </div>
          </div>
        </div>

        {/* NODE ④: 却话巴山夜雨时 (时空重影核心高潮) */}
        <div
          style={{
            position: "absolute",
            left: node4X,
            top: node4Y,
            transform: `translate(-50%, -50%) scale(${highlightFold ? pulseScale * 1.05 : 1})`,
            transition: "transform 0.2s ease",
            opacity: cardOpacity,
          }}
        >
          {/* Dual Pulse Glowing node point with double rings */}
          <div
            style={{
              position: "relative",
              width: 22,
              height: 22,
              margin: "0 auto 8px auto",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                backgroundColor: "#ffb703",
                boxShadow: highlightFold
                  ? `0 0 ${35 * glowBeam}px #fb8500, 0 0 ${60 * glowBeam}px #ffb703`
                  : "0 0 20px #ffb703",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: -6,
                borderRadius: "50%",
                border: "2px solid #2a9d8f",
                opacity: 0.85,
              }}
            />
          </div>

          <div
            style={{
              backgroundColor: "rgba(35, 23, 10, 0.92)",
              border: `2px solid ${highlightFold ? "#fb8500" : "#ffd166"}`,
              borderRadius: 12,
              padding: "10px 18px",
              boxShadow: highlightFold
                ? `0 0 35px rgba(251, 133, 0, 0.55), 0 8px 24px rgba(0,0,0,0.8)`
                : "0 8px 24px rgba(0,0,0,0.6)",
              whiteSpace: "nowrap",
              backdropFilter: "blur(8px)",
            }}
          >
            <div
              style={{
                color: "#ffe8a3",
                fontWeight: "bold",
                fontSize: 18,
                fontFamily: STYLE_TOKENS.fontKai,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span>④ 却话巴山夜雨时</span>
              <span
                style={{
                  color: "#fb8500",
                  fontSize: 16,
                  fontWeight: "bold",
                }}
              >
                ◎
              </span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginTop: 4,
              }}
            >
              <span
                style={{
                  color: "#ffb703",
                  backgroundColor: "rgba(255, 183, 3, 0.2)",
                  padding: "2px 8px",
                  borderRadius: 4,
                  fontSize: 13,
                  fontWeight: "bold",
                }}
              >
                巴山夜语
              </span>
              <span style={{ color: "#ffd166", fontSize: 13 }}>
                时空重影 · 场景西窗 ↔ 话题巴山
              </span>
            </div>
          </div>
        </div>

        {/* 6. Traditional Right-Side Vertical Inscription of the Whole Poem 《夜雨寄北》 */}
        <div
          style={{
            position: "absolute",
            top: 140,
            right: 48,
            display: "flex",
            flexDirection: "row-reverse",
            gap: 20,
            opacity: cardOpacity,
          }}
        >
          {/* Poem Title */}
          <div
            style={{
              writingMode: "vertical-rl",
              fontFamily: STYLE_TOKENS.fontKai,
              fontSize: 21,
              color: "#ffe8a3",
              letterSpacing: 8,
              fontWeight: "bold",
              textShadow: "0 0 12px rgba(255, 183, 3, 0.4)",
            }}
          >
            《夜雨寄北》· 李商隐
          </div>

          {/* 4 Verses */}
          <div
            style={{
              writingMode: "vertical-rl",
              fontFamily: STYLE_TOKENS.fontSong,
              fontSize: 18,
              color: "#e2e8f0",
              letterSpacing: 6,
              lineHeight: 1.8,
              opacity: 0.9,
            }}
          >
            君问归期未有期
          </div>
          <div
            style={{
              writingMode: "vertical-rl",
              fontFamily: STYLE_TOKENS.fontSong,
              fontSize: 18,
              color: "#94a3b8",
              letterSpacing: 6,
              lineHeight: 1.8,
              opacity: 0.9,
            }}
          >
            巴山夜雨涨秋池
          </div>
          <div
            style={{
              writingMode: "vertical-rl",
              fontFamily: STYLE_TOKENS.fontSong,
              fontSize: 18,
              color: "#fed7aa",
              letterSpacing: 6,
              lineHeight: 1.8,
              opacity: 0.9,
            }}
          >
            何当共剪西窗烛
          </div>
          <div
            style={{
              writingMode: "vertical-rl",
              fontFamily: STYLE_TOKENS.fontSong,
              fontSize: 18,
              color: "#fef08a",
              letterSpacing: 6,
              lineHeight: 1.8,
              opacity: 0.9,
            }}
          >
            却话巴山夜雨时
          </div>
        </div>

        {/* 7. Vermilion Cinnabar Stamp (朱红「夜雨寄北」印章) */}
        <div
          style={{
            position: "absolute",
            bottom: 36,
            right: 48,
            width: 76,
            height: 76,
            border: "3px solid #d90429",
            borderRadius: 8,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "#d90429",
            fontSize: 22,
            fontFamily: STYLE_TOKENS.fontKai,
            fontWeight: "bold",
            writingMode: "vertical-rl",
            opacity: cardOpacity * 0.9,
            boxShadow: "0 0 16px rgba(217, 4, 41, 0.45), inset 0 0 8px rgba(217, 4, 41, 0.25)",
            backgroundColor: "rgba(217, 4, 41, 0.08)",
          }}
        >
          夜雨寄北
        </div>
      </div>
    </AbsoluteFill>
  );
};

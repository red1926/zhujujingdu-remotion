import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  Img,
  Freeze,
  Sequence,
  useVideoConfig,
  OffthreadVideo,
  Loop,
} from "remotion";

interface BackgroundLayerProps {
  theme: "cold" | "warm" | "spatiotemporal-fold" | "full-map";
  shotNumber: number;
  videoSrc?: string;
  overlayVideoSrc?: string;
  overlayOpacity?: number;
  baseVideoMode?: "loop-slow" | "time-remap-s11" | "freeze-last" | "custom-rate" | "crossfade-loop-2x";
  overlayVideoMode?: "loop-slow" | "time-remap-s11" | "freeze-last" | "custom-rate" | "crossfade-loop-2x";
  customPlaybackRate?: number;
  volume?: number | ((frame: number) => number);
}

export const BackgroundLayer: React.FC<BackgroundLayerProps> = ({
  theme,
  shotNumber,
  videoSrc,
  overlayVideoSrc,
  overlayOpacity = 0.45,
  baseVideoMode = "loop-slow",
  overlayVideoMode = "loop-slow",
  customPlaybackRate = 1,
  volume = 1,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Evaluate volume at the BackgroundLayer level to ensure global frame consistency
  const currentVolume = typeof volume === "function" ? volume(frame) : volume;
  const safeVolume = isNaN(currentVolume) ? 0 : currentVolume;

  // Procedural dynamic visual effects (rain, ripple, mist, candle pulse)
  const candlePulse = interpolate(
    Math.sin(frame * 0.12) + Math.cos(frame * 0.07),
    [-2, 2],
    [0.88, 1.12]
  );
  const rainOffset = (frame * 16) % 800;
  const mistOffset = interpolate(frame, [0, 600], [0, 180]);
  const waterLevel = interpolate(
    frame,
    [0, 390],
    shotNumber === 10 ? [0, 38] : [0, 0],
    { extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#06090e",
        overflow: "hidden",
      }}
    >
      {/* 1. Base Video Layer with Looping, Slow Motion, or Freeze */}
      {videoSrc && baseVideoMode === "loop-slow" && (
        <Loop durationInFrames={300}>
          <OffthreadVideo
            src={videoSrc}
            playbackRate={0.5} // Slow down 2x to stretch AI generated video
            volume={safeVolume}
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: 0.85,
            }}
          />
        </Loop>
      )}
      {videoSrc && baseVideoMode === "crossfade-loop-2x" && (() => {
        // Tile the video at 1x speed. Assuming video is 300 frames (10s) long.
        // Overlap by 60 frames (2s) to ensure audio and video are perfectly continuous.
        // A new video starts every 240 frames (8s), solving the audio cutout issue.
        const L = 300;
        const O = 60;
        const step = L - O; // 240 frames
        const count = Math.ceil(durationInFrames / step);

        return (
          <AbsoluteFill>
            {Array.from({ length: count }).map((_, i) => {
              const start = i * step;
              return (
                <Sequence key={i} from={start} durationInFrames={L}>
                  <AbsoluteFill
                    style={{
                      opacity: interpolate(
                        frame,
                        [start, start + O, start + L - O, start + L],
                        [i === 0 ? 1 : 0, 1, 1, 0],
                        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                      ),
                    }}
                  >
                    <OffthreadVideo
                      src={videoSrc}
                      playbackRate={1}
                      volume={safeVolume}
                      style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        opacity: 0.85,
                      }}
                    />
                  </AbsoluteFill>
                </Sequence>
              );
            })}
          </AbsoluteFill>
        );
      })()}
      {videoSrc && baseVideoMode === "time-remap-s11" && (
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={150}>
            <OffthreadVideo
              src={videoSrc}
              playbackRate={1} // Plays frames 0-150 (first 5s transition) in 150 frames
              volume={safeVolume}
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                objectFit: "cover",
                opacity: 0.85,
              }}
            />
          </Sequence>
          <Sequence from={150}>
            <OffthreadVideo
              src={videoSrc}
              startFrom={150} // Starts at 5s
              playbackRate={150 / 240} // Stretches the last 150 frames (5s) over the remaining 240 frames
              volume={safeVolume}
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                objectFit: "cover",
                opacity: 0.85,
              }}
            />
          </Sequence>
        </AbsoluteFill>
      )}
      {videoSrc && baseVideoMode === "freeze-last" && (
        <Freeze frame={299}>
          <OffthreadVideo
            src={videoSrc}
            volume={safeVolume}
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: 0.85,
            }}
          />
        </Freeze>
      )}
      {videoSrc && baseVideoMode === "custom-rate" && (
          <OffthreadVideo
          src={videoSrc}
          playbackRate={customPlaybackRate}
          volume={safeVolume}
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.85,
          }}
        />
      )}


      {/* 2. Color overlay masks with dynamic interpolation for smooth transitions */}
      {(() => {
        const isS11 = shotNumber === 11;
        // In S11, the video starts in the cold rain and enters the warm room. 
        // Transition finishes at 5s (frame 150). Fade the overlay right as the indoor scene stabilizes.
        const warmProgress = isS11
          ? interpolate(frame, [130, 150], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
          : (theme === "warm" ? 1 : 0);

        if (theme === "full-map") {
          return (
            <AbsoluteFill
              style={{
                background: "linear-gradient(180deg, rgba(36,25,12,0.6) 0%, rgba(8,13,22,0.8) 100%)",
              }}
            />
          );
        }

        const isFold = theme === "spatiotemporal-fold";
        
        let r, g, b, a;
        if (isFold) {
          r = 20; g = 18; b = 24; a = 0.85;
        } else {
          // Cold theme base values: 10, 15, 24, 0.8
          // Warm theme base values: 24, 15, 5, 0.8
          r = interpolate(warmProgress, [0, 1], [10, 24]);
          g = interpolate(warmProgress, [0, 1], [15, 15]);
          b = interpolate(warmProgress, [0, 1], [24, 5]);
          a = 0.8;
        }

        return (
          <AbsoluteFill
            style={{
              background: `linear-gradient(to top, rgba(${r}, ${g}, ${b}, ${a}), rgba(0,0,0,0.1))`,
            }}
          />
        );
      })()}

      {/* 3. Overlay Video Layer for Spatiotemporal Fold (Shot 12) */}
      {overlayVideoSrc && overlayVideoMode === "loop-slow" && (
        <Loop durationInFrames={300}>
          <OffthreadVideo
            src={overlayVideoSrc}
            playbackRate={0.5} // Match base layer playback rate
            volume={0} // Overlays shouldn't double the audio volume
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              objectFit: "cover",
              mixBlendMode: "screen",
              opacity: overlayOpacity,
            }}
          />
        </Loop>
      )}
      {overlayVideoSrc && overlayVideoMode === "time-remap-s11" && (
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={135}>
            <OffthreadVideo
              src={overlayVideoSrc}
              playbackRate={2}
              volume={0}
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                objectFit: "cover",
                mixBlendMode: "screen",
                opacity: overlayOpacity,
              }}
            />
          </Sequence>
          <Sequence from={135}>
            <OffthreadVideo
              src={overlayVideoSrc}
              startFrom={270}
              playbackRate={30 / 255}
              volume={0}
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                objectFit: "cover",
                mixBlendMode: "screen",
                opacity: overlayOpacity,
              }}
            />
          </Sequence>
        </AbsoluteFill>
      )}
      {overlayVideoSrc && overlayVideoMode === "freeze-last" && (
        <Freeze frame={299}>
          <OffthreadVideo
            src={overlayVideoSrc}
            volume={0}
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              objectFit: "cover",
              mixBlendMode: "screen",
              opacity: overlayOpacity,
            }}
          />
        </Freeze>
      )}


      {/* 4. Subtle cinematic vignette border */}
      <AbsoluteFill
        style={{
          boxShadow: "inset 0 0 180px rgba(0,0,0,0.9)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};

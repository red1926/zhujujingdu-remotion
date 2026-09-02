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
  imageSrc?: string;
  overlayImageSrc?: string;
  videoSrc?: string;
  overlayVideoSrc?: string;
  overlayOpacity?: number;
  baseVideoMode?: "loop-slow" | "time-remap-s11" | "freeze-last" | "custom-rate" | "crossfade-loop-2x";
  overlayVideoMode?: "loop-slow" | "time-remap-s11" | "freeze-last" | "custom-rate" | "crossfade-loop-2x";
  customPlaybackRate?: number;
  volume?: number | ((frame: number) => number);
  kenBurns?: {
    startScale?: number;
    endScale?: number;
    startTranslateX?: number;
    endTranslateX?: number;
    startTranslateY?: number;
    endTranslateY?: number;
  };
}

const CrossfadeVideoItem: React.FC<{
  videoSrc: string;
  videoLength: number;
  overlap: number;
  isFirst: boolean;
  volume: number;
}> = ({ videoSrc, videoLength, overlap, isFirst, volume }) => {
  const frame = useCurrentFrame();
  let opacity = 1;
  if (!isFirst) {
    opacity = interpolate(frame, [0, overlap], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  }
  const fadeOut = interpolate(frame, [videoLength - overlap, videoLength], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  opacity = Math.min(opacity, fadeOut);

  return (
    <OffthreadVideo
      src={videoSrc}
      playbackRate={1}
      volume={volume}
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        objectFit: "cover",
        opacity: opacity * 0.85,
      }}
    />
  );
};

const CrossfadeLoopVideo: React.FC<{
  videoSrc: string;
  durationInFrames: number;
  videoLength?: number;
  overlap?: number;
  volume: number;
}> = ({ videoSrc, durationInFrames, videoLength = 224, overlap = 45, volume }) => {
  const step = videoLength - overlap;
  const count = Math.ceil(durationInFrames / step) + 1;

  return (
    <AbsoluteFill>
      {Array.from({ length: count }).map((_, i) => {
        const start = i * step;
        if (start >= durationInFrames) return null;
        return (
          <Sequence key={i} from={start} durationInFrames={videoLength}>
            <CrossfadeVideoItem
              videoSrc={videoSrc}
              videoLength={videoLength}
              overlap={overlap}
              isFirst={i === 0}
              volume={volume}
            />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

export const BackgroundLayer: React.FC<BackgroundLayerProps> = ({
  theme,
  shotNumber,
  imageSrc,
  overlayImageSrc,
  videoSrc,
  overlayVideoSrc,
  overlayOpacity = 0.45,
  baseVideoMode = "loop-slow",
  overlayVideoMode = "loop-slow",
  customPlaybackRate = 1,
  volume = 1,
  kenBurns,
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
    [0.92, 1.08]
  );

  // Ken Burns subtle camera motion for static images
  const scale = kenBurns
    ? interpolate(
        frame,
        [0, durationInFrames],
        [kenBurns.startScale ?? 1, kenBurns.endScale ?? 1.03],
        { extrapolateRight: "clamp" }
      )
    : interpolate(frame, [0, durationInFrames], [1, 1.025], {
        extrapolateRight: "clamp",
      });

  const translateX = kenBurns?.startTranslateX !== undefined
    ? interpolate(
        frame,
        [0, durationInFrames],
        [kenBurns.startTranslateX, kenBurns.endTranslateX ?? kenBurns.startTranslateX],
        { extrapolateRight: "clamp" }
      )
    : 0;

  const translateY = kenBurns?.startTranslateY !== undefined
    ? interpolate(
        frame,
        [0, durationInFrames],
        [kenBurns.startTranslateY, kenBurns.endTranslateY ?? kenBurns.startTranslateY],
        { extrapolateRight: "clamp" }
      )
    : 0;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#06090e",
        overflow: "hidden",
      }}
    >
      {/* 1. Base Image Layer with subtle cinematic Ken Burns motion */}
      {imageSrc && (
        <AbsoluteFill
          style={{
            transform: `scale(${scale}) translate(${translateX}px, ${translateY}px)`,
            transformOrigin: "center center",
          }}
        >
          <Img
            src={imageSrc}
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: 0.9,
            }}
          />
        </AbsoluteFill>
      )}

      {/* 1b. Overlay Image Layer (e.g. for Double Exposure / Spatiotemporal Fold) */}
      {overlayImageSrc && (
        <AbsoluteFill
          style={{
            opacity: overlayOpacity,
            mixBlendMode: theme === "spatiotemporal-fold" ? "screen" : "normal",
            transform: `scale(${scale}) translate(${translateX}px, ${translateY}px)`,
            transformOrigin: "center center",
          }}
        >
          <Img
            src={overlayImageSrc}
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </AbsoluteFill>
      )}
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
      {videoSrc && baseVideoMode === "crossfade-loop-2x" && (
        <CrossfadeLoopVideo
          videoSrc={videoSrc}
          durationInFrames={durationInFrames}
          videoLength={224}
          overlap={45}
          volume={safeVolume}
        />
      )}
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

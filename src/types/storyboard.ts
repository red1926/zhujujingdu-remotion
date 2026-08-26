export interface CoordinatePoint {
  id: string; // '1' | '2' | '3' | '4_scene' | '4_topic'
  label: string;
  x: number; // -5 to +5 (West window -5 to Ba mountain +5)
  y: number; // -5 to +5 (Solitude -5 to Warm expectation +5)
  color: string;
  glowColor: string;
  verseIndex: number;
  timeTag: string; // e.g. "现实现在 · -2"
  shortDesc: string;
}

export interface ShotConfig {
  shotNumber: number;
  title: string;
  startSecond: number;
  endSecond: number;
  durationInFrames: number;
  voiceover: string;
  verse?: string;
  activePoints: string[];
  theme: "cold" | "warm" | "spatiotemporal-fold" | "full-map";
  note?: string;
}

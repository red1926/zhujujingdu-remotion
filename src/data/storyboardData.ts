import { CoordinatePoint, ShotConfig } from "../types/storyboard";

export const FPS = 30;

// 坐标系统标准点定义 (逻辑坐标保持用于计算位置，展示标签纯文学化)
export const COORDINATE_POINTS: Record<string, CoordinatePoint> = {
  "1": {
    id: "1",
    label: "① 巴山 · 此刻",
    x: 3,
    y: -2,
    color: "#3a86ff",
    glowColor: "rgba(58, 134, 255, 0.7)",
    verseIndex: 1,
    timeTag: "① 现实此刻 · 下沉",
    shortDesc: "归期未定，现实仍停在巴山。",
  },
  "2": {
    id: "2",
    label: "② 巴山 · 此刻",
    x: 4,
    y: -4,
    color: "#00b4d8",
    glowColor: "rgba(0, 180, 216, 0.8)",
    verseIndex: 2,
    timeTag: "② 现实此刻 · 沉到底部",
    shortDesc: "现实没有离开，情绪却继续下沉。",
  },
  "3": {
    id: "3",
    label: "③ 西窗 · 将来",
    x: -3,
    y: 3,
    color: "#ffb703",
    glowColor: "rgba(255, 183, 3, 0.85)",
    verseIndex: 3,
    timeTag: "③ 想象将来 · 跃升",
    shortDesc: "从现实滑向想象。",
  },
  "4_scene": {
    id: "4_scene",
    label: "④ 西窗 · 将来",
    x: -3,
    y: 2,
    color: "#ffb703",
    glowColor: "rgba(255, 183, 3, 0.85)",
    verseIndex: 4,
    timeTag: "④ 场景：西窗 · 将来",
    shortDesc: "人在想象的将来",
  },
  "4_topic": {
    id: "4_topic",
    label: "④ 巴山 · 此刻",
    x: 4,
    y: -4,
    color: "#2a9d8f",
    glowColor: "rgba(42, 157, 143, 0.85)",
    verseIndex: 4,
    timeTag: "④ 话题：巴山 · 此刻",
    shortDesc: "话题回到此刻的巴山",
  },
};

// 分镜时间与文案配置 (4:25 - 6:30，共 125 秒)
export const SHOT_CONFIGS: ShotConfig[] = [
  {
    shotNumber: 8,
    title: "AI界面退场 · 过渡至逐句精读",
    startSecond: 0,
    endSecond: 10,
    durationInFrames: 10 * FPS, // 300
    voiceover: "AI完成了初步判断。现在，让我们回到诗本身，逐句看。",
    activePoints: [],
    theme: "cold",
    note: "AI已退场 · 回到诗境",
  },
  {
    shotNumber: 9,
    title: "逐句精读——第一句",
    startSecond: 10,
    endSecond: 23,
    durationInFrames: 13 * FPS, // 390
    voiceover: "君问归期未有期。人在巴山，收到来自北方的问讯。归期未定，这是此刻的现实。",
    verse: "君问归期未有期",
    activePoints: ["1"],
    theme: "cold",
    note: "① 现实此刻 · 下沉",
  },
  {
    shotNumber: 10,
    title: "逐句精读——第二句",
    startSecond: 23,
    endSecond: 35.5,
    durationInFrames: 12.5 * FPS, // 375
    voiceover: "巴山夜雨涨秋池。雨势渐大，秋池上涨，孤独也随着夜雨加深。",
    verse: "巴山夜雨涨秋池",
    activePoints: ["2"],
    theme: "cold",
    note: "② 现实此刻 · 沉到底部",
  },
  {
    shotNumber: 11,
    title: "逐句精读——第三句",
    startSecond: 35.5,
    endSecond: 48,
    durationInFrames: 12.5 * FPS, // 375
    voiceover: "何当共剪西窗烛。画面从巴山转向西窗，从此刻转向将来。",
    verse: "何当共剪西窗烛",
    activePoints: ["3"],
    theme: "warm",
    note: "③ 想象将来 · 跃升",
  },
  {
    shotNumber: 12,
    title: "逐句精读——第四句【核心高潮】",
    startSecond: 48,
    endSecond: 63.5,
    durationInFrames: 15.5 * FPS, // 465
    voiceover: "却话巴山夜雨时。西窗仍然在，但巴山的雨从烛光里浮现了——将来的人，在回忆此刻的夜雨。这个点，标不准。",
    verse: "却话巴山夜雨时",
    activePoints: ["4_scene", "4_topic"],
    theme: "spatiotemporal-fold",
    note: "◎ 时空重影点",
  },
  {
    shotNumber: 13,
    title: "完整情感地图呈现",
    startSecond: 63.5,
    endSecond: 85.5,
    durationInFrames: 22 * FPS, // 660
    voiceover: "现在，我们有了完整的情感地图。四句诗，四个坐标——前三句各归其位，第四句同时占有两个位置。",
    activePoints: ["1", "2", "3", "4_scene", "4_topic"],
    theme: "full-map",
  },
  {
    shotNumber: 14,
    title: "情感地图定格与小结",
    startSecond: 85.5,
    endSecond: 123.5,
    durationInFrames: 38 * FPS, // 1140
    voiceover: "用横轴读时间与空间——巴山此刻，西窗将来。用纵轴读情感——孤寂沉郁，温暖期待。找到折叠点——第四句，时空重影。AI提供清晰分类，人的阅读补回情感的复杂性。",
    activePoints: ["1", "2", "3", "4_scene", "4_topic"],
    theme: "full-map",
  },
];

// 色彩与风格配置常量
export const STYLE_TOKENS = {
  colorBaDark: "#0d1b2a",
  colorBaBlue: "#1b263b",
  colorColdRain: "#415a77",
  colorWestWarm: "#ffb703",
  colorCandleAmber: "#fb8500",
  colorTextGold: "#ffe8a3",
  colorTextWhite: "#f8f9fa",
  colorAxis: "#8d99ae",
  fontSong: "'Noto Serif SC', 'Songti SC', 'SimSun', serif",
  fontKai: "'STKaiti', 'KaiTi', 'Kaiti SC', serif",
};

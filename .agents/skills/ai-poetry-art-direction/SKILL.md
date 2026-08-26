---
name: ai-poetry-art-direction
description: >-
  Visual art direction, color palette standards, and AI image/video generation prompt guide
  specifically tailored for Chinese classical poetry animations (such as 《夜雨寄北》).
  Use when designing prompts for Midjourney, Flux, Kling (可灵), Runway Gen-3, or Hailuo.
---

# Classical Poetry Animation Art Direction Guide

This skill defines the aesthetic tokens, color palettes, and structured AI generation prompts for classical Chinese poetry animations, specifically the multi-layered ink wash and gouache aesthetic of 《夜雨寄北》.

---

## 1. Core Visual Palette & Design System

| Role | Tone / Style | Hex / Color Codes | Visual Metaphor |
| :--- | :--- | :--- | :--- |
| **Ba Mountain Reality (巴山此刻)** | Cold ink blue / dark teal | `#1a2634`, `#223a5e` | Rainy night, rising autumn pond, deep solitude, heavy mist |
| **West Window Future (西窗将来)** | Warm candlelight amber / gold | `#ffc24d`, `#e09f3e`, `#d4a373` | Flickering candlelight, warm intimate room, trimming candle wick |
| **Spatiotemporal Fold (时空重影)** | Dual-overlay / Amber & Blue pulse | Overlay `#ffc24d` & `#223a5e` | Translucent cold rain shimmering over warm candlelight |
| **Ink Calligraphy (水墨书法)** | Traditional Song / Kai calligraphy | Off-white `#f5f2eb` / Gold `#ffd700` | Poetic verses floating into composition |

---

## 2. Shot-by-Shot AI Generation Prompt Templates

### Shot 9 (4:35 - 4:48) · 第一句「君问归期未有期」
- **生图 (Midjourney / Flux)**:
  `Chinese traditional ink wash painting style, misty rainy night in Ba Mountains, layered dark blue mountain silhouettes, vertical fine rain falling into autumn pond with gentle ripples, a lonely poet in ancient Chinese scholar robes standing by the misty lake shore looking towards the north, minimalistic, cold color tone (#1a2634), cinematic lighting, poetic atmosphere, 8k --ar 16:9`
- **图生视频 (Kling / Runway / Hailuo)**:
  `细雨从暗夜中缓缓飘落，水面泛起细微水波涟漪，远山雾气缓慢蒸腾流动，岸边文人衣袂微拂，镜头极为缓慢地向前推进，孤独静谧氛围。`

### Shot 10 (4:48 - 5:01) · 第二句「巴山夜雨涨秋池」
- **生图 (Midjourney / Flux)**:
  `Chinese traditional ink painting, heavy autumn rainstorm over deep mountain pond in Ba Mountain, rising water surface, dense rain lines slashing across dark sky, solitary silhouette near the overflowing pool, somber dark teal and ink palette, highly detailed, dramatic lighting --ar 16:9`
- **图生视频 (Kling / Runway / Hailuo)**:
  `雨势明显加剧，密集雨滴急速击打水面，秋池水面以肉眼可见的速度缓缓上涨，水流涟漪层叠扩散，镜头微幅下沉下移，传递沉郁孤独感。`

### Shot 11 (5:01 - 5:14) · 第三句「何当共剪西窗烛」
- **生图 (Midjourney / Flux)**:
  `Chinese traditional gongbi and ink illustration, interior view of an ancient wooden lattice window at night, glowing warm candlelight casting amber rays, silhouettes of two close friends sitting by the table happily trimming candle wicks together, cozy, intimate, warm golden amber palette (#ffc24d), dreamy atmosphere, 8k --ar 16:9`
- **图生视频 (Kling / Runway / Hailuo)**:
  `桌上烛火温和摇曳，金色光晕随微风柔和呼吸律动，两人剪烛动作自然舒缓，窗外冷色夜景淡化，镜头平稳缓慢环移，洋溢重逢期待与温馨。`

### Shot 12 (5:14 - 5:30) · 第四句「却话巴山夜雨时」【时空重影核心】
- **工艺方案**:
  - 底层使用 **Shot 11 的西窗暖金视频**。
  - 顶层使用 **Shot 9/10 的巴山冷雨剪影视频**，在 Remotion 中设置 `opacity: 0.45` 与 `mix-blend-mode: screen`。
  - 呈现“烛光中依稀映出巴山雨夜”的双重时空交叠效果。

### Shot 13 & 14 (5:30 - 6:30) · 完整诗意地图全景
- **底图 (Midjourney / Flux)**:
  `High resolution Chinese panoramic ink and gouache scroll, a conceptual poetic map of "Night Rain in the North", top half glowing in warm amber candlelight and golden green mist showing western window, bottom half submerged in deep cold ink blue rainy night in Ba Mountains, connected by a continuous detailed ink leaf vein running from top to bottom, elegant negative space, calligraphy stamp on the corner, 8k, masterpiece --ar 16:9`

---

## 3. Remotion Layering & Composite Rules
1. **Background Layer**: AI Video (`<OffthreadVideo>` / `<Video>`) with smooth CSS filter / contrast adjustments.
2. **Mask Layer**: Use SVG radial gradients or `linear-gradient` to create vignette / negative space for text and charts.
3. **UI / Chart Layer**: Crisp vector coordinates, pulse dots, animated lines (`@remotion/paths`).
4. **Typography Layer**: High-contrast Song/Kai fonts with subtle blur-in / stroke-drawing animations.

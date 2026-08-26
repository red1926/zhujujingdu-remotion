---
name: ai-video-poetry-keyframes
description: >-
  Advanced prompt engineering guide for AI video generation (Kling, Runway, Hailuo)
  using start-frame and end-frame (首尾帧) constraints to achieve seamless scene transitions.
  Provides ultra-precise, cinematic prompt templates for "Night Rain in the North" (夜雨寄北).
---

# AI Video Keyframe Strategy & Ultra-Precise Prompts

This skill defines the precise prompt engineering required to generate seamless, continuous AI video transitions using Start/End frame (首尾帧) conditioning on advanced video models (like Kling 1.5, Runway Gen-3, or Hailuo).

## Core Principles
1. **Camera Control (运镜)**: Must use exact camera terms (e.g., `Static locked-off shot`, `Rapid zoom in`, `Slow pan`).
2. **Atmosphere & Lighting (光影)**: Specify volumetric lighting, color hex equivalents (e.g., `deep teal #1a2634`, `warm amber #ffc24d`).
3. **Motion Dynamics (动态)**: Differentiate between background motion (rain, fog) and subject motion (trimming candle).

## 4-Video Continuous Generation Pipeline

### Video 1: 孤寂巴山 (S8 -> S9)
**Goal**: Establish the cold, lonely environment with a hint of the future (distant house).
- **[S8 Start Frame Image Prompt]**:
  `Masterpiece, 8k resolution, cinematic lighting. Traditional Chinese ink wash mixed with hyper-realistic photography. A misty night in the Ba Mountains (巴山). In the foreground, a dark autumn pond with gentle ripples. In the midground, a solitary scholar in flowing dark blue Hanfu stands perfectly still, back facing the camera, looking out into the vast darkness. In the far distant background mountain, a single tiny wooden house emits a faint, warm amber glow. Color palette: deep ink blue, dark teal, cold and desolate. Volumetric fog.`
- **[S9 End Frame Image Prompt]**: 
  (Use the exact same prompt as S8 Start Frame, or identical seed to ensure pixel-perfect match).
- **[S8-S9 Video Generation Prompt]**:
  `Static locked-off shot (固定机位). Slow, atmospheric motion. Very fine, gentle rain falls softly into the dark pond, creating minimal ripples. Thick mist rolls extremely slowly across the distant mountains. The solitary scholar stands completely motionless like a statue. The faint warm amber light in the distance remains steady. Melancholy, quiet, and extremely slow-paced.`

### Video 2: 夜雨涨池 (S10)
**Goal**: Time passes, rain intensifies dramatically, water level rises.
- **[S10 Start Frame]**: *USE S9 END FRAME IMAGE AS INPUT*
- **[S10 End Frame Image Prompt]**:
  `Masterpiece, 8k resolution. Same composition as before. A misty night in the Ba Mountains, solitary scholar back facing camera, distant house with amber glow. EXCEPT: The autumn pond water level has risen significantly, flooding the edges. Heavy torrential rain slashing through the scene. Darker, more oppressive lighting. The distant amber light is slightly blurred by the heavy rain.`
- **[S10 Video Generation Prompt]**:
  `Locked-off camera. The weather drastically worsens. Torrential rain pours down violently. Heavy raindrops slash through the air and crash into the pond, creating chaotic, splashing ripples. The water level of the pond visibly and rapidly rises. The heavy mist swirls aggressively. The distant amber light flickers slightly in the storm. Oppressive, tense atmosphere.`

### Video 3: 穿梭西窗 (S11) - *The Master Transition*
**Goal**: A highly dynamic camera move that bridges the two spaces by zooming into the distant light.
- **[S11 Start Frame]**: *USE S10 END FRAME IMAGE AS INPUT*
- **[S11 End Frame Image Prompt]**:
  `Masterpiece, 8k resolution. Interior view of an ancient Chinese room at night. Warm, cozy, golden amber lighting (#ffc24d). A wooden table with an ornate candle holder, the candle flame burning brightly. Two close friends (silhouettes) sit across from each other; one is holding traditional scissors, gently trimming the candle wick. Outside the wooden lattice window, it is pitch black and raining. Intimate, warm, joyful reunion atmosphere.`
- **[S11 Video Generation Prompt]**:
  `Extreme camera movement (极速推镜头). The camera starts behind the scholar in the cold rain, then rapidly zooms forward at high speed, flying over the pond, piercing through the heavy rain and fog, heading straight towards the distant amber light. It crashes through the glowing wooden lattice window. Instantly, the camera drastically slows down to a gentle halt inside the warm room. The violent rain is left outside. Inside, the candle flame flickers softly, and the two silhouettes smoothly and happily trim the candle wick. A perfect transition from cold dynamic speed to warm static intimacy.`

### Video 4: 时空重影 (S12)
**Goal**: Surreal double exposure blending the warm present with the cold memory.
- **[S12 Start Frame]**: *USE S11 END FRAME IMAGE AS INPUT*
- **[S12 End Frame Image Prompt]**:
  `Masterpiece, 8k resolution. A surreal double-exposure (双重曝光) image. The base layer is the warm golden interior of the room with the two friends trimming the candle. Superimposed seamlessly over this warm room is a ghostly, semi-transparent projection of the cold, dark blue Ba Mountain rainy night and the solitary scholar's silhouette. The warm amber and cold teal colors blend beautifully. Cinematic, poetic, surrealistic art.`
- **[S12 Video Generation Prompt]**:
  `Static camera. The interior scene remains warm and cozy, candle flickering gently. Slowly and magically, a surreal double exposure effect begins to manifest. A ghostly, semi-transparent overlay of the torrential Ba Mountain rain and the solitary scholar's silhouette fades into the room's space. The cold blue rain appears to fall inside the warm room as a memory projection. The two spatiotemporal layers coexist beautifully. Ethereal, dreamlike, melancholic.`

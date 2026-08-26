const fs = require("fs");
const { Document, Packer, Paragraph, TextRun, HeadingLevel } = require("docx");

const doc = new Document({
  sections: [
    {
      properties: {},
      children: [
        new Paragraph({
          text: "《夜雨寄北》AI视频分段生成与转场说明（Google Flow / Veo 专版）",
          heading: HeadingLevel.HEADING_1,
        }),
        new Paragraph({
          text: "本文件专为 Google Flow (及 Veo 等 Google 系大模型) 优化。Google 视觉模型偏好完整、流畅的自然语言描述（Natural Language），而非逗号分隔的标签。以下所有 Prompt 均已重写为高度叙事性、连贯且精准的英文长句，以完美驱动首尾帧强控生成，确保 10 秒以内的单次生成达到极致的电影级连贯。",
          spacing: { after: 200 },
        }),
        
        new Paragraph({
          text: "一、分段结构总览",
          heading: HeadingLevel.HEADING_2,
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "视频 1 (S8 - S9共用)", bold: true }),
            new TextRun({ text: "：确立巴山场景，展示第一句诗的孤寂感。" }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "视频 2 (S10)", bold: true }),
            new TextRun({ text: "：场景不变，但雨变大、水变深。" }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "视频 3 (S11)", bold: true }),
            new TextRun({ text: "：核心运镜转场。镜头推入远处发光小屋，转入西窗暖室。" }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "视频 4 (S12)", bold: true }),
            new TextRun({ text: "：双重曝光将巴山冷雨画面重现，完成时空重影。" }),
          ],
          spacing: { after: 200 },
        }),

        new Paragraph({
          text: "二、首尾帧与 Google Flow 专属生成提示词 (Prompt)",
          heading: HeadingLevel.HEADING_2,
        }),
        
        new Paragraph({ text: "1. 视频 1：孤寂巴山 (S8 -> S9)", heading: HeadingLevel.HEADING_3 }),
        new Paragraph({ text: "【S8 初始帧】图片生成 Prompt", bold: true }),
        new Paragraph({ text: "A breathtaking cinematic wide shot of a misty night in the Ba Mountains, blending traditional Chinese ink wash aesthetics with hyper-realistic photography. In the foreground, a dark autumn pond gently ripples. In the midground, a solitary scholar dressed in flowing dark blue Hanfu stands perfectly still, with his back facing the camera, gazing into the vast darkness. Deep in the background mountains, a single tiny wooden house emits a faint, warm amber glow. The entire scene is bathed in cold, desolate colors of deep ink blue and dark teal, enhanced by thick volumetric fog." }),
        new Paragraph({ text: "【S9 尾帧】", bold: true }),
        new Paragraph({ text: "（请使用与 S8 初始帧相同的图片/Seed 以保证 100% 构图一致）" }),
        new Paragraph({ text: "【S8-S9】视频生成 Prompt", bold: true }),
        new Paragraph({ text: "A static locked-off camera captures a highly atmospheric and slow-paced scene. Very fine, gentle rain falls softly into the dark pond, creating minimal water ripples. Thick mist rolls extremely slowly across the distant mountains. The solitary scholar remains completely motionless like a statue in the cold night. The faint warm amber light in the distant house remains steady. The mood is highly melancholic and quiet." }),
        
        new Paragraph({ text: "2. 视频 2：夜雨涨池 (S10)", heading: HeadingLevel.HEADING_3, spacing: { before: 200 } }),
        new Paragraph({ text: "【S10 首帧】直接输入上方生成的“S9 尾帧图片”", bold: true }),
        new Paragraph({ text: "【S10 尾帧】图片生成 Prompt", bold: true }),
        new Paragraph({ text: "A breathtaking cinematic wide shot identical in composition to the previous scene, but the weather has worsened significantly. The autumn pond water level has risen to flood the edges of the shore. Heavy torrential rain is violently slashing through the dark scene. The lighting is much darker and more oppressive. The solitary scholar remains standing. The distant amber light is now slightly blurred and distorted by the heavy rain." }),
        new Paragraph({ text: "【S10】视频生成 Prompt", bold: true }),
        new Paragraph({ text: "The camera is perfectly still while the weather drastically worsens. Torrential rain pours down violently from the sky. Heavy raindrops slash through the air and crash into the pond, creating chaotic, splashing ripples. The water level of the pond visibly and rapidly rises. Thick, heavy mist swirls aggressively around the scholar. The distant amber light flickers slightly in the violent storm, creating a deeply oppressive and tense atmosphere." }),

        new Paragraph({ text: "3. 视频 3：穿梭西窗转场 (S11)", heading: HeadingLevel.HEADING_3, spacing: { before: 200 } }),
        new Paragraph({ text: "【S11 首帧】直接输入上方生成的“S10 尾帧图片”", bold: true }),
        new Paragraph({ text: "【S11 尾帧】图片生成 Prompt", bold: true }),
        new Paragraph({ text: "An intimate, beautifully lit interior view of an ancient Chinese room at night. The room is glowing with a warm, cozy, golden amber light. On a wooden table sits an ornate candle holder with a brightly burning flame. Two close friends, seen as beautifully contoured silhouettes, sit across from each other; one is holding traditional scissors, gently trimming the candle wick. Outside the intricate wooden lattice window, it is pitch black and raining heavily. The atmosphere is filled with warmth and the joy of reunion." }),
        new Paragraph({ text: "【S11】视频生成 Prompt", bold: true }),
        new Paragraph({ text: "An extreme and dynamic forward camera push. The camera starts behind the scholar in the cold rain, then rapidly zooms forward at an incredibly high speed. It flies directly over the pond, pierces through the heavy rain and fog, and heads straight towards the distant amber light. The camera seamlessly crashes through the glowing wooden lattice window and instantly slows down to a gentle halt inside the warm room. Outside, the violent rain continues, but inside, the candle flame flickers softly while two silhouettes smoothly and happily trim the candle wick." }),

        new Paragraph({ text: "4. 视频 4：时空重影 (S12)", heading: HeadingLevel.HEADING_3, spacing: { before: 200 } }),
        new Paragraph({ text: "【S12 首帧】直接输入上方生成的“S11 尾帧图片”", bold: true }),
        new Paragraph({ text: "【S12 尾帧】图片生成 Prompt", bold: true }),
        new Paragraph({ text: "A surreal, masterpiece double-exposure image. The base layer is the warm golden interior of the room with the two friends trimming the candle. Superimposed seamlessly over this warm room is a ghostly, semi-transparent projection of the cold, dark blue Ba Mountain rainy night and the solitary scholar's silhouette. The warm amber and cold teal colors blend together beautifully, creating a poetic, cinematic, and surrealistic piece of art." }),
        new Paragraph({ text: "【S12】视频生成 Prompt", bold: true }),
        new Paragraph({ text: "With a static camera, the interior scene remains warm and cozy with the candle flickering gently. Slowly and magically, a surreal double exposure effect begins to manifest. A ghostly, semi-transparent overlay of the torrential Ba Mountain rain and the solitary scholar's silhouette slowly fades into the physical space of the room. The cold blue rain appears to fall inside the warm room like a vivid memory projection. The two spatiotemporal layers coexist beautifully in an ethereal and melancholic dream." }),
      ],
    },
  ],
});

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync("AI视频生成方案_夜雨寄北.docx", buffer);
  console.log("Document updated successfully");
});

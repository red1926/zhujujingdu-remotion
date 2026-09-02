const fs = require("fs");
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
  ShadingType,
  convertInchesToTwip,
} = require("docx");

// Color Palette Constants
const COLOR_PRIMARY = "1D3557"; // Deep Navy
const COLOR_SECONDARY = "457B9D"; // Steel Blue
const COLOR_WARM = "D4A373"; // Warm Gold/Amber
const COLOR_BG_HEADER = "F1F5F9"; // Light Slate for table headers
const COLOR_BG_ZEBRA = "F8FAFC"; // Very Light for zebra rows
const COLOR_TEXT_DARK = "1E293B"; // Slate Dark Text
const COLOR_TEXT_MUTED = "64748B"; // Slate Muted Text
const COLOR_HIGHLIGHT = "E63946"; // Accent Red/Coral
const COLOR_ACCENT_BLUE = "2A6F97";
const COLOR_ACCENT_GOLD = "B45309";

const tableBorderConfig = {
  top: { style: BorderStyle.SINGLE, size: 4, color: "CBD5E1" },
  bottom: { style: BorderStyle.SINGLE, size: 4, color: "CBD5E1" },
  left: { style: BorderStyle.NONE, size: 0, color: "auto" },
  right: { style: BorderStyle.NONE, size: 0, color: "auto" },
  insideHorizontal: { style: BorderStyle.SINGLE, size: 2, color: "E2E8F0" },
  insideVertical: { style: BorderStyle.NONE, size: 0, color: "auto" },
};

function createHeading1(text) {
  return new Paragraph({
    text: text,
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 180 },
    run: {
      bold: true,
      color: COLOR_PRIMARY,
      size: 32, // 16pt
      font: "Microsoft YaHei",
    },
  });
}

function createHeading2(text) {
  return new Paragraph({
    text: text,
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 280, after: 140 },
    run: {
      bold: true,
      color: COLOR_SECONDARY,
      size: 26, // 13pt
      font: "Microsoft YaHei",
    },
  });
}

function createHeading3(text) {
  return new Paragraph({
    text: text,
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 200, after: 100 },
    run: {
      bold: true,
      color: COLOR_ACCENT_GOLD,
      size: 22, // 11pt
      font: "Microsoft YaHei",
    },
  });
}

function createBodyParagraph(text, options = {}) {
  return new Paragraph({
    spacing: { before: 60, after: 80, line: 280 },
    children: [
      new TextRun({
        text: text,
        size: 20, // 10pt
        color: options.color || COLOR_TEXT_DARK,
        bold: options.bold || false,
        font: "Microsoft YaHei",
      }),
    ],
  });
}

function createCalloutBox(title, lines, borderColor = COLOR_SECONDARY, bgColor = "F8FAFC") {
  const children = [
    new Paragraph({
      children: [
        new TextRun({
          text: `💡 ${title}`,
          bold: true,
          color: borderColor,
          size: 21,
          font: "Microsoft YaHei",
        }),
      ],
      spacing: { after: 80 },
    }),
  ];

  lines.forEach((line) => {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: line,
            size: 19,
            color: COLOR_TEXT_DARK,
            font: "Microsoft YaHei",
          }),
        ],
        spacing: { before: 40, after: 40, line: 260 },
      })
    );
  });

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.NONE, size: 0, color: "auto" },
      bottom: { style: BorderStyle.NONE, size: 0, color: "auto" },
      right: { style: BorderStyle.NONE, size: 0, color: "auto" },
      left: { style: BorderStyle.SINGLE, size: 24, color: borderColor },
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            children: children,
            shading: { type: ShadingType.CLEAR, fill: bgColor },
            margins: { top: 120, bottom: 120, left: 160, right: 160 },
          }),
        ],
      }),
    ],
  });
}

// Build the document
const doc = new Document({
  styles: {
    default: {
      document: {
        run: {
          font: "Microsoft YaHei",
          size: 20,
          color: COLOR_TEXT_DARK,
        },
      },
    },
  },
  sections: [
    {
      properties: {
        page: {
          margin: {
            top: convertInchesToTwip(0.8),
            bottom: convertInchesToTwip(0.8),
            left: convertInchesToTwip(0.8),
            right: convertInchesToTwip(0.8),
          },
        },
      },
      children: [
        // Title Header
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 200, after: 100 },
          children: [
            new TextRun({
              text: "《夜雨寄北》Remotion 逐句精读（第二部分）",
              size: 40, // 20pt
              bold: true,
              color: COLOR_PRIMARY,
              font: "Microsoft YaHei",
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 240 },
          children: [
            new TextRun({
              text: "分镜时长分布 · 诗句切换时码 · 美术层与时空分析参考手册",
              size: 24, // 12pt
              color: COLOR_SECONDARY,
              font: "Microsoft YaHei",
            }),
          ],
        }),

        createCalloutBox("核心技术参数速览", [
          "• 画布基准：1920 × 1080 (16:9 宽屏)，帧率 30 FPS (1 秒 = 30 帧)",
          "• 第二部分总时长：4:25.00 — 5:28.50 / 5:30.00（共 63.5 秒 / 1905 帧）",
          "• 核心定位：AI界面退场 ➔ 逐句精读（四句诗） ➔ 时空重影高潮（双坐标共振）",
          "• 动画架构：Layer 0 底层AI视频 ➔ Layer 1 动态色调滤镜 ➔ Layer 2 左侧无框星图 ➔ Layer 3 右侧58px书法精读卡",
        ]),

        new Paragraph({ spacing: { after: 150 } }),

        // SECTION 1
        createHeading1("一、 诗句切换关键时间节点速查表（什么时候跳到下一句）"),
        createBodyParagraph(
          "以下为 Remotion 第二部分（逐句精读）各句诗词精确的入场、停留与切换时刻。美术层、视频剪辑、配音轨道与动效均以此时间表为基准："
        ),

        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: tableBorderConfig,
          rows: [
            // Table Header
            new TableRow({
              tableHeader: true,
              children: [
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: "分镜序号", bold: true, color: COLOR_PRIMARY })] })],
                  shading: { type: ShadingType.CLEAR, fill: COLOR_BG_HEADER },
                  margins: { top: 100, bottom: 100, left: 100, right: 100 },
                  width: { size: 12, type: WidthType.PERCENTAGE },
                }),
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: "所分析诗句 / 阶段", bold: true, color: COLOR_PRIMARY })] })],
                  shading: { type: ShadingType.CLEAR, fill: COLOR_BG_HEADER },
                  margins: { top: 100, bottom: 100, left: 100, right: 100 },
                  width: { size: 28, type: WidthType.PERCENTAGE },
                }),
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: "全片绝对时间", bold: true, color: COLOR_PRIMARY })] })],
                  shading: { type: ShadingType.CLEAR, fill: COLOR_BG_HEADER },
                  margins: { top: 100, bottom: 100, left: 100, right: 100 },
                  width: { size: 18, type: WidthType.PERCENTAGE },
                }),
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: "Remotion相对时码", bold: true, color: COLOR_PRIMARY })] })],
                  shading: { type: ShadingType.CLEAR, fill: COLOR_BG_HEADER },
                  margins: { top: 100, bottom: 100, left: 100, right: 100 },
                  width: { size: 20, type: WidthType.PERCENTAGE },
                }),
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: "下一句切换时码 (Cut Point)", bold: true, color: COLOR_PRIMARY })] })],
                  shading: { type: ShadingType.CLEAR, fill: COLOR_BG_HEADER },
                  margins: { top: 100, bottom: 100, left: 100, right: 100 },
                  width: { size: 22, type: WidthType.PERCENTAGE },
                }),
              ],
            }),
            // Row 1: S8
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: "分镜 8", bold: true })] })],
                  margins: { top: 100, bottom: 100, left: 100, right: 100 },
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({ text: "【序幕】AI界面退场 · 回到诗境", bold: true }),
                        new TextRun({ text: "\n（四张AI卡依次淡出，建立坐标系）", size: 18, color: COLOR_TEXT_MUTED }),
                      ],
                    }),
                  ],
                  margins: { top: 100, bottom: 100, left: 100, right: 100 },
                }),
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: "04:25 — 04:35\n(共 10.0 秒)" })] })],
                  margins: { top: 100, bottom: 100, left: 100, right: 100 },
                }),
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: "00:00 — 00:10\n(0 ~ 300 帧)" })] })],
                  margins: { top: 100, bottom: 100, left: 100, right: 100 },
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({ text: "第 300 帧 / 00:10.00\n", bold: true, color: COLOR_ACCENT_BLUE }),
                        new TextRun({ text: "(切入第1句「君问」)", size: 18, color: COLOR_TEXT_MUTED }),
                      ],
                    }),
                  ],
                  margins: { top: 100, bottom: 100, left: 100, right: 100 },
                }),
              ],
            }),
            // Row 2: S9
            new TableRow({
              shading: { type: ShadingType.CLEAR, fill: COLOR_BG_ZEBRA },
              children: [
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: "分镜 9", bold: true })] })],
                  margins: { top: 100, bottom: 100, left: 100, right: 100 },
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({ text: "第一句：君问归期未有期", bold: true, color: COLOR_ACCENT_BLUE }),
                        new TextRun({ text: "\n（现实现在 · 孤寂沉郁 · 坐标+3,-2）", size: 18, color: COLOR_TEXT_MUTED }),
                      ],
                    }),
                  ],
                  margins: { top: 100, bottom: 100, left: 100, right: 100 },
                }),
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: "04:35 — 04:48\n(共 13.0 秒)" })] })],
                  margins: { top: 100, bottom: 100, left: 100, right: 100 },
                }),
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: "00:10 — 00:23\n(300 ~ 690 帧)" })] })],
                  margins: { top: 100, bottom: 100, left: 100, right: 100 },
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({ text: "第 690 帧 / 00:23.00\n", bold: true, color: COLOR_ACCENT_BLUE }),
                        new TextRun({ text: "(切入第2句「巴山」)", size: 18, color: COLOR_TEXT_MUTED }),
                      ],
                    }),
                  ],
                  margins: { top: 100, bottom: 100, left: 100, right: 100 },
                }),
              ],
            }),
            // Row 3: S10
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: "分镜 10", bold: true })] })],
                  margins: { top: 100, bottom: 100, left: 100, right: 100 },
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({ text: "第二句：巴山夜雨涨秋池", bold: true, color: COLOR_ACCENT_BLUE }),
                        new TextRun({ text: "\n（现实现在 · 夜雨涨池 · 坐标+4,-4）", size: 18, color: COLOR_TEXT_MUTED }),
                      ],
                    }),
                  ],
                  margins: { top: 100, bottom: 100, left: 100, right: 100 },
                }),
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: "04:48 — 05:01\n(共 13.0 秒)" })] })],
                  margins: { top: 100, bottom: 100, left: 100, right: 100 },
                }),
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: "00:23 — 00:36\n(690 ~ 1065 帧)" })] })],
                  margins: { top: 100, bottom: 100, left: 100, right: 100 },
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({ text: "第 1065 帧 / 00:35.50\n", bold: true, color: COLOR_ACCENT_GOLD }),
                        new TextRun({ text: "(切入第3句「何当」)", size: 18, color: COLOR_TEXT_MUTED }),
                      ],
                    }),
                  ],
                  margins: { top: 100, bottom: 100, left: 100, right: 100 },
                }),
              ],
            }),
            // Row 4: S11
            new TableRow({
              shading: { type: ShadingType.CLEAR, fill: COLOR_BG_ZEBRA },
              children: [
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: "分镜 11", bold: true })] })],
                  margins: { top: 100, bottom: 100, left: 100, right: 100 },
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({ text: "第三句：何当共剪西窗烛", bold: true, color: COLOR_ACCENT_GOLD }),
                        new TextRun({ text: "\n（想象将来 · 温暖期待 · 坐标-3,+3）", size: 18, color: COLOR_TEXT_MUTED }),
                      ],
                    }),
                  ],
                  margins: { top: 100, bottom: 100, left: 100, right: 100 },
                }),
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: "05:01 — 05:14\n(共 13.0 秒)" })] })],
                  margins: { top: 100, bottom: 100, left: 100, right: 100 },
                }),
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: "00:36 — 00:49\n(1065 ~ 1440 帧)" })] })],
                  margins: { top: 100, bottom: 100, left: 100, right: 100 },
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({ text: "第 1440 帧 / 00:48.00\n", bold: true, color: COLOR_HIGHLIGHT }),
                        new TextRun({ text: "(切入第4句「却话」)", size: 18, color: COLOR_TEXT_MUTED }),
                      ],
                    }),
                  ],
                  margins: { top: 100, bottom: 100, left: 100, right: 100 },
                }),
              ],
            }),
            // Row 5: S12
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: "分镜 12", bold: true })] })],
                  margins: { top: 100, bottom: 100, left: 100, right: 100 },
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({ text: "第四句：却话巴山夜雨时", bold: true, color: COLOR_HIGHLIGHT }),
                        new TextRun({ text: "\n【终极高潮·时空重影 双坐标共振】", size: 18, color: COLOR_HIGHLIGHT, bold: true }),
                      ],
                    }),
                  ],
                  margins: { top: 100, bottom: 100, left: 100, right: 100 },
                }),
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: "05:14 — 05:30\n(共 16.0 秒)" })] })],
                  margins: { top: 100, bottom: 100, left: 100, right: 100 },
                }),
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: "00:49 — 01:03.5\n(1440 ~ 1905 帧)" })] })],
                  margins: { top: 100, bottom: 100, left: 100, right: 100 },
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({ text: "第 1905 帧 / 01:03.50\n", bold: true, color: COLOR_PRIMARY }),
                        new TextRun({ text: "(切入第三部分 情感地图)", size: 18, color: COLOR_TEXT_MUTED }),
                      ],
                    }),
                  ],
                  margins: { top: 100, bottom: 100, left: 100, right: 100 },
                }),
              ],
            }),
          ],
        }),

        new Paragraph({ spacing: { after: 200 } }),

        // SECTION 2
        createHeading1("二、 各分镜详细分析时间段、诗句内涵与美术层对应要求"),

        // SHOT 8 DETAIL
        createHeading2("1. 分镜 8：AI界面退场 · 过渡至逐句精读（序幕）"),
        createBodyParagraph("• 【分析时间段】：全片 04:25 — 04:35 (Remotion 00:00 — 00:10 / 0 ~ 300 帧，共 10.0 秒 / 300 帧)"),
        createBodyParagraph("• 【所分析内容】：AI分析完成，收束面板，退回诗歌本位，建立四象限时空坐标系。"),
        createBodyParagraph("• 【旁白台词】：“AI完成了初步判断。现在，让我们回到诗本身，逐句看。”"),
        createBodyParagraph("• 【对应诗句】：无单句（展示序幕提示：“AI已退场 · 回到诗境”）"),
        createBodyParagraph("• 【美术与视觉层要求】：", { bold: true }),
        createBodyParagraph("   1) 底层视频：播放 s8-s9(2.0).mp4（巴山冷雨夜景，文人背影伫立水边，冷蓝墨色调）。"),
        createBodyParagraph("   2) 左侧区域：悬浮纯净无框四象限坐标系，网格线弱化至 0.09 透明度，坐标轴高对比度发光。"),
        createBodyParagraph("   3) 右侧区域：四张AI卡逐张平滑淡出，右侧居中展示“逐句精读序幕”书法卡片。"),

        // SHOT 9 DETAIL
        createHeading2("2. 分镜 9：第一句精读——「君问归期未有期」"),
        createBodyParagraph("• 【分析时间段】：全片 04:35 — 04:48 (Remotion 00:10 — 00:23 / 300 ~ 690 帧，共 13.0 秒 / 390 帧)"),
        createBodyParagraph("• 【分析核心诗句】：君问归期未有期", { bold: true, color: COLOR_ACCENT_BLUE }),
        createBodyParagraph("• 【时空属性与坐标】：现实现在 · 孤寂沉郁 | 坐标 (+3, -2)，情感值 -2"),
        createBodyParagraph("• 【旁白台词】：“君问归期未有期。人在巴山，收到来自北方的问讯。归期未定，这是此刻的现实。”"),
        createBodyParagraph("• 【美术与视觉层要求】：", { bold: true }),
        createBodyParagraph("   1) 底层视频：无缝延续 s8-s9(2.0).mp4（巴山秋池细雨微澜，山色空濛）。"),
        createBodyParagraph("   2) 左侧坐标系：点 ① (+3, -2) 绽放蓝色星芒光晕（#3a86ff），呼吸闪烁，并带有「① 现实现在 · -2」标签。"),
        createBodyParagraph("   3) 右侧精读卡：右上 58px 楷体大字「君问归期未有期」，左侧冷蓝色边框，副文案阐释归期未定的现实无奈。"),

        // SHOT 10 DETAIL
        createHeading2("3. 分镜 10：第二句精读——「巴山夜雨涨秋池」"),
        createBodyParagraph("• 【分析时间段】：全片 04:48 — 05:01 (Remotion 00:23 — 00:36 / 690 ~ 1065 帧，共 13.0 秒 / 375~390 帧)"),
        createBodyParagraph("• 【分析核心诗句】：巴山夜雨涨秋池", { bold: true, color: COLOR_ACCENT_BLUE }),
        createBodyParagraph("• 【时空属性与坐标】：现实现在 · 夜雨涨池 | 坐标 (+4, -4)，情感值 -4（情感进一步下沉探底）"),
        createBodyParagraph("• 【旁白台词】：“巴山夜雨涨秋池。雨势渐大，秋池上涨，孤独也随着夜雨加深。”"),
        createBodyParagraph("• 【美术与视觉层要求】：", { bold: true }),
        createBodyParagraph("   1) 底层视频：在 675 帧处（分镜切换前15帧）平滑 Crossfade 转入 s10.mp4（暴雨倾盆、水面上涨、涟漪激荡）。"),
        createBodyParagraph("   2) 左侧坐标系：点 ② (+4, -4) 亮起深蓝光晕（#1d3557），与点 ① 同步常驻，形成现实时空轨迹。"),
        createBodyParagraph("   3) 右侧精读卡：右上大字切换为「巴山夜雨涨秋池」，冷色调深蓝光效，强调孤独与环境雨势的共鸣。"),

        // SHOT 11 DETAIL
        createHeading2("4. 分镜 11：第三句精读——「何当共剪西窗烛」（核心时空大转折）"),
        createBodyParagraph("• 【分析时间段】：全片 05:01 — 05:14 (Remotion 00:36 — 00:49 / 1065 ~ 1440 帧，共 13.0 秒 / 375~390 帧)"),
        createBodyParagraph("• 【分析核心诗句】：何当共剪西窗烛", { bold: true, color: COLOR_ACCENT_GOLD }),
        createBodyParagraph("• 【时空属性与坐标】：想象将来 · 温暖期待 | 坐标 (-3, +3)，情感值 +3（空间转入西窗，时间转入未来）"),
        createBodyParagraph("• 【旁白台词】：“何当共剪西窗烛。画面从巴山转向西窗，从此刻转向将来。”"),
        createBodyParagraph("• 【美术与视觉层要求】：", { bold: true }),
        createBodyParagraph("   1) 底层视频（运镜转场）：在 1050 帧处平滑接入 s11(2.0).mp4。前5秒镜头急速穿越雨幕直冲窗棂，5秒后穿入室内，定格为暖金双人剪烛静美画面。"),
        createBodyParagraph("   2) 蒙版与滤镜：全屏色调在 130~150 帧（4.3~5.0秒）间从冷青蓝（#0a0f18）动态插值渐变为暖琥珀金（#180f05）。"),
        createBodyParagraph("   3) 左侧坐标系：点 ③ (-3, +3) 在左上方亮起暖金星芒（#ff9f1c），与右下方的 ①、② 形成鲜明冷暖对角反差。"),
        createBodyParagraph("   4) 右侧精读卡：边框与字体全面转为暖金色（#ffb703 / #ffeaa7），大字「何当共剪西窗烛」散发烛火微光。"),

        // SHOT 12 DETAIL
        createHeading2("5. 分镜 12：第四句精读——「却话巴山夜雨时」【终极高潮·时空重影】"),
        createBodyParagraph("• 【分析时间段】：全片 05:14 — 05:30 (Remotion 00:49 — 01:03.5 / 1440 ~ 1905 帧，共 16.0 秒 / 465~480 帧)"),
        createBodyParagraph("• 【分析核心诗句】：却话巴山夜雨时", { bold: true, color: COLOR_HIGHLIGHT }),
        createBodyParagraph("• 【时空属性与坐标】：时空重影结构 · 双重坐标共振（场景坐标：西窗·将来 -3,+2 ； 话题坐标：巴山·此刻 +4,-4）"),
        createBodyParagraph("• 【旁白台词】：“却话巴山夜雨时。西窗仍然在，但巴山的雨从烛光里浮现了——将来的人，在回忆此刻的夜雨。这个点，标不准。”"),
        createBodyParagraph("• 【分镜内核心时间节奏微调】（重要）：", { bold: true }),
        createBodyParagraph("   - 0.0s — 2.0s (第 1440 ~ 1500 帧)：西窗暖室，单点展示，诗句渐入。"),
        createBodyParagraph("   - 2.0s — 16.0s (第 1500 ~ 1905 帧)：时空重影爆发！双坐标同时显现，两点间拉起深琥珀虚线（#fb8500）呼吸共振，上方悬浮金色标识「◎ 时空重影结构 · 双重坐标共振」。"),
        createBodyParagraph("• 【美术与视觉层要求】：", { bold: true }),
        createBodyParagraph("   1) 底层视频（双重曝光）：主层使用 s12.mp4（西窗剪烛），叠加层以 Screen 滤色模式半透明叠加 s8-s9 的冷蓝雨夜文人影，实现“烛光中浮现夜雨”的梦幻诗意感。"),
        createBodyParagraph("   2) 左右对称布局：左侧坐标系双点连线呼吸闪烁；右侧卡片高亮显示“一个点容纳不了两层时空”，半暖半冷色彩交融。"),

        new Paragraph({ spacing: { after: 200 } }),

        // SECTION 3
        createHeading1("三、 视频素材与转场重映射（Remotion Base Video Mapping）对照"),
        createBodyParagraph(
          "第二部分包含 4 段底层 AI 生成的高清视频素材。为了保证画面极致平滑、不出现卡顿与硬切，Remotion 代码中采用了交叉淡入淡出（Crossfade）与时间重映射（Time-Remap）策略："
        ),

        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: tableBorderConfig,
          rows: [
            new TableRow({
              tableHeader: true,
              children: [
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: "视频素材文件", bold: true, color: COLOR_PRIMARY })] })],
                  shading: { type: ShadingType.CLEAR, fill: COLOR_BG_HEADER },
                  margins: { top: 100, bottom: 100, left: 100, right: 100 },
                  width: { size: 22, type: WidthType.PERCENTAGE },
                }),
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: "覆盖分镜", bold: true, color: COLOR_PRIMARY })] })],
                  shading: { type: ShadingType.CLEAR, fill: COLOR_BG_HEADER },
                  margins: { top: 100, bottom: 100, left: 100, right: 100 },
                  width: { size: 16, type: WidthType.PERCENTAGE },
                }),
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: "Remotion帧区间 (Overlap)", bold: true, color: COLOR_PRIMARY })] })],
                  shading: { type: ShadingType.CLEAR, fill: COLOR_BG_HEADER },
                  margins: { top: 100, bottom: 100, left: 100, right: 100 },
                  width: { size: 28, type: WidthType.PERCENTAGE },
                }),
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: "播放与运镜模式 (Remap Mode)", bold: true, color: COLOR_PRIMARY })] })],
                  shading: { type: ShadingType.CLEAR, fill: COLOR_BG_HEADER },
                  margins: { top: 100, bottom: 100, left: 100, right: 100 },
                  width: { size: 34, type: WidthType.PERCENTAGE },
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: "s8-s9(2.0).mp4", bold: true })] })],
                  margins: { top: 100, bottom: 100, left: 100, right: 100 },
                }),
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: "分镜 8 ~ 9" })] })],
                  margins: { top: 100, bottom: 100, left: 100, right: 100 },
                }),
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: "0 ~ 690 帧\n(00:00 — 00:23)" })] })],
                  margins: { top: 100, bottom: 100, left: 100, right: 100 },
                }),
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: "crossfade-loop-2x (无缝循环无损淡入)" })] })],
                  margins: { top: 100, bottom: 100, left: 100, right: 100 },
                }),
              ],
            }),
            new TableRow({
              shading: { type: ShadingType.CLEAR, fill: COLOR_BG_ZEBRA },
              children: [
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: "s10.mp4", bold: true })] })],
                  margins: { top: 100, bottom: 100, left: 100, right: 100 },
                }),
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: "分镜 10" })] })],
                  margins: { top: 100, bottom: 100, left: 100, right: 100 },
                }),
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: "675 ~ 1065 帧\n(提前 15 帧淡入)" })] })],
                  margins: { top: 100, bottom: 100, left: 100, right: 100 },
                }),
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: "custom-rate (匀速微调匹配 13 秒)" })] })],
                  margins: { top: 100, bottom: 100, left: 100, right: 100 },
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: "s11(2.0).mp4", bold: true })] })],
                  margins: { top: 100, bottom: 100, left: 100, right: 100 },
                }),
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: "分镜 11" })] })],
                  margins: { top: 100, bottom: 100, left: 100, right: 100 },
                }),
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: "1050 ~ 1440 帧\n(提前 15 帧淡入)" })] })],
                  margins: { top: 100, bottom: 100, left: 100, right: 100 },
                }),
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: "time-remap-s11 (前5s急速穿梭，后8s定格剪烛)" })] })],
                  margins: { top: 100, bottom: 100, left: 100, right: 100 },
                }),
              ],
            }),
            new TableRow({
              shading: { type: ShadingType.CLEAR, fill: COLOR_BG_ZEBRA },
              children: [
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: "s12.mp4", bold: true })] })],
                  margins: { top: 100, bottom: 100, left: 100, right: 100 },
                }),
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: "分镜 12" })] })],
                  margins: { top: 100, bottom: 100, left: 100, right: 100 },
                }),
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: "1425 ~ 1905 帧\n(提前 15 帧淡入)" })] })],
                  margins: { top: 100, bottom: 100, left: 100, right: 100 },
                }),
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: "custom-rate + 双曝光叠加 s8-s9 冷雨记忆" })] })],
                  margins: { top: 100, bottom: 100, left: 100, right: 100 },
                }),
              ],
            }),
          ],
        }),

        new Paragraph({ spacing: { after: 250 } }),

        // SECTION 4
        createHeading1("四、 美术层优化建议与关键视觉 Checklist"),
        createBodyParagraph("1. 【冷暖色温转换】：分镜 8~10 为冷暗水墨雨夜（#06090e / #1d3557）；分镜 11 在 5 秒时平滑转为暖金烛光（#ffb703 / #fb8500）；分镜 12 达到冷暖交融时空重影。"),
        createBodyParagraph("2. 【文字排版一致性】：右上角精读诗句字号统一为 58px 楷体（加大可读性），字间距 letter-spacing 设为 6px，背景卡片采用毛玻璃滤镜（backdrop-filter: blur(12px)）。"),
        createBodyParagraph("3. 【星图光点轨迹】：左侧坐标系保持纯净无边框，光点尺寸统一为 18~22px，并带有外层 40px 半透明呼吸光晕，确保与右侧卡片在视觉重量上完美平衡。"),
        createBodyParagraph("4. 【第12镜高潮动效】：在 1500 帧（分镜第 2 秒）触发双坐标虚线共振，虚线描边宽度 2.5px，配合深琥珀色流光，直观呈现“时空折叠”核心教学概念。"),
      ],
    },
  ],
});

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync("夜雨寄北_第二部分Remotion分镜时长与诗句分析表.docx", buffer);
  console.log("Document generated successfully: 夜雨寄北_第二部分Remotion分镜时长与诗句分析表.docx");
});

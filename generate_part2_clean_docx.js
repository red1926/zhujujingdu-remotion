const fs = require("fs");
const { Document, Packer, Paragraph, TextRun, HeadingLevel } = require("docx");

function createTitle(text) {
  return new Paragraph({
    heading: HeadingLevel.TITLE,
    spacing: { before: 200, after: 150 },
    children: [
      new TextRun({
        text: text,
        bold: true,
        size: 32,
      }),
    ],
  });
}

function createSubtitle(text) {
  return new Paragraph({
    spacing: { before: 0, after: 250 },
    children: [
      new TextRun({
        text: text,
        size: 20,
        color: "666666",
      }),
    ],
  });
}

function createH1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 300, after: 120 },
    children: [
      new TextRun({
        text: text,
        bold: true,
        size: 26,
        color: "1D3557",
      }),
    ],
  });
}

function createH2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 220, after: 80 },
    children: [
      new TextRun({
        text: text,
        bold: true,
        size: 22,
        color: "457B9D",
      }),
    ],
  });
}

function createBullet(label, content, boldLabel = true) {
  return new Paragraph({
    spacing: { before: 50, after: 50 },
    children: [
      new TextRun({
        text: `• ${label}：`,
        bold: boldLabel,
        color: "1E293B",
      }),
      new TextRun({
        text: content,
        color: "333333",
      }),
    ],
  });
}

function createNumberedHeader(numStr, title) {
  return new Paragraph({
    spacing: { before: 140, after: 50 },
    children: [
      new TextRun({
        text: `${numStr} ${title}`,
        bold: true,
        color: "1D3557",
        size: 21,
      }),
    ],
  });
}

function createSubBullet(label, content) {
  return new Paragraph({
    spacing: { before: 30, after: 30 },
    indent: { left: 400 },
    children: [
      new TextRun({
        text: `▪ ${label}：`,
        bold: true,
        color: "475569",
      }),
      new TextRun({
        text: content,
        color: "333333",
      }),
    ],
  });
}

const doc = new Document({
  sections: [
    {
      properties: {},
      children: [
        createTitle("《夜雨寄北》Remotion第二部分（逐句精读）分镜时长与诗句分析表"),
        createSubtitle("工程参数：30 FPS (1秒 = 30帧) | 第二部分总时长：4:25 - 5:30 (共 63.5秒 / 1905帧)"),

        createH1("一、 诗句切换关键时间节点速查（什么时候跳到下一句）"),

        createNumberedHeader("1.", "序幕 ➔ 第一句「君问归期未有期」切换点"),
        createSubBullet("全片绝对时码", "04:35.00"),
        createSubBullet("Remotion相对时码", "00:10.00 (第 300 帧)"),
        createSubBullet("画面切换动作", "AI卡片淡出，左侧星图点①发天蓝光，右上角滑入第一句书法大字。"),

        createNumberedHeader("2.", "第一句 ➔ 第二句「巴山夜雨涨秋池」切换点"),
        createSubBullet("全片绝对时码", "04:48.00"),
        createSubBullet("Remotion相对时码", "00:23.00 (第 690 帧)"),
        createSubBullet("画面切换动作", "背景视频转为暴雨涨池(s10.mp4)，星图新增点②深蓝光，右上角切换第二句大字。"),

        createNumberedHeader("3.", "第二句 ➔ 第三句「何当共剪西窗烛」切换点"),
        createSubBullet("全片绝对时码", "05:01.00"),
        createSubBullet("Remotion相对时码", "00:36.00 (第 1065 帧，背景视频在 1050 帧预入)"),
        createSubBullet("画面切换动作", "核心转场！镜头极速冲破雨幕进入西窗室内，全屏转为暖金烛光，星图点③亮起。"),

        createNumberedHeader("4.", "第三句 ➔ 第四句「却话巴山夜雨时」切换点"),
        createSubBullet("全片绝对时码", "05:14.00"),
        createSubBullet("Remotion相对时码", "00:49.00 (第 1440 帧，背景视频在 1425 帧预入)"),
        createSubBullet("画面切换动作", "进入时空重影核心高潮，西窗室内与巴山夜雨双重曝光。"),

        createNumberedHeader("5.", "第四句内部【时空重影爆发】节点 (极重要)"),
        createSubBullet("全片绝对时码", "05:16.00"),
        createSubBullet("Remotion相对时码", "00:51.00 (第 1500 帧 / S12 第 60 帧)"),
        createSubBullet("画面切换动作", "星图上“西窗将来(-3,+2)”与“巴山此刻(+4,-4)”双重坐标同时共振，深琥珀虚线相连，浮现◎时空重影。"),

        createNumberedHeader("6.", "第二部分 ➔ 第三部分（完整情感地图）切换点"),
        createSubBullet("全片绝对时码", "05:30.00"),
        createSubBullet("Remotion相对时码", "01:03.50 (第 1905 帧)"),
        createSubBullet("画面切换动作", "平滑过渡至 Part 3 情感地图全景水墨画卷。"),

        createH1("二、 各分镜准确时长与诗句分析详细区间"),

        createH2("【分镜 8】AI界面退场 · 过渡至逐句精读 (序幕)"),
        createBullet("准确时间区间", "全片 04:25 — 04:35 (Remotion 00:00 — 00:10 / 0 ~ 300 帧，时长 10.0 秒 / 300 帧)"),
        createBullet("所分析诗句", "无单句 (AI退场序幕，建立坐标星图)"),
        createBullet("对应旁白", "“AI完成了初步判断。现在，让我们回到诗本身，逐句看。”"),
        createBullet("美术层核心", "底层视频播放 s8-s9(2.0).mp4 (巴山冷雨、文人背影)，左侧坐标轴亮起，四张AI卡逐张淡出。"),

        createH2("【分镜 9】逐句精读——第一句「君问归期未有期」"),
        createBullet("准确时间区间", "全片 04:35 — 04:48 (Remotion 00:10 — 00:23 / 300 ~ 690 帧，时长 13.0 秒 / 390 帧)"),
        createBullet("所分析诗句", "「君问归期未有期」"),
        createBullet("时空与情感", "现实现在 · 孤寂沉郁 | 坐标 (+3, -2)，情感值 -2"),
        createBullet("对应旁白", "“君问归期未有期。人在巴山，收到来自北方的问讯。归期未定，这是此刻的现实。”"),
        createBullet("美术层核心", "延续 s8-s9 细雨背景，左侧星图点①发天蓝光(#3a86ff)，右上角浮现 58px 楷体大字卡片。"),

        createH2("【分镜 10】逐句精读——第二句「巴山夜雨涨秋池」"),
        createBullet("准确时间区间", "全片 04:48 — 05:01 (Remotion 00:23 — 00:36 / 690 ~ 1065 帧，时长 13.0 秒 / 375~390 帧)"),
        createBullet("所分析诗句", "「巴山夜雨涨秋池」"),
        createBullet("时空与情感", "现实现在 · 夜雨涨池 | 坐标 (+4, -4)，情感值 -4 (下沉探底)"),
        createBullet("对应旁白", "“巴山夜雨涨秋池。雨势渐大，秋池上涨，孤独也随着夜雨加深。”"),
        createBullet("美术层核心", "视频在 675 帧淡入 s10.mp4 (暴雨倾盆、池水上涨)，左侧星图点②发深蓝光(#1d3557)。"),

        createH2("【分镜 11】逐句精读——第三句「何当共剪西窗烛」"),
        createBullet("准确时间区间", "全片 05:01 — 05:14 (Remotion 00:36 — 00:49 / 1065 ~ 1440 帧，时长 13.0 秒 / 375~390 帧)"),
        createBullet("所分析诗句", "「何当共剪西窗烛」(核心时空大转折)"),
        createBullet("时空与情感", "想象将来 · 温暖期待 | 坐标 (-3, +3)，情感值 +3"),
        createBullet("对应旁白", "“何当共剪西窗烛。画面从巴山转向西窗，从此刻转向将来。”"),
        createBullet("美术层核心", "视频在 1050 帧接入 s11(2.0).mp4 (前5秒穿破雨幕，后8秒定格西窗室内)；全屏滤镜在 130~150 帧由冷蓝转暖金(#ffb703)，左侧点③发暖橙光(#ff9f1c)。"),

        createH2("【分镜 12】逐句精读——第四句「却话巴山夜雨时」【时空重影高潮】"),
        createBullet("准确时间区间", "全片 05:14 — 05:30 (Remotion 00:49 — 01:03.5 / 1440 ~ 1905 帧，时长 16.0 秒 / 465~480 帧)"),
        createBullet("所分析诗句", "「却话巴山夜雨时」"),
        createBullet("时空与情感", "时空重影结构 · 双重坐标 (场景: 西窗·将来 -3,+2 ； 话题: 巴山·此刻 +4,-4)"),
        createBullet("对应旁白", "“却话巴山夜雨时。西窗仍然在，但巴山的雨从烛光里浮现了——将来的人，在回忆此刻的夜雨。这个点，标不准。”"),
        createBullet("美术层核心", "双重曝光画面 (暖金西窗室内 + 冷蓝巴山雨夜半透明叠加)；第 1500 帧 (05:16) 双坐标共振连线，浮现◎时空重影。"),

        createH1("三、 底层视频素材与转场时间重映射对照"),

        createNumberedHeader("1.", "s8-s9(2.0).mp4 (分镜 8 ~ 9)"),
        createSubBullet("覆盖时段", "0 ~ 690 帧 (00:00 — 00:23 / 全片 04:25 — 04:48)"),
        createSubBullet("播放模式", "crossfade-loop-2x 无缝循环播放"),
        createSubBullet("视觉画面", "冷青蓝巴山雨夜、秋池水波微澜、文人孤寂背影"),

        createNumberedHeader("2.", "s10.mp4 (分镜 10)"),
        createSubBullet("覆盖时段", "675 ~ 1065 帧 (提前 15 帧在 675 帧开始淡入)"),
        createSubBullet("播放模式", "custom-rate 匀速匹配 13 秒"),
        createSubBullet("视觉画面", "暴雨激荡、秋池水位上涨、氛围压抑加深"),

        createNumberedHeader("3.", "s11(2.0).mp4 (分镜 11)"),
        createSubBullet("覆盖时段", "1050 ~ 1440 帧 (提前 15 帧在 1050 帧开始淡入)"),
        createSubBullet("播放模式", "time-remap-s11 (前 150 帧极速推镜穿破雨幕，后 240 帧定格室内剪烛)"),
        createSubBullet("视觉画面", "穿入暖金西窗室内、双人剪烛剪影、色调全面转暖"),

        createNumberedHeader("4.", "s12.mp4 (分镜 12)"),
        createSubBullet("覆盖时段", "1425 ~ 1905 帧 (提前 15 帧在 1425 帧开始淡入)"),
        createSubBullet("播放模式", "主层 s12.mp4 + 滤色模式叠加 s8-s9 冷雨记忆层"),
        createSubBullet("视觉画面", "双重曝光梦幻诗意感，冷暖交织"),
      ],
    },
  ],
});

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync("夜雨寄北_第二部分Remotion分镜时长与诗句分析表.docx", buffer);
  console.log("Clean single-line paragraph docx generated successfully without \\n overlaps!");
});

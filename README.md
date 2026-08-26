# 📜 《夜雨寄北》诗歌时空折叠教学视频 · Remotion 工程

> 基于 Remotion 4.0 + React 18 + TypeScript 开发的《夜雨寄北》（李商隐）时空折叠结构可视化微课动画与教学视频。

---

## 🌟 项目亮点

- **坐标星图与诗意融合**：无框悬浮时空坐标系、四色星芒光点与书法大字联动
- **时空重影视觉呈现**：第 12 镜「西窗将来 ↔ 巴山此刻」双重坐标叠加与折叠交错
- **诗意全景地图**：坐标网格平滑流转为金青水墨叶脉，竖排全诗题词与朱红印章升华
- **Antigravity AI 协同**：内置 `.agents` 专属古诗词 AI 视觉艺术指令集与 Remotion 技能库

---

## 🚀 新电脑快速上手

在新电脑上克隆本项目后，按以下步骤运行：

### 1. 安装依赖
```bash
npm install
```

### 2. 启动 Remotion Studio 实时预览
```bash
npm run preview
# 或
npm run dev
```
打开浏览器访问：`http://localhost:3000`

### 3. 渲染导出视频 (MP4)
```bash
# 渲染完整视频 (Part 2 + Part 3)
npm run build

# 或单独渲染某个分段
npx remotion render src/index.ts Part2-DetailedReading out/part2.mp4
npx remotion render src/index.ts Part3-PoeticMap out/part3.mp4
```

---

## 📁 目录结构

```
.
├── .agents/                 # Antigravity IDE 技能库与视觉设定规则
├── public/
│   └── assets/              # 视频背景片段与素材
├── src/
│   ├── components/          # 核心 UI 与动画组件（坐标系、书法字、全景地图等）
│   ├── compositions/        # Remotion 视频分段与合成工程
│   ├── data/                # 分镜台词、时间戳与主题常量
│   ├── types/               # TypeScript 类型定义
│   ├── Root.tsx             # Remotion Composition 根配置
│   └── index.ts             # 入口文件
├── GEMINI_IMAGE_PROMPTS.md  # AI 视觉生成提示词
├── PROJECT_HANDOFF.md       # 项目详细架构与分镜备忘
└── remotion.config.ts       # Remotion 配置文件
```

# NeuralCore AI Portal - UI 还原设计规格

**日期：** 2026/05/14  
**状态：** 待用户确认

---

## 1. 项目概述

- **项目名称：** NeuralCore AI Portal（企业 AI 门户）
- **项目类型：** 企业内部 AI 工具导航与对话平台
- **核心功能：** AI 工具导航、对话式 AI 助手、今日资讯、身份认证
- **目标用户：** 企业内部员工（策划、研发、美术等）

---

## 2. 设计语言

### 色彩系统
| Token | 色值 | 用途 |
|-------|------|------|
| primary | `#3525cd` | 主操作按钮、强调 |
| surface | `#f8f9ff` | 页面背景 |
| surface-container-lowest | `#ffffff` | 卡片背景 |
| surface-container-low | `#eff4ff` | 悬浮元素背景 |
| surface-container | `#e5eeff` | 次级容器 |
| on-surface | `#0b1c30` | 主文本 |
| on-surface-variant | `#464555` | 次级文本 |
| outline | `#777587` | 边框 |
| tertiary (emerald) | `#005338` | 成功/状态 |
| error | `#ba1a1a` | 错误 |

### 字体
- **主字体：** Inter
- **Heading：** 700 weight, -0.02em letter-spacing
- **Body：** 16px, 400 weight
- **Label：** 14px, 600 weight

### 圆角系统
- **组件级（按钮/输入框）：** `rounded-lg` (8px)
- **容器级（卡片/面板）：** `rounded-2xl` (24px)

### 阴影层级
- **Level 1（卡片）：** `0 4px 20px rgba(15,23,42,0.05)` + 1px border at 10% opacity
- **Level 2（玻璃面板）：** backdrop-blur-12px + rgba(255,255,255,0.8)
- **Level 3（交互高亮）：** 带 primary 色调的更强阴影

---

## 3. 页面结构

```
├── Header (fixed, glass effect)
│   ├── Logo: NeuralCore AI
│   ├── Model Pills: GPT-4o / Gemini 1.5 / Claude 3.5 / Llama 3
│   ├── Search Bar (全宽最大640px)
│   └── Account Status (登录状态 + 通知图标)
│
├── Main Content (mt-28, max-w-container-max)
│   ├── Hero Section (grid, 10 columns / 60:40 split)
│   │   ├── AI Chat Card (col-span-6)
│   │   │   ├── Card Header (标题 + "需要登录" badge)
│   │   │   ├── Cat Assistant Panel (玻璃风格猫咪形象)
│   │   │   └── Chat Window (消息流 + 快捷建议 + 输入框)
│   │   │
│   │   └── News Card (col-span-4)
│   │       ├── Card Header (标题 + 全部资讯链接)
│   │       ├── Fixed News (3条HOT/TOOL)
│   │       └── Rolling News (自动滚动6条)
│   │
│   └── Tools Navigation Grid
│       ├── Third Party (外部账号)
│       ├── Second Party (公司账号)
│       └── First Party (自建工具)
│
├── Login Modal (fixed, centered)
│   ├── Backdrop (blur + 40% opacity)
│   └── Modal Card (max-w-md)
│
└── Footer
    ├── Brand + Copyright
    └── Links: Documentation / Status / Security / Contact
```

---

## 4. 组件清单

### Header
- **Logo** - 品牌名称，点击回首页
- **Model Pills** - 模型快捷切换按钮（GPT-4o 等）
- **Search Bar** - 全宽搜索框，带 Material Symbols 图标
- **Account Status** - 登录后显示用户名/部门/Token
- **Notification Icon** - 通知图标

### AI Chat Card
- **Card Header** - 标题"对话交互 AI" + "需要登录"徽章
- **Cat Assistant Panel** - 猫咪形象玻璃面板（需替换 emoji 为 SVG/Lucide）
- **Chat Window**
  - 消息气泡（AI 助手 + 用户）
  - 快捷建议按钮（3个 pill 按钮）
  - 输入框 + 发送按钮
- **States:** 未登录 / 已登录

### News Card
- **Card Header** + "全部资讯"链接
- **Fixed News Items** (3条静态)
- **Rolling News Track** (6条，自动滚动，hover 暂停)
- **Badge Types:** HOT(红) / TOOL(绿) / CASE(蓝) / MODL(灰)

### Tool Cards
- **分类标题** (带 Material Symbols 图标)
- **Tool Item:**
  - 标题 + 状态徽章（直接访问/需要登录/司内环境）
  - 描述文本
  - Hover 效果（阴影加深 + primary 边框）
- **Protected State:** 未登录时点击弹出登录模态框

### Login Modal
- **Icon** - lock_person
- **Title** - "需要身份认证"
- **Description** - 说明文本
- **Buttons:** 模拟企业登录 / 暂不登录

### Footer
- **Brand** - NeuralCore AI Portal + ©
- **Links** - 4个链接

---

## 5. 技术栈

| 类别 | 选择 |
|------|------|
| 框架 | Next.js 14+ (App Router) + TypeScript |
| 样式 | Tailwind CSS |
| UI 组件库 | Aceternity UI |
| 图标 | Lucide React |
| 字体 | Inter (Google Fonts) |

---

## 6. 实现约束

### Must Do
1. **纯净前端工程化** - 仅还原 UI，不改页面结构层级
2. **占位不写逻辑** - 交互/状态管理仅做 `onClick={() => {}}` + `// TODO` 注释
3. **去 emoji** - 猫咪形象用 Lucide Icon 或 SVG 替代

### Will Not Do（用户后续自行实现）
- 真实登录逻辑
- API 调用
- 状态管理（除 UI 状态如 modal toggle）
- 滚动新闻的数据获取
- 搜索功能

---

## 7. 待确认项

- [ ] UI 组件库：Aceternity UI
- [ ] 图标库：Lucide React
- [ ] 是否需要暗色模式支持？
- [ ] 响应式断点是否有特殊要求？
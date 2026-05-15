# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Next.js 14 + React + TypeScript 企业 AI 门户（`neuralcore-ai-portal`），包含两个独立子项目：
- **主站** (`app/`, `components/`) — Next.js App Router 前端
- **minimax-cli** (`minimax-cli/`) — Bun-native CLI 工具，独立构建测试

## Common Commands

```bash
# 主站
npm run dev      # 开发服务器 (http://localhost:3000)
npm run build    # 生产构建
npm run start    # 生产服务器
npm run lint     # ESLint 检查
npm run lint -- --fix  # ESLint 检查并自动修复

# minimax-cli
cd minimax-cli && bun run build   # 构建
cd minimax-cli && bun run dev     # 开发模式
cd minimax-cli && bun test        # 测试
```

## Architecture

```
app/                    # Next.js App Router
  layout.tsx            # Root layout（含全局 providers）
  page.tsx              # 首页（状态提升点：isLoggedIn, showLoginModal）
  globals.css           # 全局样式 + CSS 变量

components/             # UI 组件（独立无状态，props 驱动）
  Header.tsx            # 导航栏（接收 isLoggedIn, onAuthClick）
  HeroSection.tsx       # Hero 区（60/40 网格布局）
  NewsCard.tsx          # AI 资讯卡片（含滚动动画）
  ToolsGrid.tsx         # 工具导航网格（三大分类）
  AIChatCard.tsx        # 聊天助手（对话式 AI，支持快捷指令）
  LoginModal.tsx        # 登录弹窗

config/
  design-tokens.ts      # 设计令牌（颜色、间距、圆角、阴影）

app/api/neko/          # AI 对话 API（Agent Loop 架构）
  route.ts             # Think + Execute 循环，支持 Tool Calls

.env.local             # 环境变量（复制自 .env.local.example）

design/
  DESIGN.md             # 设计规范（反主流美学规则）
```

## State Management

登录状态在 `app/page.tsx` 统一管理，通过 props 传递：
- `Header` 接收 `isLoggedIn`, `onAuthClick`
- `LoginModal` 接收 `isOpen`, `onClose`, `onLogin`

## Neko AI 聊天后端

`app/api/neko/route.ts` 实现：
- DeepSeek API + OpenAI SDK（支持 DeepSeek 等兼容 API）
- **Agent Loop 架构**：模型思考（Think）→ 调用工具（Execute）→ 返回结果，循环直到模型返回最终回复或达到最大步数限制
- 支持 Tool Calls（工具推荐、使用指引、闲聊等）
- 需配置 `.env.local`：复制 `.env.local.example` 填入 `DEEPSEEK_API_KEY`

## Design Rules (AGENTS.md)

**禁止项**：紫色渐变、纯平背景、Hero+三卡片布局、Shadcn/Material UI 默认组件

**必须项**：
- 背景需噪点纹理或渐变
- 口语化文案（每句 ≤15 字）
- 图标用 Iconify，图片用 Picsum Photos
- 禁用 `ease-in-out` 线性动画

## minimax-cli 子项目

位于 `minimax-cli/`：
- ESM 模块，Bun native
- 自定义错误层级 `src/errors/`
- Zod 验证输入/输出
- 独立 AGENTS.md 规范
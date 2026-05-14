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
  LoginModal.tsx        # 登录弹窗

config/
  design-tokens.ts      # 设计令牌（颜色、间距、圆角、阴影）

design/
  DESIGN.md             # 设计规范（反主流美学规则）
```

## State Management

登录状态在 `app/page.tsx` 统一管理，通过 props 传递：
- `Header` 接收 `isLoggedIn`, `onAuthClick`
- `LoginModal` 接收 `isOpen`, `onClose`, `onLogin`

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
- Zod 配置验证
- 独立 AGENTS.md 规范
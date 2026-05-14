# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 14 + React + TypeScript web portal (`neuralcore-ai-portal`). Frontend uses Tailwind CSS with a custom design system.

## Common Commands

```bash
# Frontend (root)
npm run dev      # Start development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Lint with Next.js

# minimax-cli subproject (inside minimax-cli/)
cd minimax-cli
bun run build    # Build for production
bun run dev      # Development mode
bun run typecheck
bun test         # Run tests
```

## Architecture

```
app/                    # Next.js App Router pages
  layout.tsx            # Root layout
  page.tsx              # Home page
  globals.css           # Global styles

components/             # React components (Header, Footer, HeroSection, ToolsGrid, etc.)
  Header.tsx
  Footer.tsx
  HeroSection.tsx
  ToolsGrid.tsx
  NewsCard.tsx
  AIChatCard.tsx
  AIModelPill.tsx
  LoginModal.tsx

config/
  design-tokens.ts      # Design tokens (colors, spacing, shadows, borderRadius)

design/
  DESIGN.md             # Full design system specification

minimax-cli/            # Separate Node.js CLI tool (ESM, Bun-native)
  src/                  # CLI source code
  test/                 # Co-located tests
  AGENTS.md             # CLI-specific guidelines

AGENTS.md               # Project-wide design rules (anti-mainstream aesthetic)
```

## Design Rules (AGENTS.md)

The project follows a distinctive "anti-mainstream" design philosophy:
- **禁止紫色/靛蓝色渐变** — No purple/indigo gradients
- **禁止纯平背景** — Must have noise texture or gradient
- **禁止 Hero + 三卡片布局** — No Hero + 3-column card layouts
- **禁止 Shadcn/Material UI 默认组件** — All components must be customized
- **口语化文案** — Casual, conversational copy (max 15 chars per sentence)

Icon library: Iconify (iconify.design) | Placeholder images: Picsum Photos

## Design Tokens

Located in `config/design-tokens.ts`:
- `colors` — Primary indigo (#3525cd), surface colors
- `spacing` — 8px base unit system (stack-sm: 8, stack-md: 16, stack-lg: 32)
- `borderRadius` — sm: 4px, DEFAULT: 8px, xl: 24px (cards use xl)
- `shadows` — Card elevation with soft diffused shadows

## minimax-cli

A separate Bun-native CLI tool. It has its own AGENTS.md with specific rules:
- Strict TypeScript mode
- Zod for config validation
- Custom error hierarchy in `src/errors/`
- Bun test runner for tests
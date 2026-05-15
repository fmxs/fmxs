# NeuralCore AI Portal - UI 还原实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 design/code.html 还原为 Next.js 14 + Tailwind + Aceternity UI 的现代化企业 AI 门户

**Architecture:** 采用 Next.js App Router 结构，组件化拆分 Header/Hero/Tools/Footer，Aceternity UI 提供基础组件 + Lucide Icons 替换所有图标，全程占位不写业务逻辑

**Tech Stack:** Next.js 14 (App Router) + TypeScript + Tailwind CSS + Aceternity UI + Lucide React + Inter (Google Fonts)

---

## 文件结构

```
fmxs/
├── app/
│   ├── layout.tsx          # 根布局，引入 Inter 字体
│   ├── page.tsx            # 主页面，组合所有组件
│   └── globals.css         # Tailwind 入口 + 自定义 CSS 变量
├── components/
│   ├── Header.tsx          # 固定顶栏，玻璃效果
│   ├── HeroSection.tsx     # Hero 区域（AI Chat + News）
│   ├── AIChatCard.tsx      # AI 对话卡片（含猫助手面板 + 聊天窗口）
│   ├── NewsCard.tsx        # 今日资讯卡片（固定 + 滚动）
│   ├── ToolsGrid.tsx       # 工具导航网格
│   ├── LoginModal.tsx      # 登录模态框
│   └── Footer.tsx          # 页脚
├── config/
│   └── design-tokens.ts    # 设计 token（颜色/间距/圆角）
├── public/
│   └── cat-assistant.svg   # 猫助手 SVG（替代 emoji）
└── docs/superpowers/plans/2026-05-14-neuralcore-ai-portal-plan.md
```

---

## 任务列表

### Task 1: 项目初始化

**Files:**
- Create: `package.json`
- Create: `next.config.ts`
- Create: `tsconfig.json`
- Create: `tailwind.config.ts`
- Create: `postcss.config.js`
- Create: `app/layout.tsx`
- Create: `app/page.tsx`
- Create: `app/globals.css`

- [ ] **Step 1: 创建 package.json**

```json
{
  "name": "neuralcore-ai-portal",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "14.2.x",
    "react": "^18",
    "react-dom": "^18",
    "lucide-react": "^0.400.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.4.0"
  },
  "devDependencies": {
    "typescript": "^5",
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.0.0",
    "postcss": "^8.0.0"
  }
}
```

- [ ] **Step 2: 创建 next.config.ts**

```ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
}

export default nextConfig
```

- [ ] **Step 3: 创建 tsconfig.json**

```json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 4: 创建 tailwind.config.ts**

```ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3525cd',
        'on-primary': '#ffffff',
        'primary-container': '#4f46e5',
        'on-primary-container': '#dad7ff',
        surface: '#f8f9ff',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#eff4ff',
        'surface-container': '#e5eeff',
        'surface-container-high': '#dce9ff',
        'surface-container-highest': '#d3e4fe',
        'on-surface': '#0b1c30',
        'on-surface-variant': '#464555',
        outline: '#777587',
        'outline-variant': '#c7c4d8',
        tertiary: '#005338',
        'on-tertiary': '#ffffff',
        'tertiary-container': '#006e4b',
        'on-tertiary-container': '#67f4b7',
        error: '#ba1a1a',
        'on-error': '#ffffff',
        'error-container': '#ffdad6',
        'on-error-container': '#93000a',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        lg: '0.5rem',
        xl: '0.75rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        'card': '0 4px 20px rgba(15, 23, 42, 0.05)',
        'card-hover': '0 8px 30px rgba(15, 23, 42, 0.12)',
      },
      spacing: {
        'gutter': '24px',
        'stack-sm': '8px',
        'stack-md': '16px',
        'stack-lg': '32px',
      },
    },
  },
  plugins: [],
}

export default config
```

- [ ] **Step 5: 创建 postcss.config.js**

```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

- [ ] **Step 6: 创建 app/globals.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

:root {
  --color-primary: #3525cd;
  --color-surface: #f8f9ff;
}

.glass-effect {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.rolling-news-container {
  height: 168px;
  overflow: hidden;
}

.rolling-news-track {
  animation: newsSlide 12s cubic-bezier(0.45, 0, 0.55, 1) infinite;
}

@keyframes newsSlide {
  0%, 20% { transform: translateY(0); }
  25%, 45% { transform: translateY(-56px); }
  50%, 70% { transform: translateY(-112px); }
  75%, 95% { transform: translateY(-168px); }
  100% { transform: translateY(0); }
}

.rolling-news-track:hover {
  animation-play-state: paused;
}
```

- [ ] **Step 7: 创建 app/layout.tsx**

```tsx
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'NeuralCore AI Portal - 企业智能门户',
  description: '企业内部 AI 工具导航与对话平台',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="bg-surface text-on-surface font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
```

- [ ] **Step 8: 创建 app/page.tsx**

```tsx
import Header from '@/components/Header'
import HeroSection from '@/components/HeroSection'
import ToolsGrid from '@/components/ToolsGrid'
import Footer from '@/components/Footer'
import LoginModal from '@/components/LoginModal'

export default function Home() {
  return (
    <div className="min-h-screen bg-surface">
      <Header />
      <main className="mt-28 max-w-[1440px] mx-auto px-10 pb-20 space-y-8">
        <HeroSection />
        <ToolsGrid />
      </main>
      <Footer />
      <LoginModal />
    </div>
  )
}
```

- [ ] **Step 9: 安装依赖**

Run: `npm install --registry=https://registry.npmmirror.com`

---

### Task 2: 设计 Token 配置

**Files:**
- Create: `config/design-tokens.ts`

- [ ] **Step 1: 创建 config/design-tokens.ts**

```ts
export const colors = {
  primary: '#3525cd',
  'on-primary': '#ffffff',
  'primary-container': '#4f46e5',
  'on-primary-container': '#dad7ff',
  surface: '#f8f9ff',
  'surface-container-lowest': '#ffffff',
  'surface-container-low': '#eff4ff',
  'surface-container': '#e5eeff',
  'surface-container-high': '#dce9ff',
  'surface-container-highest': '#d3e4fe',
  'on-surface': '#0b1c30',
  'on-surface-variant': '#464555',
  outline: '#777587',
  'outline-variant': '#c7c4d8',
  tertiary: '#005338',
  'on-tertiary': '#ffffff',
  'tertiary-container': '#006e4b',
  'on-tertiary-container': '#67f4b7',
  error: '#ba1a1a',
  'on-error': '#ffffff',
  'error-container': '#ffdad6',
  'on-error-container': '#93000a',
} as const

export const spacing = {
  unit: 8,
  gutter: 24,
  'stack-sm': 8,
  'stack-md': 16,
  'stack-lg': 32,
} as const

export const borderRadius = {
  sm: '0.25rem',
  DEFAULT: '0.5rem',
  md: '0.75rem',
  lg: '1rem',
  xl: '1.5rem',
  full: '9999px',
} as const

export const shadows = {
  card: '0 4px 20px rgba(15, 23, 42, 0.05)',
  'card-hover': '0 8px 30px rgba(15, 23, 42, 0.12)',
} as const
```

---

### Task 3: 猫助手 SVG 资源

**Files:**
- Create: `public/cat-assistant.svg`

- [ ] **Step 1: 创建 public/cat-assistant.svg**

（使用简洁现代的猫轮廓 SVG，替代 emoji 🐱）

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <path d="M32 8c-2 0-4 1-5 3-1-1-3-1-5 0-3 2-4 6-3 10 1 4 4 7 8 9v4c-4 2-8 6-10 11-1 2 0 5 3 5h30c3 0 4-3 3-5-2-5-6-9-10-11v-4c4-2 7-5 8-9 1-4 0-8-3-10-2-1-4-1-6 0-1-2-3-3-5-3h-2z" fill="#3525cd"/>
  <circle cx="24" cy="28" r="3" fill="#fff"/>
  <circle cx="40" cy="28" r="3" fill="#fff"/>
  <path d="M28 36h8" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
  <path d="M12 16l6 10M52 16l-6 10" stroke="#3525cd" stroke-width="3" stroke-linecap="round"/>
</svg>
```

---

### Task 4: Header 组件

**Files:**
- Create: `components/Header.tsx`

- [ ] **Step 1: 创建 components/Header.tsx**

```tsx
'use client'

import { Search, Bell } from 'lucide-react'

const models = ['GPT-4o', 'Gemini 1.5', 'Claude 3.5', 'Llama 3']

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-outline-variant/10 shadow-sm">
      <div className="max-w-[1440px] mx-auto px-10 py-4 flex items-center justify-between gap-6">
        {/* Logo */}
        <h1 className="text-2xl font-bold tracking-tight text-primary">NeuralCore AI</h1>

        {/* Model Pills */}
        <nav className="hidden lg:flex items-center gap-2">
          {models.map((model) => (
            <button
              key={model}
              className="px-4 py-2 rounded-full bg-surface-container-low text-sm font-semibold hover:bg-surface-container transition-colors duration-200"
            >
              {model}
            </button>
          ))}
        </nav>

        {/* Search Bar */}
        <div className="flex-1 max-w-xl">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
            <input
              className="w-full bg-surface-container-lowest border border-outline-variant/30 focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-full py-3 pl-12 pr-4 transition-all duration-300"
              placeholder="搜索 AI 工具、网站、资讯、使用方法..."
              type="text"
            />
          </div>
        </div>

        {/* Account Status */}
        <div className="flex items-center gap-4 bg-surface-container-low px-4 py-2 rounded-2xl border border-outline-variant/10">
          <div className="flex flex-col text-right">
            <span className="text-sm font-semibold text-on-surface">未登录</span>
            <span className="text-xs text-on-surface-variant">登录后显示部门/Token</span>
          </div>
          <button className="bg-primary text-white px-6 py-2 rounded-xl text-sm font-bold hover:opacity-90 active:scale-95 transition-all shadow-md">
            登录
          </button>
        </div>

        {/* Notification */}
        <Bell className="text-on-surface-variant cursor-pointer hover:text-primary transition-colors w-5 h-5" />
      </div>
    </header>
  )
}
```

---

### Task 5: LoginModal 组件

**Files:**
- Create: `components/LoginModal.tsx`

- [ ] **Step 1: 创建 components/LoginModal.tsx**

```tsx
'use client'

import { Lock } from 'lucide-react'

interface LoginModalProps {
  isOpen?: boolean
  onClose?: () => void
  onLogin?: () => void
}

export default function LoginModal({ isOpen = false, onClose, onLogin }: LoginModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-on-surface/40 backdrop-blur-md transition-opacity duration-300" />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 transform transition-all">
        {/* Icon */}
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock className="text-primary w-8 h-8" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-on-surface text-center mb-2">
          需要身份认证
        </h2>

        {/* Description */}
        <p className="text-base text-on-surface-variant text-center mt-2 mb-6">
          当前访问内容需要识别账号、部门、权限或 Token 额度。
        </p>

        {/* Buttons */}
        <div className="space-y-4">
          <button
            onClick={onLogin}
            className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:opacity-90 active:scale-95 transition-all shadow-lg"
          >
            模拟企业登录
          </button>
          <button
            onClick={onClose}
            className="w-full bg-surface-container-low text-on-surface-variant py-3 rounded-xl font-medium hover:bg-surface-container transition-colors"
          >
            暂不登录
          </button>
        </div>

        {/* Footer */}
        <p className="text-xs text-outline text-center mt-6">
          © 2024 NeuralCore Enterprise AI. 仅供内部演示使用。
        </p>
      </div>
    </div>
  )
}
```

---

### Task 6: AIChatCard 组件

**Files:**
- Create: `components/AIModelPill.tsx`
- Create: `components/AIChatCard.tsx`

- [ ] **Step 1: 创建 components/AIModelPill.tsx**

```tsx
import { Bot } from 'lucide-react'

interface AIModelPillProps {
  label: string
  badge?: string
  badgeVariant?: 'hot' | 'tool' | 'case' | 'modl'
}

const badgeStyles = {
  hot: 'bg-error-container text-on-error-container',
  tool: 'bg-tertiary-container text-on-tertiary-container',
  case: 'bg-secondary-container text-on-secondary-fixed-variant',
  modl: 'bg-surface-container-highest text-on-surface-variant',
}

export default function AIModelPill({ label, badge, badgeVariant = 'hot' }: AIModelPillProps) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-surface-container-low text-on-surface">
      {badge && <span className={badgeStyles[badgeVariant]}>{badge}</span>}
      <span>{label}</span>
    </div>
  )
}
```

- [ ] **Step 2: 创建 components/AIChatCard.tsx**

```tsx
'use client'

import { Bot, Send } from 'lucide-react'
import Image from 'next/image'

const suggestions = [
  '我想生成角色概念图',
  '我想做视频工具推荐',
  '我想找公司内部 AI 工具',
]

export default function AIChatCard() {
  return (
    <article className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 shadow-card overflow-hidden flex flex-col">
      {/* Card Header */}
      <div className="p-6 border-b border-outline-variant/10 flex justify-between items-center bg-white/50">
        <div>
          <h2 className="text-xl font-semibold text-on-surface">对话交互 AI</h2>
          <p className="text-xs text-on-surface-variant mt-1">猫形象助手，用于工具推荐 / Prompt 生成 / 使用指引</p>
        </div>
        <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold">
          需要登录
        </span>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col lg:flex-row gap-6 flex-1">
        {/* Cat Assistant Panel */}
        <div className="lg:w-48 bg-gradient-to-b from-surface-container-low to-primary-fixed/30 rounded-2xl p-6 flex flex-col items-center justify-center text-center border border-primary/10">
          {/* 替代 emoji，使用 SVG */}
          <div className="w-16 h-16 mb-4 relative">
            <Image
              src="/cat-assistant.svg"
              alt="Neko AI Assistant"
              width={64}
              height={64}
              className="drop-shadow-xl"
            />
          </div>
          <h3 className="text-lg font-semibold text-on-surface">Neko AI 助手</h3>
          <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
            告诉我你想做什么，我会帮你推荐工具。
          </p>
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col glass-effect rounded-2xl border border-outline-variant/20 p-4 min-h-[360px]">
          {/* Messages */}
          <div className="flex-1 space-y-4 overflow-y-auto mb-4 p-2">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Bot className="text-primary w-4 h-4" />
              </div>
              <div className="bg-white border border-outline-variant/10 p-3 rounded-2xl rounded-tl-sm text-base shadow-sm max-w-[85%]">
                你好，我是司内 AI 门户助手。你可以问我：图片、视频、翻译、代码、知识库、ComfyUI 应该怎么用。
              </div>
            </div>
          </div>

          {/* Suggestions */}
          <div className="flex flex-wrap gap-2 mb-4">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                className="px-4 py-2 bg-primary/5 text-primary rounded-full text-xs hover:bg-primary/10 transition-colors border border-primary/10"
              >
                {suggestion}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <input
              className="flex-1 bg-surface-container-low border-none focus:ring-2 focus:ring-primary rounded-xl px-4 text-base h-12"
              placeholder="输入你的需求..."
              type="text"
            />
            <button className="bg-primary text-white w-12 h-12 rounded-xl flex items-center justify-center hover:opacity-90 active:scale-95 transition-all shadow-md shadow-primary/20">
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}
```

---

### Task 7: NewsCard 组件

**Files:**
- Create: `components/NewsCard.tsx`

- [ ] **Step 1: 创建 components/NewsCard.tsx**

```tsx
'use client'

const fixedNews = [
  { badge: 'HOT', badgeVariant: 'hot' as const, text: 'GPT / Gemini / Claude 今日关键能力更新汇总', time: '今天' },
  { badge: 'HOT', badgeVariant: 'hot' as const, text: '适合游戏研发团队关注的 AI 工具变化', time: '今天' },
  { badge: 'TOOL', badgeVariant: 'tool' as const, text: '司内本周推荐试用：内部 Agent 与资产生成工具', time: '今天' },
]

const rollingNews = [
  { badge: 'CASE', badgeVariant: 'case' as const, text: 'AI 视频工具新增多镜头叙事能力', time: '滚动' },
  { badge: 'TOOL', badgeVariant: 'tool' as const, text: '某游戏项目组使用 AI 做批量文案初稿', time: '滚动' },
  { badge: 'MODL', badgeVariant: 'modl' as const, text: '低成本模型在批量翻译任务中的应用建议', time: '滚动' },
  { badge: 'CASE', badgeVariant: 'case' as const, text: '新图像模型支持角色一致性测试', time: '滚动' },
]

interface BadgeProps {
  label: string
  variant: 'hot' | 'tool' | 'case' | 'modl'
}

const badgeStyles = {
  hot: 'bg-error-container text-on-error-container',
  tool: 'bg-tertiary-container text-on-tertiary-container',
  case: 'bg-secondary-container text-on-secondary-fixed-variant',
  modl: 'bg-surface-container-highest text-on-surface-variant',
}

function Badge({ label, variant }: BadgeProps) {
  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${badgeStyles[variant]}`}>
      {label}
    </span>
  )
}

export default function NewsCard() {
  return (
    <aside className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 shadow-card overflow-hidden flex flex-col">
      {/* Card Header */}
      <div className="p-6 border-b border-outline-variant/10 flex justify-between items-center bg-white/50">
        <div>
          <h2 className="text-xl font-semibold text-on-surface">今日 AI 资讯</h2>
          <p className="text-xs text-on-surface-variant mt-1">行业动态与司内工具更新</p>
        </div>
        <button className="text-primary text-sm font-bold hover:underline">
          全部资讯
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col p-2">
        {/* Fixed News */}
        <div className="space-y-1">
          {fixedNews.map((news, index) => (
            <div key={index} className="flex items-center gap-4 p-4 hover:bg-surface-container-low rounded-xl transition-colors cursor-pointer group">
              <Badge label={news.badge} variant={news.badgeVariant} />
              <span className="flex-1 text-sm font-semibold text-on-surface group-hover:text-primary transition-colors line-clamp-1">
                {news.text}
              </span>
              <span className="text-xs text-outline">{news.time}</span>
            </div>
          ))}
        </div>

        {/* Rolling News */}
        <div className="rolling-news-container mt-2 border-t border-outline-variant/5">
          <div className="rolling-news-track flex flex-col">
            {rollingNews.map((news, index) => (
              <div key={index} className="h-14 flex items-center gap-4 px-4 hover:bg-surface-container-low rounded-xl cursor-pointer">
                <Badge label={news.badge} variant={news.badgeVariant} />
                <span className="flex-1 text-sm font-semibold text-on-surface-variant line-clamp-1">
                  {news.text}
                </span>
                <span className="text-xs text-outline">{news.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  )
}
```

---

### Task 8: HeroSection 组件

**Files:**
- Create: `components/HeroSection.tsx`

- [ ] **Step 1: 创建 components/HeroSection.tsx**

```tsx
import AIChatCard from './AIChatCard'
import NewsCard from './NewsCard'

export default function HeroSection() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-10 gap-6 items-stretch">
      {/* AI Chat Card (60%) */}
      <div className="lg:col-span-6">
        <AIChatCard />
      </div>

      {/* News Card (40%) */}
      <div className="lg:col-span-4">
        <NewsCard />
      </div>
    </section>
  )
}
```

---

### Task 9: ToolsGrid 组件

**Files:**
- Create: `components/ToolsGrid.tsx`

- [ ] **Step 1: 创建 components/ToolsGrid.tsx**

```tsx
'use client'

import { Globe, CorporateFare, ShieldCheck } from 'lucide-react'

interface ToolItemProps {
  title: string
  description: string
  badge: string
  badgeVariant: 'direct' | 'login' | 'internal'
}

const badgeStyles = {
  direct: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  login: 'bg-amber-50 text-amber-600 border-amber-100',
  internal: 'bg-blue-50 text-blue-600 border-blue-100',
}

function ToolItem({ title, description, badge, badgeVariant }: ToolItemProps) {
  return (
    <div className="group bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/10 shadow-sm hover:shadow-card-hover hover:border-primary/20 transition-all cursor-pointer">
      <div className="flex justify-between items-start mb-2">
        <div className="font-bold text-on-surface group-hover:text-primary transition-colors">
          {title}
        </div>
        <span className={`text-[10px] px-2 py-1 rounded font-black border ${badgeStyles[badgeVariant]}`}>
          {badge}
        </span>
      </div>
      <p className="text-xs text-on-surface-variant leading-relaxed">{description}</p>
    </div>
  )
}

interface ToolCategoryProps {
  icon: React.ReactNode
  title: string
  tools: ToolItemProps[]
  iconColor: string
}

function ToolCategory({ icon, title, tools, iconColor }: ToolCategoryProps) {
  return (
    <div className="space-y-4">
      <div className={`flex items-center gap-2 px-2 ${iconColor}`}>
        {icon}
        <h3 className="font-bold text-sm">{title}</h3>
      </div>
      <div className="space-y-3">
        {tools.map((tool, index) => (
          <ToolItem key={index} {...tool} />
        ))}
      </div>
    </div>
  )
}

const thirdPartyTools: ToolItemProps[] = [
  {
    title: 'ChatGPT',
    description: '通用问答、写作、代码、分析。支持最新 GPT-4o 系列模型。',
    badge: '直接访问',
    badgeVariant: 'direct',
  },
  {
    title: 'Claude',
    description: '业界顶尖的长文档理解与代码能力，更具人性化的交互风格。',
    badge: '直接访问',
    badgeVariant: 'direct',
  },
  {
    title: '即梦 / 可灵',
    description: '领先的国产图像与视频生成平台，支持精细化运镜控制。',
    badge: '直接访问',
    badgeVariant: 'direct',
  },
]

const secondPartyTools: ToolItemProps[] = [
  {
    title: 'Gemini 公司账号',
    description: '超长上下文支持，无缝连接 Google Workspace 企业生态体系。',
    badge: '需要登录',
    badgeVariant: 'login',
  },
  {
    title: '企业版 Cursor',
    description: '基于 AI 的 IDE。团队共享代码索引，大幅提升研发效率。',
    badge: '需要登录',
    badgeVariant: 'login',
  },
  {
    title: '公司采购模型门户',
    description: '统一集成内部采购的各类大模型 API，安全管控，合规使用。',
    badge: '需要登录',
    badgeVariant: 'login',
  },
]

const firstPartyTools: ToolItemProps[] = [
  {
    title: 'ComfyUI 内部版',
    description: '预设司内资产工作流，高性能 GPU 集群加速，支持节点扩展。',
    badge: '司内环境',
    badgeVariant: 'internal',
  },
  {
    title: 'Stable Diffusion 内部版',
    description: '本地化部署，无限量生成，支持内部特定风格 LoRA 模型。',
    badge: '司内环境',
    badgeVariant: 'internal',
  },
  {
    title: '内部知识库 Agent',
    description: '针对项目规范、HR 政策、技术文档的智能问答与检索系统。',
    badge: '司内环境',
    badgeVariant: 'internal',
  },
]

export default function ToolsGrid() {
  return (
    <section className="space-y-8">
      <div className="flex items-end gap-3 mb-6">
        <h2 className="text-3xl font-bold text-on-surface">工具导航</h2>
        <p className="text-base text-on-surface-variant pb-1">快速访问全球领先的 AI 能力</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ToolCategory
          icon={<Globe className="w-4 h-4" />}
          title="第三方工具 (外部账号)"
          tools={thirdPartyTools}
          iconColor="text-primary"
        />
        <ToolCategory
          icon={<CorporateFare className="w-4 h-4" />}
          title="第二方工具 (公司账号)"
          tools={secondPartyTools}
          iconColor="text-indigo-600"
        />
        <ToolCategory
          icon={<ShieldCheck className="w-4 h-4" />}
          title="第一方访问 (自建工具)"
          tools={firstPartyTools}
          iconColor="text-emerald-600"
        />
      </div>
    </section>
  )
}
```

---

### Task 10: Footer 组件

**Files:**
- Create: `components/Footer.tsx`

- [ ] **Step 1: 创建 components/Footer.tsx**

```tsx

export default function Footer() {
  const links = [
    { label: 'Documentation', href: '#' },
    { label: 'System Status', href: '#' },
    { label: 'Security Policy', href: '#' },
    { label: 'Contact Support', href: '#' },
  ]

  return (
    <footer className="w-full py-8 bg-surface border-t border-outline-variant/10">
      <div className="max-w-[1440px] mx-auto px-10 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Brand */}
        <div className="flex flex-col gap-2">
          <div className="text-xl font-bold text-on-surface">NeuralCore AI Portal</div>
          <p className="text-xs text-outline-variant">© 2024 NeuralCore Enterprise AI. Proprietary and Confidential.</p>
        </div>

        {/* Links */}
        <div className="flex gap-8">
          {links.map((link) => (
            <a
              key={link.label}
              className="text-sm text-on-secondary-container hover:text-primary transition-colors"
              href={link.href}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
```

---

### Task 11: 集成测试

**Files:**
- Modify: `app/page.tsx`（确保所有组件正确导入）

- [ ] **Step 1: 验证页面构建**

Run: `npm run build`
Expected: 构建成功，无错误

- [ ] **Step 2: 验证开发服务器**

Run: `npm run dev`
Expected: 访问 http://localhost:3000 正常显示页面

---

## 实施检查清单

- [ ] Task 1: 项目初始化（package.json / tailwind / next.config）
- [ ] Task 2: 设计 Token 配置
- [ ] Task 3: 猫助手 SVG 资源
- [ ] Task 4: Header 组件
- [ ] Task 5: LoginModal 组件
- [ ] Task 6: AIChatCard 组件（含 AI Model Pill）
- [ ] Task 7: NewsCard 组件
- [ ] Task 8: HeroSection 组件
- [ ] Task 9: ToolsGrid 组件
- [ ] Task 10: Footer 组件
- [ ] Task 11: 集成测试
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
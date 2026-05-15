'use client'

import { Bot, Send } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

const suggestions = [
  '我想生成角色概念图',
  '我想做视频工具推荐',
  '我想找公司内部 AI 工具',
]

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function AIChatCard() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')
    setIsLoading(true)

    // 添加用户消息
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])

    try {
      const response = await fetch('/api/neko', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      })
      const data = await response.json()

      if (response.ok) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.content }])
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: `错误: ${data.error}` }])
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: '网络错误，请稍后重试' }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuggestion = (suggestion: string) => {
    setInput(suggestion)
    setTimeout(() => handleSend(), 100)
  }

  return (
    <article className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 shadow-[0_4px_20px_rgba(15,23,42,0.05)] overflow-hidden flex flex-col">
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
            {messages.length === 0 && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Bot className="text-primary w-4 h-4" />
                </div>
                <div className="bg-white border border-outline-variant/10 p-3 rounded-2xl rounded-tl-sm text-base shadow-sm max-w-[85%]">
                  你好，我是司内 AI 门户助手。你可以问我：图片、视频、翻译、代码、知识库、ComfyUI 应该怎么用。
                </div>
              </div>
            )}
            {messages.map((msg, index) => (
              <div key={index} className="flex gap-3">
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Bot className="text-primary w-4 h-4" />
                  </div>
                )}
                <div className={`${msg.role === 'user' ? 'bg-primary/10 ml-auto' : 'bg-white border border-outline-variant/10'} p-3 rounded-2xl ${msg.role === 'user' ? 'rounded-tr-sm' : 'rounded-tl-sm'} text-base shadow-sm max-w-[85%]`}>
                  {msg.content}
                </div>
              </div>
            ))}
          </div>

          {/* Suggestions */}
          <div className="flex flex-wrap gap-2 mb-4">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => handleSuggestion(suggestion)}
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
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={isLoading}
              className="bg-primary text-white w-12 h-12 rounded-xl flex items-center justify-center hover:opacity-90 active:scale-95 transition-all shadow-md shadow-primary/20 disabled:opacity-50"
            >
              {isLoading ? (
                <span className="animate-spin">⏳</span>
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}

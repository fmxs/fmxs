'use client'

import { Globe, CorporateFare, ShieldCheck } from 'lucide-react'

type BadgeVariant = 'direct' | 'login' | 'internal'

interface ToolItemProps {
  title: string
  description: string
  badge: string
  badgeVariant: BadgeVariant
}

interface ToolCategoryProps {
  icon: React.ReactNode
  title: string
  tools: ToolItemProps[]
  iconColor: string
}

const badgeStyles: Record<BadgeVariant, string> = {
  direct: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  login: 'bg-amber-50 text-amber-600 border-amber-100',
  internal: 'bg-blue-50 text-blue-600 border-blue-100',
}

function ToolItem({ title, description, badge, badgeVariant }: ToolItemProps) {
  return (
    <button
      onClick={() => { /* TODO */ }}
      className="w-full text-left p-4 rounded-xl border border-outline-variant/10 hover:border-primary/20 hover:bg-primary/5 transition-all group"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="font-medium text-on-surface group-hover:text-primary transition-colors">
          {title}
        </h4>
        <span className={`text-xs px-2 py-0.5 rounded-full border shrink-0 ${badgeStyles[badgeVariant]}`}>
          {badge}
        </span>
      </div>
      <p className="text-sm text-on-surface-variant">{description}</p>
    </button>
  )
}

function ToolCategory({ icon, title, tools, iconColor }: ToolCategoryProps) {
  return (
    <div className="flex flex-col">
      <div className={`flex items-center gap-2 mb-4 ${iconColor}`}>
        {icon}
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <div className="flex flex-col gap-3">
        {tools.map((tool) => (
          <ToolItem key={tool.title} {...tool} />
        ))}
      </div>
    </div>
  )
}

const thirdPartyTools: ToolItemProps[] = [
  {
    title: 'ChatGPT',
    description: 'OpenAI GPT-4 模型，支持多模态内容生成',
    badge: '直接访问',
    badgeVariant: 'direct',
  },
  {
    title: 'Claude',
    description: 'Anthropic Claude 3.5 Sonnet 模型',
    badge: '直接访问',
    badgeVariant: 'direct',
  },
  {
    title: '即梦/可灵',
    description: '字节跳动 AI 作图与视频生成工具',
    badge: '直接访问',
    badgeVariant: 'direct',
  },
]

const secondPartyTools: ToolItemProps[] = [
  {
    title: 'Gemini公司账号',
    description: 'Google Gemini 企业版账号',
    badge: '需要登录',
    badgeVariant: 'login',
  },
  {
    title: '企业版Cursor',
    description: 'AI 代码编辑器企业授权版',
    badge: '需要登录',
    badgeVariant: 'login',
  },
  {
    title: '公司采购模型门户',
    description: '公司统一采购的 AI 模型访问入口',
    badge: '需要登录',
    badgeVariant: 'login',
  },
]

const firstPartyTools: ToolItemProps[] = [
  {
    title: 'ComfyUI内部版',
    description: '司内定制的 AI 图像生成工作流平台',
    badge: '司内环境',
    badgeVariant: 'internal',
  },
  {
    title: 'Stable Diffusion内部版',
    description: '司内部署的 AI 图像生成服务',
    badge: '司内环境',
    badgeVariant: 'internal',
  },
  {
    title: '内部知识库Agent',
    description: '基于内部文档的 RAG 问答系统',
    badge: '司内环境',
    badgeVariant: 'internal',
  },
]

export default function ToolsGrid() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
      <ToolCategory
        icon={<Globe className="w-5 h-5 text-primary" />}
        title="外部账号"
        tools={thirdPartyTools}
        iconColor="text-primary"
      />
      <ToolCategory
        icon={<CorporateFare className="w-5 h-5 text-indigo-600" />}
        title="公司账号"
        tools={secondPartyTools}
        iconColor="text-indigo-600"
      />
      <ToolCategory
        icon={<ShieldCheck className="w-5 h-5 text-emerald-600" />}
        title="自建工具"
        tools={firstPartyTools}
        iconColor="text-emerald-600"
      />
    </section>
  )
}
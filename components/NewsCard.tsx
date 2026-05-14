'use client'

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

const fixedNews = [
  { badge: 'hot' as const, text: 'GPT / Gemini / Claude 今日关键能力更新汇总' },
  { badge: 'hot' as const, text: '适合游戏研发团队关注的 AI 工具变化' },
  { badge: 'tool' as const, text: '司内本周推荐试用：内部 Agent 与资产生成工具' },
]

const rollingNews = [
  { badge: 'case' as const, text: 'AI 视频工具新增多镜头叙事能力' },
  { badge: 'tool' as const, text: '某游戏项目组使用 AI 做批量文案初稿' },
  { badge: 'modl' as const, text: '低成本模型在批量翻译任务中的应用建议' },
  { badge: 'case' as const, text: '新图像模型支持角色一致性测试' },
]

export default function NewsCard() {
  return (
    <article className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 shadow-[0_4px_20px_rgba(15,23,42,0.05)] overflow-hidden">
      {/* Card Header */}
      <div className="p-6 border-b border-outline-variant/10 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-on-surface">今日 AI 资讯</h2>
        <button
          onClick={() => { /* TODO */ }}
          className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
        >
          全部资讯
        </button>
      </div>

      {/* Fixed News Section */}
      <div className="p-6 space-y-4">
        {fixedNews.map((item, index) => (
          <div
            key={index}
            onClick={() => { /* TODO */ }}
            className="flex items-center gap-3 hover:bg-surface-container-low p-2 -m-2 rounded-xl cursor-pointer transition-colors"
          >
            <Badge label={item.badge} variant={item.badge} />
            <span className="text-sm text-on-surface">{item.text}</span>
          </div>
        ))}
      </div>

      {/* Rolling News Section */}
      <div className="border-t border-outline-variant/10">
        <div className="rolling-news-container overflow-hidden">
          <div className="rolling-news-track flex">
            {rollingNews.concat(rollingNews).map((item, index) => (
              <div
                key={index}
                onClick={() => { /* TODO */ }}
                className="flex items-center gap-3 px-6 py-4 hover:bg-surface-container-low cursor-pointer transition-colors whitespace-nowrap"
              >
                <Badge label={item.badge} variant={item.badge} />
                <span className="text-sm text-on-surface">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </article>
  )
}
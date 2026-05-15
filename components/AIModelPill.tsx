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

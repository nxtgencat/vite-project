import type { ReactNode } from 'react'

type EmptyStateProps = {
  title: string
  children?: ReactNode
  action?: ReactNode
}

export function EmptyState({ title, children, action }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <p className="empty-title text-sm">{title}</p>
      {children && <p className="max-w-[60ch] text-[13px] leading-5">{children}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}

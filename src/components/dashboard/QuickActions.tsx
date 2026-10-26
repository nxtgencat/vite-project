import { ChevronRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

export type QuickAction = {
  to: string
  title: string
  note: string
}

export function QuickActions({
  actions,
  footer,
}: {
  actions: QuickAction[]
  footer?: ReactNode
}) {
  return (
    <section className="panel panel-pad flex h-full flex-col" aria-label="Quick actions">
      <div className="panel-head">
        <h2 className="panel-title">Quick actions</h2>
      </div>
      <div className="-mx-3">
        {actions.map((action) => (
          <Link to={action.to} className="action-row" key={action.to}>
            <div className="min-w-0 flex-1">
              <p className="action-title">{action.title}</p>
              <p className="action-note">{action.note}</p>
            </div>
            <ChevronRight size={15} aria-hidden="true" className="shrink-0 text-muted" />
          </Link>
        ))}
      </div>
      {footer && <div className="mt-auto border-t border-rule pt-3">{footer}</div>}
    </section>  )
}

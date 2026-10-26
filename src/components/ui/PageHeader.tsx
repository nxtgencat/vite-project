import { ArrowLeft } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

type PageHeaderProps = {
  title: string
  sub?: ReactNode
  actions?: ReactNode
  back?: { to: string; label: string }
}

export function PageHeader({ title, sub, actions, back }: PageHeaderProps) {
  return (
    <header className="page-head">
      <div className="min-w-0">
        {back && (
          <Link to={back.to} className="back-link mb-2">
            <ArrowLeft size={14} aria-hidden="true" />
            {back.label}
          </Link>
        )}
        <h1 className="page-title">{title}</h1>
        {sub && <p className="page-sub">{sub}</p>}
      </div>
      {actions && <div className="page-actions">{actions}</div>}
    </header>
  )
}

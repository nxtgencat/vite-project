import { AlertTriangle } from 'lucide-react'
import type { ReactNode } from 'react'

export function Notice({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="notice" role="status">
      <AlertTriangle aria-hidden="true" />
      <div className="min-w-0">{children}</div>
      {action}
    </div>
  )
}

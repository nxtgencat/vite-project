import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { daysUntil, deadlineLabel, plural } from '../../lib/format'
import type { Job } from '../../lib/types'
import { CompanyMark } from '../ui/Avatar'
import { EmptyState } from '../ui/EmptyState'

export function ClosingSoon({
  jobs,
  totalOpen,
  viewAll,
}: {
  jobs: Job[]
  totalOpen: number
  viewAll: { to: string; label: string }
}) {
  return (
    <section className="panel panel-pad flex h-full flex-col" aria-label="Roles closing soon">
      <div className="panel-head">
        <h2 className="panel-title">Closing soon</h2>
        <p className="panel-meta">By posted deadline</p>
      </div>

      {jobs.length === 0 ? (
        <EmptyState title="No deadlines in the next month">
          Open roles and their closing dates will appear here.
        </EmptyState>
      ) : (
        <div className="-mx-3">
          {jobs.map((job) => {
            const days = daysUntil(job.deadline)
            return (
              <Link to={`/jobs/${job.id}`} className="action-row" key={job.id}>
                <CompanyMark name={job.companyName} />
                <div className="min-w-0 flex-1">
                  <p className="action-title truncate">{job.title}</p>
                  <p className="action-note sm:truncate">
                    {job.companyName} · {job.location}
                  </p>
                  <p className="action-note num mt-0.5 sm:hidden">{deadlineLabel(job.deadline)}</p>
                </div>
                <span
                  className={`num hidden shrink-0 text-[13px] sm:inline ${
                    days <= 3 ? 'text-ink' : 'text-muted'
                  }`}
                >
                  {deadlineLabel(job.deadline)}
                </span>
                <ChevronRight
                  size={15}
                  aria-hidden="true"
                  className="hidden shrink-0 text-muted sm:block"
                />
              </Link>
            )
          })}
        </div>
      )}

      <div className="mt-auto flex items-center justify-between gap-3 border-t border-rule pt-3">
        <span className="text-[13px] text-muted">{plural(totalOpen, 'open role')}</span>
        <Link
          to={viewAll.to}
          className="text-[13px] font-medium underline decoration-border underline-offset-2 hover:text-ink"
        >
          {viewAll.label}
        </Link>
      </div>
    </section>
  )
}

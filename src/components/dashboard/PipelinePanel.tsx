import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ACTIVE_STAGES, type ActiveStage } from '../../lib/metrics'

type PipelinePanelProps = {
  title?: string
  counts: Record<ActiveStage, number>
  activeStage: ActiveStage
  listTitle: string
  listMeta?: string
  note?: ReactNode
  viewAll?: { to: string; label: string }
  children: ReactNode
  empty?: ReactNode
}

export function PipelinePanel({
  title = 'Applications by stage',
  counts,
  activeStage,
  listTitle,
  listMeta,
  note,
  viewAll,
  children,
  empty,
}: PipelinePanelProps) {
  const total = ACTIVE_STAGES.reduce((sum, stage) => sum + counts[stage], 0)

  return (
    <section className="panel panel-pad flex h-full flex-col" aria-label="Applications by stage">
      <div className="panel-head">
          <h2 className="panel-title">{title}</h2>
        {viewAll && (
          <Link
            to={viewAll.to}
            className="text-[13px] text-muted underline decoration-border underline-offset-2 hover:text-ink"
          >
            {viewAll.label}
          </Link>
        )}
      </div>

      <div className="pipeline-stages -mx-5">
        {ACTIVE_STAGES.map((stage) => (
          <div className="pipeline-stage" key={stage} data-active={stage === activeStage}>
            <p className="pipeline-label">{stage}</p>
            <p className="pipeline-value">{counts[stage]}</p>
          </div>
        ))}
      </div>

      {total > 0 && (
        <div
          className="pipeline-band"
          role="img"
          aria-label={ACTIVE_STAGES.map((stage) => `${stage} ${counts[stage]}`).join(', ')}
        >
          {ACTIVE_STAGES.map((stage) =>
            counts[stage] > 0 ? (
              <span
                key={stage}
                data-stage={stage}
                data-active={stage === activeStage}
                style={{ width: `${(counts[stage] / total) * 100}%` }}
              />
            ) : null,
          )}
        </div>
      )}

      {note && <p className="mt-2 text-[13px] leading-5 text-muted">{note}</p>}

      <div className="mt-4 flex items-baseline justify-between gap-3">
        <h3 className="text-[13px] leading-5 font-medium">{listTitle}</h3>
        {listMeta && <p className="text-[13px] leading-4 text-muted">{listMeta}</p>}
      </div>

      <div className="mt-1 min-h-0 flex-1">
        {total === 0 ? <div className="mt-2">{empty}</div> : children}
      </div>
    </section>
  )
}

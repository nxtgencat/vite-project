import type { ReactNode } from 'react'
import { relativeTime } from '../../lib/format'
import type { Activity } from '../../lib/types'
import { Avatar } from '../ui/Avatar'
import { EmptyState } from '../ui/EmptyState'

export function ActivityList({
  activities,
  scope,
  viewerId,
  footer,
}: {
  activities: Activity[]
  scope: string
  viewerId?: string
  footer?: ReactNode
}) {
  return (
    <section className="panel panel-pad flex h-full flex-col" aria-label="Recent activity">
      <div className="panel-head">
        <h2 className="panel-title">Recent activity</h2>
        <p className="panel-meta">{scope}</p>
      </div>

      {activities.length === 0 ? (
        <EmptyState title="No activity yet">
          Applications, saved roles and updates will appear here as they happen.
        </EmptyState>
      ) : (
        <ul className="row-list">
          {activities.map((activity) => (
            <li className="row-item" key={activity.id}>
              <Avatar name={activity.actorName} size="sm" />
              <p className="min-w-0 flex-1 text-[13px] leading-5">
                {viewerId && activity.actorId === viewerId
                  ? activity.text
                      .replace(`${activity.actorName}'s`, 'Your')
                      .replace(activity.actorName, 'You')
                  : activity.text}
              </p>
              <time className="shrink-0 text-[13px] text-muted" dateTime={activity.at}>
                {relativeTime(activity.at)}
              </time>
            </li>
          ))}
        </ul>
      )}

      {footer && <div className="mt-auto border-t border-rule pt-3">{footer}</div>}
    </section>
  )
}

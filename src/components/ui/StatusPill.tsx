import type { ApplicationStatus, JobStatus } from '../../lib/types'
import { cx } from '../../lib/utils'

const TONE: Record<ApplicationStatus | JobStatus, string> = {
  Applied: '',
  'In review': 'info',
  Interview: 'info',
  Offer: 'pos',
  Rejected: 'neg',
  Withdrawn: '',
  Open: 'pos',
  Closed: '',
}

export function StatusPill({ status }: { status: ApplicationStatus | JobStatus }) {
  return <span className={cx('pill', TONE[status])}>{status}</span>
}

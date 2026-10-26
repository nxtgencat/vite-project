import { monthLabel } from './format'
import type { Application, ApplicationStatus, Job, SavedJob } from './types'

export const ACTIVE_STAGES = ['Applied', 'In review', 'Interview', 'Offer'] as const
export type ActiveStage = (typeof ACTIVE_STAGES)[number]

export function isActiveStatus(status: ApplicationStatus) {
  return (ACTIVE_STAGES as readonly ApplicationStatus[]).includes(status)
}

export function stageCounts(applications: Application[]) {
  return ACTIVE_STAGES.reduce<Record<ActiveStage, number>>(
    (totals, stage) => {
      totals[stage] = applications.filter((application) => application.status === stage).length
      return totals
    },
    { Applied: 0, 'In review': 0, Interview: 0, Offer: 0 },
  )
}

export function pendingReviewCount(applications: Application[]) {
  return applications.filter((application) => application.status === 'Applied').length
}

export function todayApplicationCount(applications: Application[], now = new Date()) {
  return applications.filter((application) => {
    const date = new Date(application.appliedAt)
    return (
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth() &&
      date.getDate() === now.getDate()
    )
  }).length
}

export function jobApplicationCount(applications: Application[], jobId: string) {
  return applications.filter((application) => application.jobId === jobId).length
}

export function mostAppliedJobs(jobs: Job[], applications: Application[], limit = 5) {
  return jobs
    .map((job) => ({
      job,
      count: jobApplicationCount(applications, job.id),
    }))
    .filter((entry) => entry.count > 0)
    .sort((a, b) => b.count - a.count || a.job.title.localeCompare(b.job.title))
    .slice(0, limit)
}

type MonthBucket = {
  key: string
  label: string
  year: number
  month: number
}

function recentMonths(months: number, now: Date): MonthBucket[] {
  return Array.from({ length: months }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (months - 1 - index), 1)
    return {
      key: `${date.getFullYear()}-${date.getMonth()}`,
      label: monthLabel(date),
      year: date.getFullYear(),
      month: date.getMonth(),
    }
  })
}

export function monthlyApplications(applications: Application[], months = 6, now = new Date()) {
  const buckets = recentMonths(months, now)
  const values = buckets.map(() => 0)
  const indexByKey = new Map(buckets.map((bucket, index) => [bucket.key, index]))

  for (const application of applications) {
    const date = new Date(application.appliedAt)
    if (Number.isNaN(date.getTime())) continue
    const index = indexByKey.get(`${date.getFullYear()}-${date.getMonth()}`)
    if (index !== undefined) values[index] += 1
  }

  return { labels: buckets.map((bucket) => bucket.label), values }
}

export function monthlyOutcomes(applications: Application[], months = 6, now = new Date()) {
  const buckets = recentMonths(months, now)
  return buckets.map((bucket) => {
    const inMonth = applications.filter((application) => {
      const date = new Date(application.appliedAt)
      return (
        date.getFullYear() === bucket.year &&
        date.getMonth() === bucket.month
      )
    })
    return {
      label: bucket.label,
      applications: inMonth.length,
      interviews: inMonth.filter((application) =>
        application.status === 'Interview' || application.status === 'Offer',
      ).length,
      offers: inMonth.filter((application) => application.status === 'Offer').length,
    }
  })
}

export function savedJobsClosing(
  savedJobs: SavedJob[],
  jobs: Job[],
  candidateId: string,
  withinDays = 7,
) {
  const now = Date.now()
  const limit = now + withinDays * 86_400_000
  return savedJobs.filter((saved) => {
    if (saved.candidateId !== candidateId) return false
    const job = jobs.find((entry) => entry.id === saved.jobId)
    if (!job || job.status !== 'Open') return false
    const deadline = new Date(job.deadline).getTime()
    return deadline >= now && deadline <= limit
  }).length
}

export function closingSoon(jobs: Job[], limit = 4) {
  const now = Date.now()
  return jobs
    .filter((job) => job.status === 'Open' && new Date(job.deadline).getTime() >= now)
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    .slice(0, limit)
}

export function mostRecentApplication(applications: Application[]) {
  return [...applications].sort(
    (a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime(),
  )[0]
}

export function focusStage(applications: Application[]): ActiveStage {
  const order: ActiveStage[] = ['Offer', 'Interview', 'In review', 'Applied']
  const present = order.find((stage) =>
    applications.some((application) => application.status === stage),
  )
  return present ?? 'Applied'
}

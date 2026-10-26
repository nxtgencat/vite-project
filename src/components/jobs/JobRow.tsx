import { Link } from 'react-router-dom'
import type { Job } from '../../lib/types'
import { deadlineLabel, formatSalary, plural } from '../../lib/format'
import { CompanyMark } from '../ui/Avatar'
import { StatusPill } from '../ui/StatusPill'

export function JobRow({ job, saved }: { job: Job; saved?: boolean }) {
  return (
    <li className="border-b border-rule last:border-0">
      <div className="flex flex-col gap-3 py-3.5 sm:flex-row sm:items-center">
        <Link
          to={`/jobs/${job.id}`}
          className="group flex min-w-0 flex-1 items-start gap-3"
        >
          <CompanyMark name={job.companyName} logo={undefined} />
          <div className="min-w-0">
            <p className="truncate text-[14px] font-medium group-hover:underline">{job.title}</p>
            <p className="mt-0.5 truncate text-[13px] text-muted">
              {job.companyName} · {job.location} · {job.employmentType}
            </p>
          </div>
        </Link>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 sm:justify-end">
          <span className="num text-[13px]">{formatSalary(job.salaryMin, job.salaryMax)}</span>
          <span className="text-[13px] text-muted">{job.experienceLevel}</span>
          <span className="text-[13px] text-muted">{deadlineLabel(job.deadline)}</span>
          <StatusPill status={job.status} />
          {saved && <span className="text-[12px] text-muted">Saved</span>}
        </div>
      </div>
    </li>
  )
}

export function JobSummary({ job, applicationCount }: { job: Job; applicationCount?: number }) {
  return (
    <dl className="key-value">
      <div>
        <dt>Salary range</dt>
        <dd className="num">{formatSalary(job.salaryMin, job.salaryMax)}</dd>
      </div>
      <div>
        <dt>Employment type</dt>
        <dd>{job.employmentType}</dd>
      </div>
      <div>
        <dt>Experience</dt>
        <dd>{job.experienceLevel}</dd>
      </div>
      <div>
        <dt>Location</dt>
        <dd>{job.location}</dd>
      </div>
      <div>
        <dt>Category</dt>
        <dd>{job.category}</dd>
      </div>
      {applicationCount !== undefined && (
        <div>
          <dt>Applications</dt>
          <dd className="num">{plural(applicationCount, 'application')}</dd>
        </div>
      )}
      <div>
        <dt>Deadline</dt>
        <dd>{deadlineLabel(job.deadline)}</dd>
      </div>
      <div>
        <dt>Status</dt>
        <dd>
          <StatusPill status={job.status} />
        </dd>
      </div>
    </dl>
  )
}

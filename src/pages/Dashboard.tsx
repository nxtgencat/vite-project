import { ChevronRight, Plus, Search } from 'lucide-react'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ActivityList } from '../components/dashboard/ActivityList'
import { ClosingSoon } from '../components/dashboard/ClosingSoon'
import { PipelinePanel } from '../components/dashboard/PipelinePanel'
import { QuickActions, type QuickAction } from '../components/dashboard/QuickActions'
import { Avatar, CompanyMark } from '../components/ui/Avatar'
import { EmptyState } from '../components/ui/EmptyState'
import { KpiStrip } from '../components/ui/KpiStrip'
import { PageHeader } from '../components/ui/PageHeader'
import { StatusPill } from '../components/ui/StatusPill'
import { useAuth } from '../context/auth-context'
import { useData } from '../context/data-context'
import { usePageTitle } from '../hooks/usePageTitle'
import { daysUntil, plural, relativeTime } from '../lib/format'
import {
  closingSoon,
  focusStage,
  pendingReviewCount,
  savedJobsClosing,
  stageCounts,
  todayApplicationCount,
} from '../lib/metrics'

function waitingLabel(iso: string) {
  const days = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000))
  if (days === 0) return 'Today'
  if (days === 1) return '1 day'
  return `${days} days`
}

export default function Dashboard() {
  usePageTitle('Overview')
  const { user } = useAuth()
  const {
    companies,
    jobs,
    applications,
    savedJobs,
    activities,
    candidateCount,
    profile,
  } = useData()

  const isCandidate = user?.role === 'candidate'

  const myApplications = useMemo(
    () =>
      isCandidate && user
        ? applications.filter((application) => application.candidateId === user.id)
        : applications,
    [applications, isCandidate, user],
  )

  const openJobs = useMemo(() => jobs.filter((job) => job.status === 'Open'), [jobs])
  const counts = stageCounts(myApplications)
  const mySavedJobs = user
    ? savedJobs.filter((saved) => saved.candidateId === user.id)
    : []
  const savedCount = isCandidate ? mySavedJobs.length : savedJobs.length
  const waiting = pendingReviewCount(applications)
  const todayCount = todayApplicationCount(applications)
  const closingThisWeek = openJobs.filter((job) => {
    const days = daysUntil(job.deadline)
    return days >= 0 && days <= 7
  }).length
  const savedClosing = user ? savedJobsClosing(savedJobs, jobs, user.id) : 0
  const inInterview = myApplications.filter(
    (application) => application.status === 'Interview',
  ).length
  const rejectedCount = myApplications.filter(
    (application) => application.status === 'Rejected',
  ).length
  const withdrawnCount = myApplications.filter(
    (application) => application.status === 'Withdrawn',
  ).length
  const inactiveNote = [
    rejectedCount > 0 ? `${rejectedCount} rejected` : '',
    withdrawnCount > 0 ? `${withdrawnCount} withdrawn` : '',
  ]
    .filter(Boolean)
    .join(' · ')
  const industries = new Set(companies.map((company) => company.industry)).size
  const candidatesWithApplications = new Set(
    applications.map((application) => application.candidateId),
  ).size

  const profileFields = [
    profile?.fullName,
    profile?.email,
    profile?.mobile,
    profile?.address,
    profile?.experience,
    profile?.education,
    profile?.resumeName,
    profile?.skills.length ? 'skills' : '',
  ]
  const profileComplete = Math.round(
    (profileFields.filter(Boolean).length / profileFields.length) * 100,
  )

  const waitingItems = useMemo(
    () =>
      applications
        .filter((application) => application.status === 'Applied')
        .sort((a, b) => new Date(a.appliedAt).getTime() - new Date(b.appliedAt).getTime())
        .slice(0, 3)
        .flatMap((application) => {
          const job = jobs.find((entry) => entry.id === application.jobId)
          return job ? [{ application, job }] : []
        }),
    [applications, jobs],
  )

  const latestApplications = useMemo(
    () =>
      [...myApplications]
        .sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime())
        .slice(0, 4)
        .flatMap((application) => {
          const job = jobs.find((entry) => entry.id === application.jobId)
          return job ? [{ application, job }] : []
        }),
    [jobs, myApplications],
  )

  const recentActivity = useMemo(() => {
    const scoped =
      isCandidate && user
        ? activities.filter((activity) => activity.actorId === user.id)
        : activities
    return [...scoped]
      .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
      .slice(0, 5)
  }, [activities, isCandidate, user])

  const quickActions: QuickAction[] = isCandidate
    ? [
        {
          to: '/jobs',
          title: 'Find a job',
          note: 'Search open roles by location, level and salary.',
        },
        {
          to: '/applications',
          title: 'Your applications',
          note: 'Track every role you have applied to.',
        },
        {
          to: '/saved-jobs',
          title: 'Saved jobs',
          note: 'The roles you put aside for later.',
        },
        {
          to: '/profile',
          title: 'Edit profile',
          note: 'Keep your skills and resume current.',
        },
        {
          to: '/companies',
          title: 'Companies hiring',
          note: 'See who is on the directory and what they do.',
        },
      ]
    : [
        {
          to: '/jobs/new',
          title: 'Post a job',
          note: 'Publish a role to the board.',
        },
        {
          to: '/companies?new=1',
          title: 'Add a company',
          note: 'Add a company to the directory.',
        },
        {
          to: '/jobs/manage',
          title: 'Review applicants',
          note: 'See who is waiting on a decision.',
        },
        {
          to: '/companies',
          title: 'Manage companies',
          note: 'Search, edit or remove a directory entry.',
        },
        {
          to: '/reports',
          title: 'Open reports',
          note: 'Applications, roles and outcomes.',
        },
        {
          to: '/jobs',
          title: 'Browse the job board',
          note: 'See every open role as candidates do.',
        },
      ]

  const kpis = [
    {
      label: 'Companies',
      value: companies.length.toLocaleString('en-US'),
      meta: `${industries} industries`,
    },
    {
      label: 'Total jobs',
      value: jobs.length.toLocaleString('en-US'),
      meta: `${openJobs.length} open`,
    },
    {
      label: 'Active jobs',
      value: openJobs.length.toLocaleString('en-US'),
      meta: `${closingThisWeek} ${closingThisWeek === 1 ? 'closes' : 'close'} this week`,
    },
    {
      label: 'Candidates',
      value: candidateCount.toLocaleString('en-US'),
      meta: `${candidatesWithApplications} ${candidatesWithApplications === 1 ? 'has' : 'have'} applied`,
    },
    {
      label: 'Applications',
      value: isCandidate
        ? myApplications.length.toLocaleString('en-US')
        : applications.length.toLocaleString('en-US'),
      meta: isCandidate ? 'Yours' : `${todayCount} today`,
    },
    {
      label: 'Saved jobs',
      value: savedCount.toLocaleString('en-US'),
      meta: isCandidate ? 'Yours' : 'Across candidates',
    },
  ]

  const subline = isCandidate
    ? myApplications.length === 0
      ? `${plural(openJobs.length, 'role')} open now. Your applications will appear here once you send one.`
      : `${plural(myApplications.length, 'application')} on file${inInterview ? `, ${inInterview} in interview` : ''}. ${savedClosing === 0 ? 'No saved roles close this week.' : `${plural(savedClosing, 'saved role')} ${savedClosing === 1 ? 'closes' : 'close'} this week.`}`
    : `${todayCount === 0 ? 'No applications today.' : `${plural(todayCount, 'application')} arrived today.`} ${waiting} ${waiting === 1 ? 'is' : 'are'} waiting on a first review.`

  if (!user) return null

  const profileFooter = (
    <div>
      <div className="flex items-center justify-between gap-3 text-[13px]">
        <span className="text-muted">Profile complete</span>
        <span className="num font-medium">{profileComplete}%</span>
      </div>
      <div className="mt-2 h-1 overflow-hidden rounded-full bg-rule">
        <div className="h-full rounded-full bg-ink" style={{ width: `${profileComplete}%` }} />
      </div>
      <Link
        to="/profile"
        className="mt-2 inline-block text-[13px] font-medium underline decoration-border underline-offset-2 hover:text-ink"
      >
        {profile ? 'Review profile' : 'Create profile'}
      </Link>
    </div>
  )

  return (
    <>
      <PageHeader
        title="Overview"
        sub={subline}
        actions={
          <Link to={isCandidate ? '/jobs' : '/jobs/new'} className="btn primary lg">
            {isCandidate ? <Search size={16} aria-hidden="true" /> : <Plus size={16} aria-hidden="true" />}
            {isCandidate ? 'Find a job' : 'Post a job'}
          </Link>
        }
      />

      <KpiStrip items={kpis} label="Hiring statistics" />

      <div className="mt-3 grid grid-cols-1 gap-3 xl:grid-cols-12">
        <div className="xl:col-span-8">
          <PipelinePanel
            title={isCandidate ? 'Your applications by stage' : 'Applications by stage'}
            counts={counts}
            activeStage={isCandidate ? focusStage(myApplications) : 'Applied'}
            listTitle={isCandidate ? 'Latest applications' : 'Waiting longest'}
            listMeta={
              isCandidate
                ? `${myApplications.length} total`
                : `${waiting} waiting`
            }
            note={inactiveNote || undefined}
            viewAll={
              isCandidate
                ? { to: '/applications', label: 'All applications' }
                : { to: '/jobs/manage', label: 'All postings' }
            }
            empty={
              <EmptyState
                title={
                  isCandidate
                    ? myApplications.length === 0
                      ? 'No applications yet'
                      : 'No active applications'
                    : 'No active applications'
                }
              >
                {isCandidate
                  ? 'Open a role and send your first application; the stages will fill from there.'
                  : 'Applications will appear here as candidates send them.'}
              </EmptyState>
            }
          >
            {isCandidate ? (
              latestApplications.length === 0 ? (
                <EmptyState title="Nothing on file">
                  Apply to a role and it will appear here.
                </EmptyState>
              ) : (
                <ul className="row-list">
                  {latestApplications.map(({ application, job }) => (
                    <li className="row-item" key={application.id}>
                      <Link
                        to={`/jobs/${job.id}`}
                        className="group flex w-full items-center gap-3"
                      >
                        <CompanyMark name={job.companyName} />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[13px] font-medium group-hover:underline">
                            {job.title}
                          </p>
                          <p className="truncate text-[13px] text-muted">
                            {job.companyName} · Applied {relativeTime(application.appliedAt)}
                          </p>
                        </div>
                        <StatusPill status={application.status} />
                      </Link>
                    </li>
                  ))}
                </ul>
              )
            ) : waitingItems.length === 0 ? (
              <EmptyState title="Nothing waiting on a first review">
                Every current application has been opened.
              </EmptyState>
            ) : (
              <ul className="row-list">
                {waitingItems.map(({ application, job }) => (
                  <li className="row-item" key={application.id}>
                    <Link
                      to={`/jobs/${job.id}`}
                      className="group flex w-full items-center gap-3"
                    >
                      <Avatar name={application.candidateName} size="sm" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-medium group-hover:underline">
                          {application.candidateName}
                        </p>
                        <p className="truncate text-[13px] text-muted">{job.title}</p>
                      </div>
                      <span className="shrink-0 text-[13px] text-muted">
                        {waitingLabel(application.appliedAt)}
                      </span>
                      <ChevronRight size={15} aria-hidden="true" className="shrink-0 text-muted" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </PipelinePanel>
        </div>
        <div className="xl:col-span-4">
          <QuickActions
            actions={quickActions}
            footer={isCandidate ? profileFooter : undefined}
          />
        </div>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 xl:grid-cols-12">
        <div className="xl:col-span-7">
          <ActivityList
            activities={recentActivity}
            viewerId={user.id}
            scope={isCandidate ? 'Your activity' : 'Hiring activity'}
            footer={
              <Link
                to={isCandidate ? '/applications' : '/jobs/manage'}
                className="text-[13px] font-medium underline decoration-border underline-offset-2 hover:text-ink"
              >
                {isCandidate ? 'View applications' : 'View job postings'}
              </Link>
            }
          />
        </div>
        <div className="xl:col-span-5">
          <ClosingSoon
            jobs={closingSoon(openJobs)}
            totalOpen={openJobs.length}
            viewAll={
              isCandidate
                ? { to: '/jobs', label: 'Browse all jobs' }
                : { to: '/jobs/manage', label: 'All postings' }
            }
          />
        </div>
      </div>
    </>
  )
}

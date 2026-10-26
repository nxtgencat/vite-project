import { Suspense } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { Brand } from '../Brand'
import { CompanyMark } from '../ui/Avatar'

const PREVIEW_ROLES = [
  {
    title: 'Senior Frontend Engineer',
    company: 'Dooley, Kozey and Cronin',
    salary: '$120,000 – $150,000',
  },
  {
    title: 'Product Designer',
    company: 'Spinka - Dickinson',
    salary: '$95,000 – $120,000',
  },
  {
    title: 'Data Analyst',
    company: 'Graham - Gulgowski',
    salary: '$70,000 – $85,000',
  },
]

function AuthSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading the sign-in form" className="auth-center">
      <div className="skeleton" style={{ width: 220, height: 30 }} />
      <div className="skeleton mt-3" style={{ width: 300, maxWidth: '85%', height: 14 }} />
      <div className="skeleton mt-10" style={{ width: '100%', height: 38 }} />
      <div className="skeleton mt-5" style={{ width: '100%', height: 38 }} />
      <div className="skeleton mt-7" style={{ width: '100%', height: 40 }} />
    </div>
  )
}

export function AuthLayout() {
  return (
    <div className="auth-shell">
      <div className="auth-main">
        <Link to="/login" className="auth-brand" aria-label="Longlist home">
          <Brand />
        </Link>
        <Suspense fallback={<AuthSkeleton />}>
          <Outlet />
        </Suspense>
        <p className="text-[12px] text-faint">Longlist — a job portal demo. Data is stored on this device.</p>
      </div>
      <aside className="auth-aside" aria-label="About Longlist">
        <div className="auth-aside-inner">
          <p className="aside-statement">Every good hire starts with a long list.</p>
          <p className="aside-note">
            Companies, open roles and every application between them, in one ledger — for the people
            hiring and the people looking.
          </p>
          <div className="aside-list">
            {PREVIEW_ROLES.map((role) => (
              <div className="aside-job" key={role.title}>
                <CompanyMark name={role.company} />
                <div className="min-w-0 flex-1">
                  <p className="title">{role.title}</p>
                  <p className="meta">{role.company}</p>
                  <p className="meta num mt-0.5">{role.salary}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="aside-foot">
            <span>Open roles, one list</span>
            <span aria-hidden="true">·</span>
            <span>Applications, one place</span>
          </div>
        </div>
      </aside>
    </div>
  )
}

import {
  BarChart3,
  Bookmark,
  Briefcase,
  Building2,
  FileText,
  LayoutGrid,
  LogOut,
  Menu,
  Search,
  UserRound,
  X,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Suspense, useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAuth } from '../../context/auth-context'
import { screenLabel } from '../../lib/routes'
import type { Role } from '../../lib/types'
import { cx } from '../../lib/utils'
import { Brand, Logo } from '../Brand'
import { Avatar } from '../ui/Avatar'
import { PageSkeleton } from '../ui/PageSkeleton'

type NavItem = {
  to: string
  label: string
  icon: LucideIcon
  end?: boolean
  group?: string
}

const NAV: Record<Role, NavItem[]> = {
  candidate: [
    { to: '/', label: 'Overview', icon: LayoutGrid, end: true },
    { to: '/jobs', label: 'Find jobs', icon: Search },
    { to: '/saved-jobs', label: 'Saved jobs', icon: Bookmark },
    { to: '/applications', label: 'Applications', icon: FileText },
    { to: '/profile', label: 'Profile', icon: UserRound, group: 'Account' },
  ],
  recruiter: [
    { to: '/', label: 'Overview', icon: LayoutGrid, end: true },
    { to: '/companies', label: 'Companies', icon: Building2 },
    { to: '/jobs/manage', label: 'Job postings', icon: Briefcase },
    { to: '/reports', label: 'Reports', icon: BarChart3 },
  ],
}

export function AppShell() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [menuPath, setMenuPath] = useState<string | null>(null)
  const currentPath = `${location.pathname}${location.search}`
  const menuOpen = menuPath === currentPath

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuPath(null)
    }
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      document.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  if (!user) return null

  const items = NAV[user.role]
  const screenName = screenLabel(location.pathname)
  const profileLink = user.role === 'candidate' ? '/profile' : undefined

  const onLogout = () => {
    logout()
    toast.success('Signed out.')
    navigate('/login', { replace: true })
  }

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      {menuOpen && (
        <button
          type="button"
          className="menu-scrim is-open"
          aria-hidden="true"
          tabIndex={-1}
          onClick={() => setMenuPath(null)}
        />
      )}

      <aside id="app-sidebar" className={cx('sidebar', menuOpen && 'is-open')}>
        <div className="flex items-center justify-between gap-2">
          <Link to="/" aria-label="Longlist home" className="sidebar-brand">
            <Brand />
          </Link>
          <button
            type="button"
            className="menu-close h-8 w-8 items-center justify-center rounded text-muted hover:bg-raised hover:text-ink"
            aria-label="Close navigation"
            onClick={() => setMenuPath(null)}
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>
        <p className="scope">{user.role === 'recruiter' ? 'Hiring desk' : 'Candidate workspace'}</p>

        <nav aria-label="Primary" className="mt-2">
          <p className="nav-group-label">{user.role === 'recruiter' ? 'Hiring' : 'Find work'}</p>
          {items
            .filter((item) => !item.group)
            .map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) => cx('nav-item', isActive && 'font-medium')}
                >
                  <Icon aria-hidden="true" />
                  {item.label}
                </NavLink>
              )
            })}
          {items
            .filter((item) => item.group)
            .map((item) => {
              const Icon = item.icon
              return (
                <div key={item.to}>
                  <p className="nav-group-label">{item.group}</p>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) => cx('nav-item', isActive && 'font-medium')}
                  >
                    <Icon aria-hidden="true" />
                    {item.label}
                  </NavLink>
                </div>
              )
            })}
        </nav>

        <div className="sidebar-bottom">
          <div className="user-row">
            <Avatar name={user.name} size="sm" />
            <div className="who">
              <p className="name">{user.name}</p>
              <p className="role">{user.role === 'recruiter' ? 'Recruiter' : 'Candidate'}</p>
            </div>
            <button
              type="button"
              onClick={onLogout}
              className="inline-flex h-8 w-8 items-center justify-center rounded text-muted transition-colors hover:bg-raised hover:text-ink"
              aria-label="Log out"
              title="Log out"
            >
              <LogOut size={16} aria-hidden="true" />
            </button>
          </div>
        </div>
      </aside>

      <div className="min-w-0">
        <div className="mobile-topbar">
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded text-ink hover:bg-raised"
            aria-label="Open navigation"
            aria-expanded={menuOpen}
            aria-controls="app-sidebar"
            onClick={() => setMenuPath(currentPath)}
          >
            <Menu size={18} aria-hidden="true" />
          </button>
          <span className="inline-flex items-center text-ink" aria-hidden="true">
            <Logo size={18} />
          </span>
          <span className="screen-name">{screenName}</span>
          <span className="ml-auto">
            {profileLink ? (
              <Link to={profileLink} aria-label="Your profile">
                <Avatar name={user.name} size="sm" />
              </Link>
            ) : (
              <Avatar name={user.name} size="sm" />
            )}
          </span>
        </div>

        <main id="main" className="canvas" tabIndex={-1}>
          <Suspense fallback={<PageSkeleton />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  )
}

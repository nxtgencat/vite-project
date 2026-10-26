import { Link } from 'react-router-dom'
import { Brand } from '../components/Brand'
import { useAuth } from '../context/auth-context'
import { usePageTitle } from '../hooks/usePageTitle'

export default function NotFound() {
  usePageTitle('Page not found')
  const { user } = useAuth()

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-[720px] flex-col px-6 py-10">
      <Link to={user ? '/' : '/login'} aria-label="Longlist home">
        <Brand />
      </Link>
      <div className="my-auto py-16">
        <h1 className="page-title text-[32px] leading-[38px] tracking-[-0.03em]">Page not found</h1>
        <p className="page-sub mt-2">
          The address does not match a screen in Longlist. Check the link, or return to the list.
        </p>
        <Link to={user ? '/' : '/login'} className="btn primary lg mt-6">
          {user ? 'Back to overview' : 'Sign in'}
        </Link>
      </div>
    </main>
  )
}

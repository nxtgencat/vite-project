import { Navigate, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuth } from '../../context/auth-context'
import type { Role } from '../../lib/types'

type ProtectedRouteProps = {
  children: ReactNode
  role?: Role
}

export function ProtectedRoute({ children, role }: ProtectedRouteProps) {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: `${location.pathname}${location.search}` }}
      />
    )
  }

  if (role && user.role !== role) {
    return <Navigate to="/" replace />
  }

  return children
}

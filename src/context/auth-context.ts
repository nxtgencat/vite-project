import { createContext, useContext } from 'react'
import type { Role, SessionUser } from '../lib/types'

export type AuthResult = { ok: true } | { ok: false; message: string }

export type RegisterInput = {
  name: string
  email: string
  password: string
  role: Role
}

export type AuthValue = {
  user: SessionUser | null
  candidateAccounts: SessionUser[]
  login: (email: string, password: string) => AuthResult
  register: (input: RegisterInput) => AuthResult
  signInDemo: (role: Role) => boolean
  logout: () => void
  requestReset: (email: string) => void
}

export const AuthContext = createContext<AuthValue | null>(null)

export function useAuth() {
  const value = useContext(AuthContext)
  if (!value) throw new Error('useAuth must be used inside an AuthProvider')
  return value
}

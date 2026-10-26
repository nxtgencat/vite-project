import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { DEMO_ACCOUNTS, DEMO_PASSWORD } from '../lib/constants'
import { readStorage, removeStorage, STORAGE_KEYS, writeStorage } from '../lib/storage'
import type { AuthUser, Role, SessionUser } from '../lib/types'
import { newId } from '../lib/utils'
import { AuthContext, type AuthResult, type AuthValue, type RegisterInput } from './auth-context'

const SEED_USERS: AuthUser[] = [
  {
    id: 'user-candidate',
    name: DEMO_ACCOUNTS.candidate.name,
    email: DEMO_ACCOUNTS.candidate.email,
    role: 'candidate',
    password: DEMO_PASSWORD,
  },
  {
    id: 'user-recruiter',
    name: DEMO_ACCOUNTS.recruiter.name,
    email: DEMO_ACCOUNTS.recruiter.email,
    role: 'recruiter',
    password: DEMO_PASSWORD,
  },
]

const toPublic = (user: AuthUser): SessionUser => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
})

function initialUsers() {
  const stored = readStorage<AuthUser[]>(STORAGE_KEYS.users, [])
  const known = new Set(stored.map((user) => user.id))
  return [...stored, ...SEED_USERS.filter((user) => !known.has(user.id))]
}

function resolveSession(users: AuthUser[]) {
  const stored = readStorage<SessionUser | null>(STORAGE_KEYS.session, null)
  if (!stored) return null
  const match = users.find((user) => user.id === stored.id)
  return match ? toPublic(match) : null
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<AuthUser[]>(initialUsers)
  const [user, setUser] = useState<SessionUser | null>(() => resolveSession(initialUsers()))

  useEffect(() => {
    writeStorage(STORAGE_KEYS.users, users)
  }, [users])

  useEffect(() => {
    if (user) writeStorage(STORAGE_KEYS.session, user)
    else removeStorage(STORAGE_KEYS.session)
  }, [user])

  const login = useCallback(
    (email: string, password: string): AuthResult => {
      const normalised = email.trim().toLowerCase()
      const match = users.find((candidate) => candidate.email.toLowerCase() === normalised)
      if (!match || match.password !== password) {
        return { ok: false, message: 'Email or password is incorrect.' }
      }
      setUser(toPublic(match))
      return { ok: true }
    },
    [users],
  )

  const register = useCallback(
    ({ name, email, password, role }: RegisterInput): AuthResult => {
      const normalised = email.trim().toLowerCase()
      if (users.some((candidate) => candidate.email.toLowerCase() === normalised)) {
        return { ok: false, message: 'An account with this email already exists.' }
      }
      const account: AuthUser = {
        id: newId('user'),
        name: name.trim(),
        email: normalised,
        role,
        password,
      }
      setUsers((current) => [...current, account])
      setUser(toPublic(account))
      return { ok: true }
    },
    [users],
  )

  const signInDemo = useCallback((role: Role) => {
    const match = SEED_USERS.find((candidate) => candidate.role === role)
    if (!match) return false
    setUser(toPublic(match))
    return true
  }, [])

  const logout = useCallback(() => setUser(null), [])

  const requestReset = useCallback((_email: string) => {
    // Static authentication: the reset email is a UI state only.
  }, [])

  const candidateAccounts = useMemo(
    () => users.filter((account) => account.role === 'candidate').map(toPublic),
    [users],
  )

  const value: AuthValue = {
    user,
    candidateAccounts,
    login,
    register,
    signInDemo,
    logout,
    requestReset,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

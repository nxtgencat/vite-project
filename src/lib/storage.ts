export const STORAGE_KEYS = {
  users: 'longlist.users.v1',
  session: 'longlist.session.v1',
  companies: 'longlist.companies.v1',
  people: 'longlist.people.v1',
  directoryUpdated: 'longlist.directory-updated.v1',
  jobs: 'longlist.jobs.v1',
  applications: 'longlist.applications.v1',
  savedJobs: 'longlist.saved-jobs.v1',
  activities: 'longlist.activities.v1',
  profiles: 'longlist.profiles.v1',
} as const

export function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

export function writeStorage(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // A full or blocked localStorage should not stop the screen from working.
  }
}

export function removeStorage(key: string) {
  try {
    localStorage.removeItem(key)
  } catch {
    // Ignore storage errors in the demo.
  }
}

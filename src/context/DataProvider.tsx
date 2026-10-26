import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import {
  seedActivities,
  seedApplications,
  seedJobs,
  seedProfiles,
  seedSavedJobs,
} from '../data/seed'
import { daysUntil } from '../lib/format'
import {
  DIRECTORY_SNAPSHOT_AT,
  fetchDirectory,
  slugify,
  snapshotDirectory,
} from '../lib/directory'
import { readStorage, STORAGE_KEYS, writeStorage } from '../lib/storage'
import type {
  Activity,
  Application,
  CandidateProfile,
  Company,
  Job,
  Person,
  SavedJob,
} from '../lib/types'
import { newId } from '../lib/utils'
import { useAuth } from './auth-context'
import {
  DataContext,
  type CompanyInput,
  type DataValue,
  type DirectorySource,
  type DirectoryStatus,
  type JobInput,
  type ProfileInput,
  type Result,
} from './data-context'

const SNAPSHOT = snapshotDirectory()

function initialCompanies() {
  const stored = readStorage<Company[] | null>(STORAGE_KEYS.companies, null)
  return stored && stored.length > 0 ? stored : SNAPSHOT.companies
}

function initialPeople() {
  const stored = readStorage<Person[] | null>(STORAGE_KEYS.people, null)
  return stored && stored.length > 0 ? stored : SNAPSHOT.people
}

function initialSource(): DirectorySource {
  const stored = readStorage<Company[] | null>(STORAGE_KEYS.companies, null)
  return stored && stored.length > 0 ? 'cache' : 'snapshot'
}

export function DataProvider({ children }: { children: ReactNode }) {
  const { user, candidateAccounts } = useAuth()

  const [companies, setCompanies] = useState<Company[]>(initialCompanies)
  const [people, setPeople] = useState<Person[]>(initialPeople)
  const [directoryStatus, setDirectoryStatus] = useState<DirectoryStatus>('ready')
  const [directorySource, setDirectorySource] = useState<DirectorySource>(initialSource)
  const [directoryUpdatedAt, setDirectoryUpdatedAt] = useState<string | null>(
    () => readStorage<string | null>(STORAGE_KEYS.directoryUpdated, null) ?? DIRECTORY_SNAPSHOT_AT,
  )
  const [directoryError, setDirectoryError] = useState<string | null>(null)

  const [jobs, setJobs] = useState<Job[]>(
    () => readStorage<Job[] | null>(STORAGE_KEYS.jobs, null) ?? seedJobs(),
  )
  const [applications, setApplications] = useState<Application[]>(
    () => readStorage<Application[] | null>(STORAGE_KEYS.applications, null) ?? seedApplications(),
  )
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>(
    () => readStorage<SavedJob[] | null>(STORAGE_KEYS.savedJobs, null) ?? seedSavedJobs(),
  )
  const [activities, setActivities] = useState<Activity[]>(
    () => readStorage<Activity[] | null>(STORAGE_KEYS.activities, null) ?? seedActivities(),
  )
  const [profiles, setProfiles] = useState<Record<string, CandidateProfile>>(
    () => readStorage<Record<string, CandidateProfile> | null>(STORAGE_KEYS.profiles, null) ?? seedProfiles(),
  )

  const deletedRef = useRef<Set<string>>(
    new Set(readStorage<string[]>(STORAGE_KEYS.deletedCompanies, [])),
  )
  const startedRef = useRef(false)

  useEffect(() => writeStorage(STORAGE_KEYS.companies, companies), [companies])
  useEffect(() => writeStorage(STORAGE_KEYS.people, people), [people])
  useEffect(
    () => writeStorage(STORAGE_KEYS.directoryUpdated, directoryUpdatedAt),
    [directoryUpdatedAt],
  )
  useEffect(() => writeStorage(STORAGE_KEYS.jobs, jobs), [jobs])
  useEffect(() => writeStorage(STORAGE_KEYS.applications, applications), [applications])
  useEffect(() => writeStorage(STORAGE_KEYS.savedJobs, savedJobs), [savedJobs])
  useEffect(() => writeStorage(STORAGE_KEYS.activities, activities), [activities])
  useEffect(() => writeStorage(STORAGE_KEYS.profiles, profiles), [profiles])

  const refreshDirectory = useCallback(async () => {
    setDirectoryStatus('refreshing')
    setDirectoryError(null)
    try {
      const live = await fetchDirectory()
      setCompanies((current) => {
        const existing = new Map(current.map((company) => [company.id, company]))
        const directory = live.companies
          .filter((company) => !deletedRef.current.has(company.id))
          .map((company) => {
            const local = existing.get(company.id)
            return local?.edited ? local : company
          })
        const custom = current.filter((company) => company.origin === 'custom')
        return [...directory, ...custom].sort((a, b) => a.name.localeCompare(b.name))
      })
      setPeople(live.people)
      setDirectorySource('api')
      setDirectoryUpdatedAt(new Date().toISOString())
      setDirectoryStatus('ready')
    } catch {
      setDirectoryStatus('error')
      setDirectoryError('Live directory unavailable. Showing the saved directory instead.')
    }
  }, [])

  useEffect(() => {
    if (startedRef.current) return
    startedRef.current = true
    void refreshDirectory()
  }, [refreshDirectory])

  const pushActivity = useCallback(
    (kind: Activity['kind'], text: string) => {
      if (!user) return
      const activity: Activity = {
        id: newId('activity'),
        actorId: user.id,
        actorName: user.name,
        kind,
        text,
        at: new Date().toISOString(),
      }
      setActivities((current) => [activity, ...current].slice(0, 40))
    },
    [user],
  )

  const addCompany = useCallback(
    (input: CompanyInput) => {
      const base = slugify(input.name) || newId('company')
      const taken = new Set(companies.map((company) => company.id))
      let id = base
      let suffix = 2
      while (taken.has(id)) {
        id = `${base}-${suffix}`
        suffix += 1
      }
      const company: Company = { ...input, id, origin: 'custom' }
      setCompanies((current) => [...current, company].sort((a, b) => a.name.localeCompare(b.name)))
      pushActivity('company', `${user?.name ?? 'You'} added ${company.name} to the directory.`)
      return company
    },
    [companies, pushActivity, user],
  )

  const updateCompany = useCallback(
    (id: string, input: CompanyInput) => {
      setCompanies((current) =>
        current.map((company) =>
          company.id === id
            ? {
                ...company,
                ...input,
                edited: company.origin === 'directory' ? true : company.edited,
              }
            : company,
        ),
      )
      setJobs((current) =>
        current.map((job) =>
          job.companyId === id ? { ...job, companyName: input.name } : job,
        ),
      )
    },
    [],
  )

  const deleteCompany = useCallback(
    (id: string) => {
      const target = companies.find((company) => company.id === id)
      setCompanies((current) => current.filter((company) => company.id !== id))
      if (target?.origin === 'directory') {
        deletedRef.current.add(id)
        writeStorage(STORAGE_KEYS.deletedCompanies, [...deletedRef.current])
      }
      if (target) pushActivity('company', `${user?.name ?? 'You'} removed ${target.name} from the directory.`)
    },
    [companies, pushActivity, user],
  )

  const addJob = useCallback(
    (input: JobInput) => {
      if (!user) throw new Error('Sign in to post a job.')
      const job: Job = {
        ...input,
        id: newId('job'),
        createdAt: new Date().toISOString(),
        postedBy: user.id,
      }
      setJobs((current) => [job, ...current])
      pushActivity('job', `${user.name} posted ${job.title} at ${job.companyName}.`)
      return job
    },
    [pushActivity, user],
  )

  const updateJob = useCallback((id: string, input: JobInput) => {
    setJobs((current) =>
      current.map((job) => (job.id === id ? { ...job, ...input } : job)),
    )
  }, [])

  const deleteJob = useCallback(
    (id: string) => {
      const target = jobs.find((job) => job.id === id)
      setJobs((current) => current.filter((job) => job.id !== id))
      setApplications((current) => current.filter((application) => application.jobId !== id))
      setSavedJobs((current) => current.filter((saved) => saved.jobId !== id))
      if (target) pushActivity('job', `${user?.name ?? 'You'} removed ${target.title} from the board.`)
    },
    [jobs, pushActivity, user],
  )

  const applyToJob = useCallback(
    (jobId: string): Result => {
      if (!user || user.role !== 'candidate') {
        return { ok: false, message: 'Only candidates can apply to a role.' }
      }
      const job = jobs.find((entry) => entry.id === jobId)
      if (!job) return { ok: false, message: 'This role is no longer on the board.' }
      if (job.status === 'Closed' || daysUntil(job.deadline) < 0) {
        return { ok: false, message: 'This role is closed.' }
      }
      if (
        applications.some(
          (application) =>
            application.jobId === jobId && application.candidateId === user.id,
        )
      ) {
        return { ok: false, message: 'You have already applied to this role.' }
      }

      const profile = profiles[user.id]
      const application: Application = {
        id: newId('application'),
        jobId,
        candidateId: user.id,
        candidateName: profile?.fullName ?? user.name,
        candidateEmail: profile?.email ?? user.email,
        candidateTitle: profile?.skills.slice(0, 2).join(' · ') || 'Candidate',
        status: 'Applied',
        appliedAt: new Date().toISOString(),
      }
      setApplications((current) => [application, ...current])
      pushActivity('application', `${user.name} applied to ${job.title} at ${job.companyName}.`)
      return { ok: true, message: 'Application sent.' }
    },
    [applications, jobs, profiles, pushActivity, user],
  )

  const withdrawApplication = useCallback(
    (applicationId: string) => {
      if (!user) return
      const application = applications.find(
        (entry) => entry.id === applicationId && entry.candidateId === user.id,
      )
      if (!application) return
      setApplications((current) =>
        current.map((entry) =>
          entry.id === applicationId ? { ...entry, status: 'Withdrawn' } : entry,
        ),
      )
      const job = jobs.find((entry) => entry.id === application.jobId)
      pushActivity(
        'application',
        `${user.name} withdrew an application${job ? ` for ${job.title}` : ''}.`,
      )
    },
    [applications, jobs, pushActivity, user],
  )

  const toggleSavedJob = useCallback(
    (jobId: string) => {
      if (!user || user.role !== 'candidate') return false
      const existing = savedJobs.find(
        (saved) => saved.jobId === jobId && saved.candidateId === user.id,
      )
      if (existing) {
        setSavedJobs((current) =>
          current.filter(
            (saved) => !(saved.jobId === jobId && saved.candidateId === user.id),
          ),
        )
        return false
      }
      setSavedJobs((current) => [
        ...current,
        { jobId, candidateId: user.id, savedAt: new Date().toISOString() },
      ])
      const job = jobs.find((entry) => entry.id === jobId)
      if (job) pushActivity('saved', `${user.name} saved ${job.title} at ${job.companyName}.`)
      return true
    },
    [jobs, pushActivity, savedJobs, user],
  )

  const isJobSaved = useCallback(
    (jobId: string) =>
      Boolean(
        user &&
          savedJobs.some(
            (saved) => saved.jobId === jobId && saved.candidateId === user.id,
          ),
      ),
    [savedJobs, user],
  )

  const saveProfile = useCallback(
    (input: ProfileInput) => {
      if (!user) return
      const existing = profiles[user.id]
      const next: CandidateProfile = {
        ...input,
        userId: user.id,
        updatedAt: new Date().toISOString(),
      }
      setProfiles((current) => ({ ...current, [user.id]: next }))
      pushActivity('profile', existing ? 'Profile details updated.' : 'Profile created.')
    },
    [profiles, pushActivity, user],
  )

  const candidateCount = useMemo(() => {
    const known = new Set(people.map((person) => person.email.toLowerCase()))
    const extras = candidateAccounts.filter(
      (account) => !known.has(account.email.toLowerCase()),
    ).length
    return people.length + extras
  }, [candidateAccounts, people])

  const profile = user ? profiles[user.id] ?? null : null

  const value: DataValue = {
    companies,
    people,
    jobs,
    applications,
    savedJobs,
    activities,
    profiles,
    profile,
    candidateCount,
    directoryStatus,
    directorySource,
    directoryUpdatedAt,
    directoryError,
    refreshDirectory,
    addCompany,
    updateCompany,
    deleteCompany,
    addJob,
    updateJob,
    deleteJob,
    applyToJob,
    withdrawApplication,
    toggleSavedJob,
    isJobSaved,
    saveProfile,
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

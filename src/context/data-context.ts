import { createContext, useContext } from 'react'
import type {
  Activity,
  Application,
  CandidateProfile,
  Company,
  Job,
  Person,
  SavedJob,
} from '../lib/types'

export type DirectoryStatus = 'ready' | 'refreshing' | 'error'
export type DirectorySource = 'snapshot' | 'cache' | 'api'

export type CompanyInput = Omit<Company, 'id' | 'origin' | 'edited'>
export type JobInput = Omit<Job, 'id' | 'createdAt' | 'postedBy'>
export type ProfileInput = Omit<CandidateProfile, 'userId' | 'updatedAt'>

export type Result = { ok: boolean; message: string }

export type DataValue = {
  companies: Company[]
  people: Person[]
  jobs: Job[]
  applications: Application[]
  savedJobs: SavedJob[]
  activities: Activity[]
  profiles: Record<string, CandidateProfile>
  profile: CandidateProfile | null
  candidateCount: number
  directoryStatus: DirectoryStatus
  directorySource: DirectorySource
  directoryUpdatedAt: string | null
  directoryError: string | null
  refreshDirectory: () => Promise<void>
  addCompany: (input: CompanyInput) => Company
  updateCompany: (id: string, input: CompanyInput) => void
  deleteCompany: (id: string) => void
  addJob: (input: JobInput) => Job
  updateJob: (id: string, input: JobInput) => void
  deleteJob: (id: string) => void
  applyToJob: (jobId: string) => Result
  withdrawApplication: (applicationId: string) => void
  toggleSavedJob: (jobId: string) => boolean
  isJobSaved: (jobId: string) => boolean
  saveProfile: (input: ProfileInput) => void
}

export const DataContext = createContext<DataValue | null>(null)

export function useData() {
  const value = useContext(DataContext)
  if (!value) throw new Error('useData must be used inside a DataProvider')
  return value
}

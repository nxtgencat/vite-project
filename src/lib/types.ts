export type Role = 'candidate' | 'recruiter'

export type AuthUser = {
  id: string
  name: string
  email: string
  role: Role
  password: string
}

export type SessionUser = Omit<AuthUser, 'password'>

export type Company = {
  id: string
  name: string
  industry: string
  location: string
  website: string
  email: string
  employees: number
  description: string
  logo?: string
  origin: 'directory' | 'custom'
  edited?: boolean
}

export type Person = {
  id: string
  name: string
  email: string
  title: string
  location: string
}

export type Directory = {
  companies: Company[]
  people: Person[]
}

export type JobStatus = 'Open' | 'Closed'

export type Job = {
  id: string
  title: string
  companyId: string
  companyName: string
  category: string
  employmentType: string
  experienceLevel: string
  salaryMin: number
  salaryMax: number
  location: string
  skills: string[]
  deadline: string
  status: JobStatus
  description: string
  postedBy: string
  createdAt: string
}

export type ApplicationStatus =
  | 'Applied'
  | 'In review'
  | 'Interview'
  | 'Offer'
  | 'Rejected'
  | 'Withdrawn'

export type Application = {
  id: string
  jobId: string
  candidateId: string
  candidateName: string
  candidateEmail: string
  candidateTitle: string
  status: ApplicationStatus
  appliedAt: string
}

export type SavedJob = {
  jobId: string
  candidateId: string
  savedAt: string
}

export type CandidateProfile = {
  userId: string
  fullName: string
  email: string
  mobile: string
  address: string
  skills: string[]
  experience: string
  education: string
  resumeName: string
  photo?: string
  updatedAt: string
}

export type ActivityKind = 'application' | 'job' | 'company' | 'profile' | 'saved'

export type Activity = {
  id: string
  actorId: string
  actorName: string
  kind: ActivityKind
  text: string
  at: string
}

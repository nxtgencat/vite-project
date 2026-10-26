export const INDUSTRIES = [
  'Software',
  'Design',
  'Customer support',
  'Research',
  'Human resources',
  'Product',
  'Marketing',
  'Finance',
  'Consulting',
  'Legal',
  'Sales',
  'Education',
  'Healthcare',
  'Logistics',
  'Media',
] as const

export const JOB_CATEGORIES = [
  'Software',
  'Design',
  'Analytics',
  'Marketing',
  'Operations',
  'Finance',
  'Customer support',
  'Media',
  'Human resources',
  'Sales',
] as const

export const EMPLOYMENT_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship'] as const

export const EXPERIENCE_LEVELS = ['Junior', 'Mid', 'Senior', 'Lead'] as const

export const SALARY_BANDS = [
  { id: 'any', label: 'Any salary', min: 0, max: Number.POSITIVE_INFINITY },
  { id: 'under-60', label: 'Under $60,000', min: 0, max: 60_000 },
  { id: '60-90', label: '$60,000 – $90,000', min: 60_000, max: 90_000 },
  { id: '90-120', label: '$90,000 – $120,000', min: 90_000, max: 120_000 },
  { id: '120-plus', label: '$120,000 and above', min: 120_000, max: Number.POSITIVE_INFINITY },
] as const

export const APPLICATION_STATUSES = [
  'Applied',
  'In review',
  'Interview',
  'Offer',
  'Rejected',
  'Withdrawn',
] as const

export const DEMO_PASSWORD = 'demo1234'

export const DEMO_ACCOUNTS = {
  candidate: { email: 'maya@longlist.co', name: 'Maya Iyer' },
  recruiter: { email: 'devon@longlist.co', name: 'Devon Marsh' },
} as const

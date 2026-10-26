import axios from 'axios'
import snapshot from '../data/directory.snapshot.json'
import { formatSalary, hashString } from './format'
import type { Company, Directory, Person } from './types'

export const DIRECTORY_ENDPOINT = 'https://dummyjson.com/users'
export const DIRECTORY_SNAPSHOT_AT: string = snapshot.fetchedAt

export type DirectoryUser = {
  id: number
  firstName: string
  lastName: string
  email: string
  city: string
  company: {
    name: string
    department: string
    title: string
    city: string
    country: string
  }
}

type DummyUsersResponse = {
  users: DirectoryUser[]
  total: number
  skip: number
  limit: number
}

const INDUSTRY_BY_DEPARTMENT: Record<string, string> = {
  Engineering: 'Software',
  Support: 'Customer support',
  'Research and Development': 'Research',
  'Human Resources': 'Human resources',
  'Product Management': 'Product',
  Marketing: 'Marketing',
  Accounting: 'Finance',
  Services: 'Consulting',
  Legal: 'Legal',
  Sales: 'Sales',
  Training: 'Education',
}

const DESCRIPTION_BY_INDUSTRY: Record<string, string> = {
  Software:
    'Builds web platforms and internal tools for mid-sized companies. Product, design and engineering work in the same two-week cycle.',
  Design:
    'A studio for product research, interface design and design systems. Work is organised in small teams, one client at a time.',
  'Customer support':
    'Handles customer conversations for subscription businesses. The team runs a shared queue and writes its own help content.',
  Research:
    'Runs applied research programmes for product teams. Findings are published internally every quarter.',
  'Human resources':
    'Supports growing companies with hiring, onboarding and the people operations that follow.',
  Product:
    'Turns customer research into product bets, then works with engineering to ship and measure them.',
  Marketing:
    'Runs brand, content and lifecycle marketing for companies in the middle of a growth push.',
  Finance:
    'Handles planning, reporting and compliance for companies that have outgrown a spreadsheet.',
  Consulting:
    'A small consulting practice working with operations teams on process, systems and change.',
  Legal: 'Advises growing companies on contracts, employment and the compliance work around both.',
  Sales:
    'Builds and runs revenue teams for business-to-business products, from first outbound to renewal.',
  Education:
    'Designs learning programmes and the materials that go with them, for schools and employers.',
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function employeesFor(name: string) {
  const raw = 20 + (hashString(name) % 380)
  return Math.round(raw / 5) * 5
}

function descriptionFor(name: string, industry: string, city: string, employees: number) {
  const line = DESCRIPTION_BY_INDUSTRY[industry] ?? DESCRIPTION_BY_INDUSTRY.Consulting
  return `${name} is a ${employees}-person ${industry.toLowerCase()} company in ${city}. ${line}`
}

export function mapDirectory(users: DirectoryUser[]): Directory {
  const companies = new Map<string, Company>()
  const people: Person[] = []

  for (const user of users) {
    const { company } = user
    if (!company?.name) continue

    if (!companies.has(company.name)) {
      const industry = INDUSTRY_BY_DEPARTMENT[company.department] ?? 'Consulting'
      const slug = slugify(company.name)
      const employees = employeesFor(company.name)
      const domain = `${slug.replace(/-/g, '')}.co`
      companies.set(company.name, {
        id: slug,
        name: company.name,
        industry,
        location: company.city,
        website: `https://${domain}`,
        email: `talent@${domain}`,
        employees,
        description: descriptionFor(company.name, industry, company.city, employees),
        origin: 'directory',
      })
    }

    people.push({
      id: `p-${user.id}`,
      name: `${user.firstName} ${user.lastName}`.trim(),
      email: user.email,
      title: company.title,
      location: user.city,
    })
  }

  return {
    companies: [...companies.values()].sort((a, b) => a.name.localeCompare(b.name)),
    people,
  }
}

export async function fetchDirectory(): Promise<Directory> {
  const response = await axios.get<DummyUsersResponse>(DIRECTORY_ENDPOINT, {
    params: { limit: 30 },
    timeout: 10_000,
    headers: { Accept: 'application/json' },
  })
  if (!Array.isArray(response.data?.users) || response.data.users.length === 0) {
    throw new Error('The directory returned no companies.')
  }
  return mapDirectory(response.data.users)
}

export function snapshotDirectory(): Directory {
  return mapDirectory(snapshot.users as DirectoryUser[])
}

export function salaryRangeLabel(min: number, max: number) {
  return formatSalary(min, max)
}

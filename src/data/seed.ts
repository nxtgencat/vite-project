import { daysFromNow } from '../lib/format'
import type { Activity, Application, CandidateProfile, Job, SavedJob } from '../lib/types'

type PersonSeed = {
  id: string
  name: string
  email: string
  title: string
}

const CANDIDATES: Record<string, PersonSeed> = {
  maya: {
    id: 'user-candidate',
    name: 'Maya Iyer',
    email: 'maya@longlist.co',
    title: 'Frontend engineer',
  },
  emily: {
    id: 'p-1',
    name: 'Emily Johnson',
    email: 'emily.johnson@x.dummyjson.com',
    title: 'Sales Manager',
  },
  sophia: {
    id: 'p-3',
    name: 'Sophia Brown',
    email: 'sophia.brown@x.dummyjson.com',
    title: 'Research and Development Manager',
  },
  james: {
    id: 'p-4',
    name: 'James Davis',
    email: 'james.davis@x.dummyjson.com',
    title: 'Support Specialist',
  },
  olivia: {
    id: 'p-5',
    name: 'Olivia Wilson',
    email: 'olivia.wilson@x.dummyjson.com',
    title: 'Product Manager',
  },
  ava: {
    id: 'p-8',
    name: 'Ava Taylor',
    email: 'ava.taylor@x.dummyjson.com',
    title: 'Marketing Coordinator',
  },
  isabella: {
    id: 'p-10',
    name: 'Isabella Anderson',
    email: 'isabella.anderson@x.dummyjson.com',
    title: 'Marketing Manager',
  },
  liam: {
    id: 'p-11',
    name: 'Liam Garcia',
    email: 'liam.garcia@x.dummyjson.com',
    title: 'Services Lead',
  },
  mia: {
    id: 'p-12',
    name: 'Mia Rodriguez',
    email: 'mia.rodriguez@x.dummyjson.com',
    title: 'Accountant',
  },
  noah: {
    id: 'p-13',
    name: 'Noah Hernandez',
    email: 'noah.hernandez@x.dummyjson.com',
    title: 'Engineer',
  },
  charlotte: {
    id: 'p-14',
    name: 'Charlotte Lopez',
    email: 'charlotte.lopez@x.dummyjson.com',
    title: 'Accountant',
  },
  william: {
    id: 'p-15',
    name: 'William Gonzalez',
    email: 'william.gonzalez@x.dummyjson.com',
    title: 'Marketing Specialist',
  },
  evelynS: {
    id: 'p-17',
    name: 'Evelyn Sanchez',
    email: 'evelyn.sanchez@x.dummyjson.com',
    title: 'Support Specialist',
  },
  logan: {
    id: 'p-18',
    name: 'Logan Torres',
    email: 'logan.torres@x.dummyjson.com',
    title: 'Training Coordinator',
  },
  abigail: {
    id: 'p-19',
    name: 'Abigail Rivera',
    email: 'abigail.rivera@x.dummyjson.com',
    title: 'People Operations Partner',
  },
  jackson: {
    id: 'p-20',
    name: 'Jackson Evans',
    email: 'jackson.evans@x.dummyjson.com',
    title: 'Legal Counsel',
  },
  chloe: {
    id: 'p-23',
    name: 'Chloe Morales',
    email: 'chloe.morales@x.dummyjson.com',
    title: 'Sales Lead',
  },
  mateo: {
    id: 'p-24',
    name: 'Mateo Nguyen',
    email: 'mateo.nguyen@x.dummyjson.com',
    title: 'Accountant',
  },
  harper: {
    id: 'p-25',
    name: 'Harper Kelly',
    email: 'harper.kelly@x.dummyjson.com',
    title: 'Legal Analyst',
  },
  evelynG: {
    id: 'p-26',
    name: 'Evelyn Gonzalez',
    email: 'evelyn.gonzalez@x.dummyjson.com',
    title: 'Accounting Manager',
  },
  daniel: {
    id: 'p-27',
    name: 'Daniel Cook',
    email: 'daniel.cook@x.dummyjson.com',
    title: 'Support Engineer',
  },
  henry: {
    id: 'p-29',
    name: 'Henry Hill',
    email: 'henry.hill@x.dummyjson.com',
    title: 'Services Engineer',
  },
}

export function seedJobs(): Job[] {
  return [
    {
      id: 'job-1',
      title: 'Senior Frontend Engineer',
      companyId: 'dooley-kozey-and-cronin',
      companyName: 'Dooley, Kozey and Cronin',
      category: 'Software',
      employmentType: 'Full-time',
      experienceLevel: 'Senior',
      salaryMin: 120_000,
      salaryMax: 150_000,
      location: 'San Francisco',
      skills: ['React', 'TypeScript', 'Design systems', 'Accessibility'],
      deadline: daysFromNow(18),
      status: 'Open',
      description:
        'Own the component layer behind a customer-facing analytics product used by operations teams. The work sits between design and product: turn a rough interaction into a tested, accessible interface, then keep it fast as the surface grows.\n\nThe team ships in two-week cycles and keeps the design system in the same repository as the product.',
      postedBy: 'user-recruiter',
      createdAt: daysFromNow(-2),
    },
    {
      id: 'job-2',
      title: 'Product Designer',
      companyId: 'spinka-dickinson',
      companyName: 'Spinka - Dickinson',
      category: 'Design',
      employmentType: 'Full-time',
      experienceLevel: 'Mid',
      salaryMin: 95_000,
      salaryMax: 120_000,
      location: 'Los Angeles',
      skills: ['Figma', 'Prototyping', 'User research', 'Design systems'],
      deadline: daysFromNow(8),
      status: 'Open',
      description:
        'Shape two product areas from first questions to shipped screens: a scheduling flow and the workspace that admins use every day. You will run the research, draw the flows and work beside two engineers who build them.\n\nThe design team is four people; critiques happen twice a week and decisions are written down.',
      postedBy: 'user-recruiter',
      createdAt: daysFromNow(-3),
    },
    {
      id: 'job-3',
      title: 'Data Analyst',
      companyId: 'graham-gulgowski',
      companyName: 'Graham - Gulgowski',
      category: 'Analytics',
      employmentType: 'Contract',
      experienceLevel: 'Junior',
      salaryMin: 70_000,
      salaryMax: 85_000,
      location: 'San Antonio',
      skills: ['SQL', 'Python', 'Looker', 'Experimentation'],
      deadline: daysFromNow(12),
      status: 'Open',
      description:
        'Build the reporting layer for a services business that has grown faster than its spreadsheets. Work with the operations lead to define one dashboard per team, then keep the definitions honest.\n\nThe contract runs for nine months with a review at six.',
      postedBy: 'user-recruiter',
      createdAt: daysFromNow(-4),
    },
    {
      id: 'job-4',
      title: 'Backend Engineer',
      companyId: 'pfannerstill-inc',
      companyName: 'Pfannerstill Inc',
      category: 'Software',
      employmentType: 'Full-time',
      experienceLevel: 'Mid',
      salaryMin: 110_000,
      salaryMax: 135_000,
      location: 'Remote',
      skills: ['Node.js', 'PostgreSQL', 'AWS', 'API design'],
      deadline: daysFromNow(21),
      status: 'Open',
      description:
        'Extend the services behind a scheduling product used by field teams. The role owns the API between the mobile client and the booking engine, and the migrations that keep both honest.\n\nOn-call is one week in six, with a written runbook and a second engineer on the rotation.',
      postedBy: 'user-recruiter',
      createdAt: daysFromNow(-5),
    },
    {
      id: 'job-5',
      title: 'Marketing Manager',
      companyId: 'dickens-beahan',
      companyName: 'Dickens - Beahan',
      category: 'Marketing',
      employmentType: 'Full-time',
      experienceLevel: 'Lead',
      salaryMin: 90_000,
      salaryMax: 110_000,
      location: 'Washington',
      skills: ['Content', 'Brand', 'SEO', 'Campaigns'],
      deadline: daysFromNow(15),
      status: 'Open',
      description:
        'Lead a three-person marketing team through a year of launches. The role owns positioning, the content calendar and the numbers behind both, and works directly with the founders on pricing and customer stories.\n\nYou will inherit a clean brand system and a website that needs fewer pages, not more.',
      postedBy: 'user-recruiter',
      createdAt: daysFromNow(-6),
    },
    {
      id: 'job-6',
      title: 'Customer Success Lead',
      companyId: 'pollich-hilpert',
      companyName: 'Pollich - Hilpert',
      category: 'Customer support',
      employmentType: 'Full-time',
      experienceLevel: 'Mid',
      salaryMin: 65_000,
      salaryMax: 80_000,
      location: 'San Diego',
      skills: ['Onboarding', 'Retention', 'SaaS', 'Communication'],
      deadline: daysFromNow(9),
      status: 'Open',
      description:
        'Own the first ninety days of every new account and the health of the ones that follow. The role works with support and product to turn repeated questions into docs, fixes and better onboarding.\n\nThe team handles around forty accounts, with two support specialists beside you.',
      postedBy: 'user-recruiter',
      createdAt: daysFromNow(-7),
    },
    {
      id: 'job-7',
      title: 'Operations Coordinator',
      companyId: 'langworth-group',
      companyName: 'Langworth Group',
      category: 'Operations',
      employmentType: 'Part-time',
      experienceLevel: 'Junior',
      salaryMin: 40_000,
      salaryMax: 50_000,
      location: 'Washington',
      skills: ['Scheduling', 'Vendor management', 'Excel', 'Documentation'],
      deadline: daysFromNow(-5),
      status: 'Closed',
      description:
        'Keep a small field operation moving: schedules, suppliers and the paperwork that connects them. This role supports two project managers and owns the weekly reporting pack.\n\nThe posting closed after the current round of interviews.',
      postedBy: 'user-recruiter',
      createdAt: daysFromNow(-18),
    },
    {
      id: 'job-8',
      title: 'Finance Associate',
      companyId: 'grady-llc',
      companyName: 'Grady LLC',
      category: 'Finance',
      employmentType: 'Full-time',
      experienceLevel: 'Junior',
      salaryMin: 62_000,
      salaryMax: 75_000,
      location: 'Houston',
      skills: ['Forecasting', 'Excel', 'Reporting', 'Accounting'],
      deadline: daysFromNow(24),
      status: 'Open',
      description:
        'Support the monthly close, the rolling forecast and the reporting that goes to the board. You will own two cost centres and work with a controller who has built the process from scratch before.\n\nThe team is six people and the office is in downtown Houston.',
      postedBy: 'user-recruiter',
      createdAt: daysFromNow(-8),
    },
    {
      id: 'job-9',
      title: 'Staff Engineer',
      companyId: 'mayer-smitham',
      companyName: 'Mayer - Smitham',
      category: 'Software',
      employmentType: 'Full-time',
      experienceLevel: 'Lead',
      salaryMin: 165_000,
      salaryMax: 195_000,
      location: 'Remote',
      skills: ['Architecture', 'Node.js', 'PostgreSQL', 'Mentoring'],
      deadline: daysFromNow(30),
      status: 'Open',
      description:
        'Set the technical direction for a platform that has reached its first thousand customers. The role is hands-on: one large design a quarter, code review and mentoring for a team of eight.\n\nThe company is remote across US time zones and writes its decisions down.',
      postedBy: 'user-recruiter',
      createdAt: daysFromNow(-10),
    },
    {
      id: 'job-10',
      title: 'Content Strategist',
      companyId: 'tromp-gaylord-and-weber',
      companyName: 'Tromp, Gaylord and Weber',
      category: 'Media',
      employmentType: 'Contract',
      experienceLevel: 'Mid',
      salaryMin: 55_000,
      salaryMax: 70_000,
      location: 'Remote',
      skills: ['Editorial', 'Content strategy', 'SEO', 'Interviewing'],
      deadline: daysFromNow(6),
      status: 'Open',
      description:
        'Own the editorial calendar for a publication that covers how small companies work. The role commissions, edits and writes, with two freelance contributors and a designer beside you.\n\nThis is a six-month contract with the option to extend.',
      postedBy: 'user-recruiter',
      createdAt: daysFromNow(-12),
    },
    {
      id: 'job-11',
      title: 'UX Researcher',
      companyId: 'schiller-zieme',
      companyName: 'Schiller - Zieme',
      category: 'Design',
      employmentType: 'Part-time',
      experienceLevel: 'Mid',
      salaryMin: 60_000,
      salaryMax: 75_000,
      location: 'Dallas',
      skills: ['Interviews', 'Usability testing', 'Synthesis', 'Research ops'],
      deadline: daysFromNow(18),
      status: 'Open',
      description:
        'Run the research programme for a product team rebuilding its admin experience. The work covers interviews, usability tests and the repository that keeps every finding findable.\n\nThree days a week, with the team in Dallas on Tuesdays.',
      postedBy: 'user-recruiter',
      createdAt: daysFromNow(-14),
    },
    {
      id: 'job-12',
      title: 'QA Engineer',
      companyId: 'pagac-and-sons',
      companyName: 'Pagac and Sons',
      category: 'Software',
      employmentType: 'Internship',
      experienceLevel: 'Junior',
      salaryMin: 38_000,
      salaryMax: 48_000,
      location: 'Fort Worth',
      skills: ['Manual testing', 'Playwright', 'Bug reporting', 'JavaScript'],
      deadline: daysFromNow(27),
      status: 'Open',
      description:
        'Join a quality team for a six-month internship on a scheduling product. You will write test plans, run them against real customer workflows and leave with a portfolio of bugs you found and fixed.\n\nMentorship is part of the role; no commercial test experience is required.',
      postedBy: 'user-recruiter',
      createdAt: daysFromNow(-16),
    },
  ]
}

type ApplicationSeed = {
  key: keyof typeof CANDIDATES
  jobId: string
  status: Application['status']
  daysAgo: number
  hour?: number
}

const APPLICATION_SEEDS: ApplicationSeed[] = [
  { key: 'maya', jobId: 'job-1', status: 'Interview', daysAgo: 5, hour: 9 },
  { key: 'maya', jobId: 'job-2', status: 'In review', daysAgo: 3 },
  { key: 'maya', jobId: 'job-3', status: 'Rejected', daysAgo: 40 },
  { key: 'maya', jobId: 'job-11', status: 'Applied', daysAgo: 0, hour: 11 },
  { key: 'emily', jobId: 'job-1', status: 'In review', daysAgo: 0, hour: 9 },
  { key: 'noah', jobId: 'job-1', status: 'Applied', daysAgo: 1 },
  { key: 'mia', jobId: 'job-1', status: 'Applied', daysAgo: 9 },
  { key: 'charlotte', jobId: 'job-2', status: 'Applied', daysAgo: 12 },
  { key: 'chloe', jobId: 'job-2', status: 'Interview', daysAgo: 20 },
  { key: 'sophia', jobId: 'job-3', status: 'Applied', daysAgo: 30 },
  { key: 'james', jobId: 'job-4', status: 'Applied', daysAgo: 2 },
  { key: 'liam', jobId: 'job-4', status: 'Applied', daysAgo: 8 },
  { key: 'mateo', jobId: 'job-4', status: 'Offer', daysAgo: 45 },
  { key: 'ava', jobId: 'job-5', status: 'In review', daysAgo: 6 },
  { key: 'olivia', jobId: 'job-5', status: 'Applied', daysAgo: 15 },
  { key: 'isabella', jobId: 'job-6', status: 'Applied', daysAgo: 4 },
  { key: 'evelynS', jobId: 'job-6', status: 'Interview', daysAgo: 25 },
  { key: 'logan', jobId: 'job-7', status: 'Withdrawn', daysAgo: 70 },
  { key: 'william', jobId: 'job-8', status: 'Applied', daysAgo: 18 },
  { key: 'harper', jobId: 'job-8', status: 'In review', daysAgo: 33 },
  { key: 'henry', jobId: 'job-9', status: 'Applied', daysAgo: 7 },
  { key: 'evelynG', jobId: 'job-10', status: 'Offer', daysAgo: 60 },
  { key: 'abigail', jobId: 'job-5', status: 'In review', daysAgo: 90 },
  { key: 'jackson', jobId: 'job-8', status: 'Rejected', daysAgo: 120 },
  { key: 'daniel', jobId: 'job-12', status: 'Applied', daysAgo: 14 },
]

export function seedApplications(): Application[] {
  return APPLICATION_SEEDS.map((seed, index) => {
    const person = CANDIDATES[seed.key]
    return {
      id: `application-${index + 1}`,
      jobId: seed.jobId,
      candidateId: person.id,
      candidateName: person.name,
      candidateEmail: person.email,
      candidateTitle: person.title,
      status: seed.status,
      appliedAt: daysFromNow(-seed.daysAgo, seed.hour ?? 10),
    }
  })
}

export function seedSavedJobs(): SavedJob[] {
  return [
    { jobId: 'job-4', candidateId: 'user-candidate', savedAt: daysFromNow(-2) },
    { jobId: 'job-9', candidateId: 'user-candidate', savedAt: daysFromNow(-6) },
    { jobId: 'job-10', candidateId: 'user-candidate', savedAt: daysFromNow(-1) },
  ]
}

export function seedProfiles(): Record<string, CandidateProfile> {
  return {
    'user-candidate': {
      userId: 'user-candidate',
      fullName: 'Maya Iyer',
      email: 'maya@longlist.co',
      mobile: '+1 415 555 0134',
      address: '112 Cortland Avenue, San Francisco, CA',
      skills: ['React', 'TypeScript', 'Design systems', 'Accessibility', 'React Query'],
      experience:
        'Six years building product interfaces, most recently leading the design-system work for a 40-person platform team. Comfortable owning a feature from research through release.',
      education: 'BSc Computer Science, University of California, Davis',
      resumeName: 'maya-iyer-resume.pdf',
      updatedAt: daysFromNow(-8),
    },
  }
}

export function seedActivities(): Activity[] {
  return [
    {
      id: 'activity-1',
      actorId: 'user-candidate',
      actorName: 'Maya Iyer',
      kind: 'application',
      text: 'Maya Iyer applied to UX Researcher at Schiller - Zieme.',
      at: daysFromNow(0, 11),
    },
    {
      id: 'activity-2',
      actorId: 'p-1',
      actorName: 'Emily Johnson',
      kind: 'application',
      text: 'Emily Johnson applied to Senior Frontend Engineer.',
      at: daysFromNow(0, 9),
    },
    {
      id: 'activity-3',
      actorId: 'user-candidate',
      actorName: 'Maya Iyer',
      kind: 'application',
      text: "Maya Iyer's application to Senior Frontend Engineer moved to Interview.",
      at: daysFromNow(-4),
    },
    {
      id: 'activity-4',
      actorId: 'user-candidate',
      actorName: 'Maya Iyer',
      kind: 'application',
      text: 'Maya Iyer applied to Product Designer at Spinka - Dickinson.',
      at: daysFromNow(-3),
    },
    {
      id: 'activity-5',
      actorId: 'p-24',
      actorName: 'Mateo Nguyen',
      kind: 'application',
      text: 'Mateo Nguyen received an offer for Backend Engineer.',
      at: daysFromNow(-2),
    },
    {
      id: 'activity-6',
      actorId: 'user-candidate',
      actorName: 'Maya Iyer',
      kind: 'saved',
      text: 'Maya Iyer saved Staff Engineer at Mayer - Smitham.',
      at: daysFromNow(-2, 14),
    },
    {
      id: 'activity-7',
      actorId: 'user-candidate',
      actorName: 'Maya Iyer',
      kind: 'application',
      text: 'Maya Iyer applied to Senior Frontend Engineer at Dooley, Kozey and Cronin.',
      at: daysFromNow(-5),
    },
    {
      id: 'activity-8',
      actorId: 'user-recruiter',
      actorName: 'Devon Marsh',
      kind: 'job',
      text: 'Devon Marsh posted Staff Engineer at Mayer - Smitham.',
      at: daysFromNow(-10),
    },
    {
      id: 'activity-9',
      actorId: 'user-candidate',
      actorName: 'Maya Iyer',
      kind: 'saved',
      text: 'Maya Iyer saved Backend Engineer at Pfannerstill Inc.',
      at: daysFromNow(-6),
    },
    {
      id: 'activity-10',
      actorId: 'p-25',
      actorName: 'Harper Kelly',
      kind: 'application',
      text: 'Harper Kelly applied to Finance Associate.',
      at: daysFromNow(-18),
    },
    {
      id: 'activity-11',
      actorId: 'user-recruiter',
      actorName: 'Devon Marsh',
      kind: 'company',
      text: 'Devon Marsh added Dooley, Kozey and Cronin to the directory.',
      at: daysFromNow(-20),
    },
  ]
}

import { ArrowLeft, ArrowUpRight, Building2, Mail, MapPin, Pencil, Trash2, Users } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { CompanyFormDialog } from '../components/companies/CompanyFormDialog'
import { JobRow } from '../components/jobs/JobRow'
import { CompanyMark } from '../components/ui/Avatar'
import { Button } from '../components/ui/Button'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { EmptyState } from '../components/ui/EmptyState'
import { PageHeader } from '../components/ui/PageHeader'
import { useAuth } from '../context/auth-context'
import { useData, type CompanyInput } from '../context/data-context'
import { usePageTitle } from '../hooks/usePageTitle'
import { plural } from '../lib/format'

export default function CompanyDetails() {
  const { companyId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { companies, jobs, people, updateCompany, deleteCompany } = useData()
  const company = companies.find((entry) => entry.id === companyId)
  usePageTitle(company?.name ?? 'Company')

  const [formOpen, setFormOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const companyJobs = useMemo(
    () => jobs.filter((job) => job.companyId === companyId),
    [companyId, jobs],
  )
  const openJobs = companyJobs.filter((job) => job.status === 'Open')
  const contacts = useMemo(
    () => people.filter((person) => person.location === company?.location).slice(0, 4),
    [company?.location, people],
  )

  if (!company) {
    return (
      <>
        <PageHeader title="Company not found" sub="This company is not in the directory." />
        <EmptyState
          title="Nothing at this address"
          action={
            <Link to="/companies" className="btn">
              <ArrowLeft size={15} aria-hidden="true" />
              Back to companies
            </Link>
          }
        >
          The company may have been deleted, or the link is out of date.
        </EmptyState>
      </>
    )
  }

  const isRecruiter = user?.role === 'recruiter'

  const save = (input: CompanyInput) => {
    updateCompany(company.id, input)
    setFormOpen(false)
    toast.success(`${input.name} updated.`)
  }

  const remove = () => {
    deleteCompany(company.id)
    toast.success(`${company.name} removed from the directory.`)
    navigate('/companies', { replace: true })
  }

  const linked = companyJobs.length

  return (
    <>
      <PageHeader
        title={company.name}
        back={{ to: '/companies', label: 'Companies' }}
        sub={`${company.industry} · ${company.location} · ${company.employees.toLocaleString('en-US')} employees`}
        actions={
          isRecruiter ? (
            <>
              <Button onClick={() => setFormOpen(true)}>
                <Pencil size={15} aria-hidden="true" />
                Edit
              </Button>
              <Button variant="danger" onClick={() => setDeleting(true)}>
                <Trash2 size={15} aria-hidden="true" />
                Delete
              </Button>
            </>
          ) : undefined
        }
      />

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-12">
        <div className="xl:col-span-8">
          <section className="panel panel-pad" aria-labelledby="about-company">
            <div className="flex items-start gap-4">
              <CompanyMark name={company.name} logo={company.logo} size="lg" />
              <div className="min-w-0">
                <h2 id="about-company" className="panel-title">
                  About {company.name}
                </h2>
                <p className="mt-1 text-[13px] text-muted">
                  {company.origin === 'directory' ? 'Directory company' : 'Added in Longlist'}
                  {company.edited ? ' · edited here' : ''}
                </p>
              </div>
            </div>
            <p className="mt-4 max-w-[70ch] text-[14px] leading-6">{company.description}</p>

            <dl className="mt-5 grid grid-cols-1 gap-x-8 gap-y-3 border-t border-rule pt-4 sm:grid-cols-2">
              <div className="flex items-center gap-2 text-[13px]">
                <Building2 size={15} aria-hidden="true" className="text-muted" />
                <dt className="text-muted">Industry</dt>
                <dd className="ml-auto font-medium">{company.industry}</dd>
              </div>
              <div className="flex items-center gap-2 text-[13px]">
                <Users size={15} aria-hidden="true" className="text-muted" />
                <dt className="text-muted">Employees</dt>
                <dd className="num ml-auto font-medium">
                  {company.employees.toLocaleString('en-US')}
                </dd>
              </div>
              <div className="flex items-center gap-2 text-[13px]">
                <MapPin size={15} aria-hidden="true" className="text-muted" />
                <dt className="text-muted">Location</dt>
                <dd className="ml-auto font-medium">{company.location}</dd>
              </div>
              <div className="flex items-center gap-2 text-[13px]">
                <Mail size={15} aria-hidden="true" className="text-muted" />
                <dt className="text-muted">Contact</dt>
                <dd className="ml-auto font-medium">
                  <a
                    href={`mailto:${company.email}`}
                    className="underline decoration-border underline-offset-2 hover:text-ink"
                  >
                    {company.email}
                  </a>
                </dd>
              </div>
            </dl>

            <a
              href={company.website}
              target="_blank"
              rel="noreferrer"
              className="btn mt-5"
            >
              Visit website
              <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          </section>

          <section className="panel mt-3" aria-labelledby="company-jobs">
            <div className="panel-head px-5 pt-5">
              <h2 id="company-jobs" className="panel-title">
                Roles at {company.name}
              </h2>
              <p className="panel-meta">
                {openJobs.length} open · {companyJobs.length} total
              </p>
            </div>
            <div className="px-5 pb-4">
              {companyJobs.length === 0 ? (
                <EmptyState
                  title="No roles posted yet"
                  action={
                    isRecruiter ? (
                      <Link to="/jobs/new" className="btn sm primary">
                        Post a role
                      </Link>
                    ) : undefined
                  }
                >
                  {isRecruiter
                    ? 'Post the first role at this company and it will appear here.'
                    : 'Check back later, or browse other open roles.'}
                </EmptyState>
              ) : (
                <ul>
                  {companyJobs.slice(0, 6).map((job) => (
                    <JobRow job={job} key={job.id} />
                  ))}
                </ul>
              )}
              <Link
                to={`/jobs?company=${company.id}`}
                className="mt-3 inline-block text-[13px] font-medium underline decoration-border underline-offset-2 hover:text-ink"
              >
                See every role in job search
              </Link>
            </div>
          </section>
        </div>

        <div className="xl:col-span-4">
          <section className="panel panel-pad" aria-labelledby="company-people">
            <div className="panel-head">
              <h2 id="company-people" className="panel-title">
                People nearby
              </h2>
              <p className="panel-meta">{company.location}</p>
            </div>
            {contacts.length === 0 ? (
              <EmptyState title="No contacts listed">
                People from the directory who share this city will appear here.
              </EmptyState>
            ) : (
              <ul className="row-list">
                {contacts.map((person) => (
                  <li className="row-item" key={person.id}>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-medium">{person.name}</p>
                      <p className="truncate text-[12px] text-muted">{person.title}</p>
                    </div>
                    <span className="text-[12px] text-muted">{person.location}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="panel panel-pad mt-3" aria-labelledby="company-facts">
            <div className="panel-head">
              <h2 id="company-facts" className="panel-title">
                Directory facts
              </h2>
            </div>
            <dl className="key-value">
              <div>
                <dt>Listed roles</dt>
                <dd className="num">{plural(companyJobs.length, 'role')}</dd>
              </div>
              <div>
                <dt>Directory source</dt>
                <dd>{company.origin === 'directory' ? 'DummyJSON' : 'Added here'}</dd>
              </div>
              <div>
                <dt>Description</dt>
                <dd>{company.edited || company.origin === 'custom' ? 'Edited here' : 'Sample copy'}</dd>
              </div>
            </dl>
          </section>
        </div>
      </div>

      <CompanyFormDialog
        open={formOpen}
        company={company}
        onClose={() => setFormOpen(false)}
        onSubmit={save}
      />

      <ConfirmDialog
        open={deleting}
        title={`Delete ${company.name}?`}
        description="The company is removed from the directory. Job posts already published keep their company name."
        confirmLabel="Delete company"
        onClose={() => setDeleting(false)}
        onConfirm={remove}
        conflict={
          linked > 0 ? `${plural(linked, 'job post')} ${linked === 1 ? 'is' : 'are'} linked.` : null
        }
      />
    </>
  )
}

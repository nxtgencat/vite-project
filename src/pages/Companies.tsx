import { ArrowUpRight, ChevronRight, Pencil, Plus, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { CompanyFormDialog } from '../components/companies/CompanyFormDialog'
import { CompanyMark } from '../components/ui/Avatar'
import { Button } from '../components/ui/Button'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { EmptyState } from '../components/ui/EmptyState'
import { Notice } from '../components/ui/Notice'
import { PageHeader } from '../components/ui/PageHeader'
import { Pagination } from '../components/ui/Pagination'
import { SearchField } from '../components/ui/SearchField'
import { SelectField } from '../components/ui/SelectField'
import { useAuth } from '../context/auth-context'
import { useData, type CompanyInput } from '../context/data-context'
import { usePageTitle } from '../hooks/usePageTitle'
import { usePersistentState } from '../hooks/usePersistentState'
import { plural } from '../lib/format'
import type { Company } from '../lib/types'
import { useDebouncedValue } from '../hooks/useDebouncedValue'

const PAGE_SIZE = 8

type Sort = 'name-asc' | 'name-desc'

export default function Companies() {
  usePageTitle('Companies')
  const { user } = useAuth()
  const {
    companies,
    jobs,
    addCompany,
    updateCompany,
    deleteCompany,
    directoryStatus,
    directorySource,
    directoryUpdatedAt,
    directoryError,
    refreshDirectory,
  } = useData()
  const [params, setParams] = useSearchParams()

  const [query, setQuery] = usePersistentState('longlist.ui.company-query', '')
  const [industry, setIndustry] = usePersistentState('longlist.ui.company-industry', 'all')
  const [sort, setSort] = usePersistentState<Sort>('longlist.ui.company-sort', 'name-asc')
  const [page, setPage] = useState(1)
  const debouncedQuery = useDebouncedValue(query, 200)

  const [formOpen, setFormOpen] = useState(params.get('new') === '1')
  const [editing, setEditing] = useState<Company | null>(null)
  const [deleting, setDeleting] = useState<Company | null>(null)

  const isRecruiter = user?.role === 'recruiter'

  const industries = useMemo(
    () => [...new Set(companies.map((company) => company.industry))].sort(),
    [companies],
  )

  const filtered = useMemo(() => {
    const needle = debouncedQuery.trim().toLowerCase()
    const rows = companies.filter((company) => {
      const matchesQuery =
        !needle ||
        company.name.toLowerCase().includes(needle) ||
        company.location.toLowerCase().includes(needle) ||
        company.industry.toLowerCase().includes(needle)
      const matchesIndustry = industry === 'all' || company.industry === industry
      return matchesQuery && matchesIndustry
    })
    return rows.sort((a, b) =>
      sort === 'name-asc'
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name),
    )
  }, [companies, debouncedQuery, industry, sort])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const current = Math.min(page, pageCount)
  const visible = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE)

  const jobsByCompany = useMemo(() => {
    const map = new Map<string, number>()
    for (const job of jobs) {
      map.set(job.companyId, (map.get(job.companyId) ?? 0) + 1)
    }
    return map
  }, [jobs])

  const closeForm = () => {
    setFormOpen(false)
    setEditing(null)
    if (params.get('new')) {
      params.delete('new')
      setParams(params, { replace: true })
    }
  }

  const submitCompany = (input: CompanyInput) => {
    if (editing) {
      updateCompany(editing.id, input)
      toast.success(`${input.name} updated.`)
    } else {
      const created = addCompany(input)
      toast.success(`${created.name} added to the directory.`)
    }
    closeForm()
  }

  const confirmDelete = () => {
    if (!deleting) return
    const linked = jobsByCompany.get(deleting.id) ?? 0
    deleteCompany(deleting.id)
    toast.success(
      `${deleting.name} removed${linked > 0 ? `. ${plural(linked, 'job post')} kept its company name.` : '.'}`,
    )
    setDeleting(null)
  }

  const linkedForDelete = deleting ? jobsByCompany.get(deleting.id) ?? 0 : 0
  const stale = directorySource !== 'api'

  return (
    <>
      <PageHeader
        title="Companies"
        sub={`${plural(companies.length, 'company')} in the directory, ${plural(industries.length, 'industry', 'industries')}.`}
        actions={
          isRecruiter ? (
            <Button variant="primary" size="lg" onClick={() => setFormOpen(true)}>
              <Plus size={16} aria-hidden="true" />
              Add company
            </Button>
          ) : undefined
        }
      />

      <div className="panel">
        <div className="flex flex-col gap-2 border-b border-rule p-3 sm:flex-row sm:items-center">
          <SearchField
            id="company-search"
            label="Search companies"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              setPage(1)
            }}
            className="sm:max-w-[320px] sm:flex-1"
          />
          <SelectField
            id="company-industry"
            label="Filter by industry"
            value={industry}
            onChange={(event) => {
              setIndustry(event.target.value)
              setPage(1)
            }}
            options={[
              { value: 'all', label: 'All industries' },
              ...industries.map((value) => ({ value, label: value })),
            ]}
            className="sm:w-[190px]"
          />
          <SelectField
            id="company-sort"
            label="Sort companies"
            value={sort}
            onChange={(event) => {
              setSort(event.target.value as Sort)
              setPage(1)
            }}
            options={[
              { value: 'name-asc', label: 'Name A–Z' },
              { value: 'name-desc', label: 'Name Z–A' },
            ]}
            className="sm:w-[150px]"
          />
          <div className="flex items-center gap-2 sm:ml-auto">
            <span className="hidden text-[12px] text-muted lg:inline">
              {directoryStatus === 'refreshing'
                ? 'Refreshing directory…'
                : `${directorySource === 'api' ? 'Live directory' : 'Saved directory'}`}
            </span>
            <Button
              size="sm"
              onClick={() => void refreshDirectory()}
              disabled={directoryStatus === 'refreshing'}
              loading={directoryStatus === 'refreshing'}
            >
              Refresh
            </Button>
          </div>
        </div>

        {directoryError && (
          <div className="px-3 pt-3">
            <Notice
              action={
                <Button size="sm" onClick={() => void refreshDirectory()}>
                  Retry
                </Button>
              }
            >
              {directoryError} The directory was last updated{' '}
              {directoryUpdatedAt
                ? new Date(directoryUpdatedAt).toLocaleString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : 'never'}
              .
            </Notice>
          </div>
        )}

        <div className="px-4">
          {directoryStatus === 'refreshing' && companies.length === 0 ? (
            <div aria-busy="true" aria-label="Loading companies">
              {Array.from({ length: 5 }, (_, index) => (
                <div className="skeleton-row" key={index}>
                  <div className="skeleton" style={{ width: 36, height: 36, borderRadius: 999 }} />
                  <div className="flex-1">
                    <div className="skeleton" style={{ width: 180, height: 13 }} />
                    <div className="skeleton mt-2" style={{ width: 260, height: 11 }} />
                  </div>
                </div>
              ))}
            </div>
          ) : visible.length === 0 ? (
            <div className="py-4">
              <EmptyState
                title="No companies match these filters"
                action={
                  <Button
                    size="sm"
                    onClick={() => {
                      setQuery('')
                      setIndustry('all')
                      setPage(1)
                    }}
                  >
                    Clear filters
                  </Button>
                }
              >
                Try a shorter search, a different industry, or add the company yourself.
              </EmptyState>
            </div>
          ) : (
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th scope="col">Company</th>
                    <th scope="col" className="hidden md:table-cell">
                      Industry
                    </th>
                    <th scope="col" className="hidden lg:table-cell">
                      Location
                    </th>
                    <th scope="col" className="num hidden lg:table-cell">
                      Employees
                    </th>
                    <th scope="col" className="num">
                      Roles
                    </th>
                    <th scope="col">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((company) => {
                    const openJobs = jobsByCompany.get(company.id) ?? 0
                    return (
                      <tr key={company.id}>
                        <td>
                          <Link
                            to={`/companies/${company.id}`}
                            className="group flex min-w-0 items-center gap-3"
                          >
                            <CompanyMark name={company.name} logo={company.logo} />
                            <span className="min-w-0">
                              <span className="flex flex-wrap items-center gap-2 text-[14px] font-medium">
                                <span className="group-hover:underline">{company.name}</span>
                                {company.origin === 'custom' && (
                                  <span className="pill">Added here</span>
                                )}
                              </span>
                              <span className="sub md:hidden">
                                {company.industry}
                                <span className="block">{company.location}</span>
                              </span>
                            </span>
                          </Link>
                        </td>
                        <td className="hidden text-[13px] text-muted md:table-cell">
                          {company.industry}
                        </td>
                        <td className="hidden text-[13px] text-muted lg:table-cell">
                          {company.location}
                        </td>
                        <td className="num hidden text-[13px] text-muted lg:table-cell">
                          {company.employees.toLocaleString('en-US')}
                        </td>
                        <td className="num text-[13px]">{openJobs}</td>
                        <td>
                          <div className="flex items-center justify-end gap-1">
                            {isRecruiter && (
                              <>
                                <Button
                                  size="sm"
                                  className="ghost"
                                  onClick={() => {
                                    setEditing(company)
                                    setFormOpen(true)
                                  }}
                                  aria-label={`Edit ${company.name}`}
                                >
                                  <Pencil size={14} aria-hidden="true" />
                                </Button>
                                <Button
                                  size="sm"
                                  className="ghost"
                                  onClick={() => setDeleting(company)}
                                  aria-label={`Delete ${company.name}`}
                                >
                                  <Trash2 size={14} aria-hidden="true" />
                                </Button>
                              </>
                            )}
                            <Link
                              to={`/companies/${company.id}`}
                              className="inline-flex h-8 w-8 items-center justify-center rounded text-muted hover:bg-raised hover:text-ink"
                              aria-label={`View ${company.name}`}
                            >
                              <ChevronRight size={16} aria-hidden="true" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="border-t border-rule px-4 py-3">
          <Pagination
            page={current}
            pageCount={pageCount}
            total={filtered.length}
            pageSize={PAGE_SIZE}
            onPageChange={setPage}
            noun="company"
          />
        </div>
      </div>

      <p className="mt-3 text-[13px] leading-5 text-muted">
        Company names, industries and cities come from the DummyJSON directory
        {stale ? ' (saved copy)' : ''}. Headcounts and descriptions are sample copy, listed in the
        project report.{' '}
        <a
          className="inline-flex items-center gap-1 underline decoration-border underline-offset-2 hover:text-ink"
          href="https://dummyjson.com/docs/users"
          target="_blank"
          rel="noreferrer"
        >
          DummyJSON users API
          <ArrowUpRight size={12} aria-hidden="true" />
        </a>
      </p>

      {isRecruiter && (
        <div className="mt-5">
          <Link to="/jobs/new" className="link-underline text-[13px] text-muted hover:text-ink">
            Post a role at one of these companies
          </Link>
        </div>
      )}

      <CompanyFormDialog
        open={formOpen}
        company={editing}
        onClose={closeForm}
        onSubmit={submitCompany}
      />

      <ConfirmDialog
        open={Boolean(deleting)}
        title={deleting ? `Delete ${deleting.name}?` : 'Delete company'}
        description="The company is removed from the directory. Job posts already published keep their company name."
        confirmLabel="Delete company"
        onClose={() => setDeleting(null)}
        onConfirm={confirmDelete}
        conflict={
          linkedForDelete > 0
            ? `${plural(linkedForDelete, 'job post')} ${linkedForDelete === 1 ? 'is' : 'are'} linked to this company.`
            : null
        }
      />
    </>
  )
}

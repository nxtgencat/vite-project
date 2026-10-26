import { ChevronLeft, ChevronRight } from 'lucide-react'

type PaginationProps = {
  page: number
  pageCount: number
  total: number
  pageSize: number
  onPageChange: (page: number) => void
  noun: string
}

export function Pagination({
  page,
  pageCount,
  total,
  pageSize,
  onPageChange,
  noun,
}: PaginationProps) {
  if (total === 0) return null
  const from = (page - 1) * pageSize + 1
  const to = Math.min(total, page * pageSize)
  const pages = Array.from({ length: pageCount }, (_, index) => index + 1).filter((value) => {
    if (pageCount <= 7) return true
    return value === 1 || value === pageCount || Math.abs(value - page) <= 1
  })

  const withGaps: Array<number | 'gap'> = []
  pages.forEach((value, index) => {
    if (index > 0 && value - pages[index - 1] > 1) withGaps.push('gap')
    withGaps.push(value)
  })

  return (
    <nav className="pager" aria-label={`${noun} pages`}>
      <p className="range num">
        {from}–{to} of {total} {total === 1 ? noun.toLowerCase() : `${noun.toLowerCase()}s`}
      </p>
      <div className="pages">
        <button
          type="button"
          className="page-btn"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
        >
          <ChevronLeft size={15} aria-hidden="true" />
        </button>
        {withGaps.map((value, index) =>
          value === 'gap' ? (
            <span key={`gap-${index}`} className="px-1 text-[12px] text-muted" aria-hidden="true">
              …
            </span>
          ) : (
            <button
              key={value}
              type="button"
              className="page-btn num"
              aria-current={value === page ? 'page' : undefined}
              aria-label={`Page ${value}`}
              onClick={() => onPageChange(value)}
            >
              {value}
            </button>
          ),
        )}
        <button
          type="button"
          className="page-btn"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= pageCount}
          aria-label="Next page"
        >
          <ChevronRight size={15} aria-hidden="true" />
        </button>
      </div>
    </nav>
  )
}

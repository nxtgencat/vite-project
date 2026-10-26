import { Search } from 'lucide-react'
import type { InputHTMLAttributes } from 'react'
import { cx } from '../../lib/utils'

type SearchFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  className?: string
}

export function SearchField({ label, className, id, ...rest }: SearchFieldProps) {
  return (
    <div className={cx('relative min-w-0', className)}>
      <label className="sr-only" htmlFor={id}>
        {label}
      </label>
      <Search
        size={15}
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-faint"
      />
      <input id={id} type="search" className="input with-icon pr-3" placeholder={label} {...rest} />
    </div>
  )
}

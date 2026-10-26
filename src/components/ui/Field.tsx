import type { ReactNode } from 'react'
import { cx } from '../../lib/utils'

type FieldProps = {
  label: string
  htmlFor: string
  error?: string
  hint?: string
  labelAction?: ReactNode
  children: ReactNode
  className?: string
  required?: boolean
}

export function Field({
  label,
  htmlFor,
  error,
  hint,
  labelAction,
  children,
  className,
  required,
}: FieldProps) {
  return (
    <div className={cx('grid gap-2', className)}>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={htmlFor} className="text-[13px] font-medium">
          {label}
          {required && (
            <span className="ml-1 font-normal text-muted" aria-hidden="true">
              {' '}
              required
            </span>
          )}
        </label>
        {labelAction}
      </div>
      {children}
      {hint && (
        <p id={`${htmlFor}-hint`} className="text-[12px] leading-4 text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${htmlFor}-error`} role="alert" className="text-[12px] leading-4 text-negative">
          {error}
        </p>
      )}
    </div>
  )
}

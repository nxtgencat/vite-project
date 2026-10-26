import { ChevronDown } from 'lucide-react'
import type { SelectHTMLAttributes } from 'react'
import { useId } from 'react'

type SelectFieldProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string
  options: ReadonlyArray<{ value: string; label: string }>
  hideLabel?: boolean
}

export function SelectField({
  label,
  options,
  hideLabel = true,
  id,
  className,
  ...rest
}: SelectFieldProps) {
  const generatedId = useId()
  const selectId = id ?? generatedId
  return (
    <div className={className}>
      <label className={hideLabel ? 'sr-only' : 'text-[13px] font-medium'} htmlFor={selectId}>
        {label}
      </label>
      <div className="select-wrap">
        <select id={selectId} className="input" {...rest}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown size={15} aria-hidden="true" />
      </div>
    </div>
  )
}

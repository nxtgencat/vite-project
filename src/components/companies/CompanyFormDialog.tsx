import { useId } from 'react'
import { useForm } from 'react-hook-form'
import { INDUSTRIES } from '../../lib/constants'
import type { CompanyInput } from '../../context/data-context'
import type { Company } from '../../lib/types'
import { Button } from '../ui/Button'
import { Dialog } from '../ui/Dialog'
import { Field } from '../ui/Field'
import { SelectField } from '../ui/SelectField'

type CompanyForm = {
  name: string
  industry: string
  location: string
  website: string
  email: string
  employees: number
  description: string
  logo: string
}

type CompanyFormDialogProps = {
  open: boolean
  company?: Company | null
  onClose: () => void
  onSubmit: (input: CompanyInput) => void
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function CompanyFormDialog({ open, company, onClose, onSubmit }: CompanyFormDialogProps) {
  const uid = useId()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CompanyForm>({
    values: company
      ? {
          name: company.name,
          industry: company.industry,
          location: company.location,
          website: company.website,
          email: company.email,
          employees: company.employees,
          description: company.description,
          logo: company.logo ?? '',
        }
      : {
          name: '',
          industry: '',
          location: '',
          website: '',
          email: '',
          employees: 50,
          description: '',
          logo: '',
        },
  })

  const close = () => {
    reset()
    onClose()
  }

  const submit = (values: CompanyForm) => {
    onSubmit({
      name: values.name.trim(),
      industry: values.industry,
      location: values.location.trim(),
      website: values.website.trim(),
      email: values.email.trim(),
      employees: Number(values.employees),
      description: values.description.trim(),
      logo: values.logo.trim() || undefined,
    })
    reset()
  }

  return (
    <Dialog
      open={open}
      onClose={close}
      title={company ? 'Edit company' : 'Add a company'}
      description={
        company
          ? 'Changes appear everywhere this company is named.'
          : 'Add a company to the directory. It appears in the list straight away.'
      }
      footer={
        <>
          <Button onClick={close}>Cancel</Button>
          <Button variant="primary" type="submit" form={`${uid}-company-form`}>
            {company ? 'Save company' : 'Add company'}
          </Button>
        </>
      }
      wide
    >
      <form
        id={`${uid}-company-form`}
        className="grid gap-4 pb-4"
        onSubmit={handleSubmit(submit)}
        noValidate
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Company name" htmlFor={`${uid}-name`} error={errors.name?.message} required>
            <input
              id={`${uid}-name`}
              className="input"
              placeholder="Northwind Traders"
              aria-required="true"
              aria-invalid={Boolean(errors.name)}
              {...register('name', {
                required: 'Enter the company name.',
                minLength: { value: 2, message: 'Use at least 2 characters.' },
              })}
            />
          </Field>
          <Field
            label="Industry"
            htmlFor={`${uid}-industry`}
            error={errors.industry?.message}
            required
          >
            <SelectField
              id={`${uid}-industry`}
              label="Industry"
              options={[
                { value: '', label: 'Choose an industry' },
                ...INDUSTRIES.map((industry) => ({ value: industry, label: industry })),
              ]}
              aria-invalid={Boolean(errors.industry)}
              {...register('industry', { required: 'Choose an industry.' })}
            />
          </Field>
          <Field
            label="Location"
            htmlFor={`${uid}-location`}
            error={errors.location?.message}
            required
          >
            <input
              id={`${uid}-location`}
              className="input"
              placeholder="Chicago"
              aria-required="true"
              aria-invalid={Boolean(errors.location)}
              {...register('location', { required: 'Enter the company location.' })}
            />
          </Field>
          <Field
            label="Number of employees"
            htmlFor={`${uid}-employees`}
            error={errors.employees?.message}
            required
          >
            <input
              id={`${uid}-employees`}
              type="number"
              min={1}
              max={500000}
              step={1}
              className="input num"
              aria-required="true"
              aria-invalid={Boolean(errors.employees)}
              {...register('employees', {
                required: 'Enter the headcount.',
                min: { value: 1, message: 'At least one employee.' },
                max: { value: 500000, message: 'That number is too large.' },
                valueAsNumber: true,
              })}
            />
          </Field>
          <Field
            label="Website"
            htmlFor={`${uid}-website`}
            error={errors.website?.message}
            required
          >
            <input
              id={`${uid}-website`}
              type="url"
              className="input"
              placeholder="https://company.com"
              aria-required="true"
              aria-invalid={Boolean(errors.website)}
              {...register('website', {
                required: 'Enter the company website.',
                pattern: {
                  value: /^https?:\/\/[^\s.]+\.[^\s]{2,}$/i,
                  message: 'Use a full address, starting with https://.',
                },
              })}
            />
          </Field>
          <Field
            label="Contact email"
            htmlFor={`${uid}-email`}
            error={errors.email?.message}
            required
          >
            <input
              id={`${uid}-email`}
              type="email"
              className="input"
              placeholder="talent@company.com"
              aria-required="true"
              aria-invalid={Boolean(errors.email)}
              {...register('email', {
                required: 'Enter a contact email.',
                pattern: { value: EMAIL_PATTERN, message: 'Enter a valid email address.' },
              })}
            />
          </Field>
        </div>
        <Field
          label="Company logo"
          htmlFor={`${uid}-logo`}
          hint="Optional. Paste a square image URL; a monogram is shown when there is no logo."
          error={errors.logo?.message}
        >
          <input
            id={`${uid}-logo`}
            className="input"
            placeholder="https://company.com/logo.png"
            aria-describedby={`${uid}-logo-hint`}
            {...register('logo', {
              validate: (value) =>
                !value ||
                /^https?:\/\/[^\s]+\.[^\s]{2,}$/i.test(value) ||
                'Use a full image URL, starting with https://.',
            })}
          />
        </Field>
        <Field
          label="Company description"
          htmlFor={`${uid}-description`}
          error={errors.description?.message}
          hint="Two or three sentences on what the company does and how it works."
          required
        >
          <textarea
            id={`${uid}-description`}
            className="input"
            rows={4}
            aria-required="true"
            aria-invalid={Boolean(errors.description)}
            {...register('description', {
              required: 'Describe the company.',
              minLength: { value: 20, message: 'Use at least 20 characters.' },
            })}
          />
        </Field>
      </form>
    </Dialog>
  )
}

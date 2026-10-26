import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Button } from '../../components/ui/Button'
import { Field } from '../../components/ui/Field'
import { PasswordInput } from '../../components/ui/PasswordInput'
import { useAuth } from '../../context/auth-context'
import { usePageTitle } from '../../hooks/usePageTitle'
import type { Role } from '../../lib/types'

type RegisterForm = {
  name: string
  email: string
  password: string
  confirm: string
  role: Role
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Register() {
  usePageTitle('Create account')
  const { user, register: createAccount } = useAuth()
  const navigate = useNavigate()
  const [formError, setFormError] = useState('')

  const {
    register,
    handleSubmit,
    getValues,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    defaultValues: { name: '', email: '', password: '', confirm: '', role: 'candidate' },
  })

  if (user) return <Navigate to="/" replace />

  const onSubmit = (values: RegisterForm) => {
    setFormError('')
    const result = createAccount({
      name: values.name,
      email: values.email,
      password: values.password,
      role: values.role,
    })
    if (!result.ok) {
      setError('email', { type: 'server', message: result.message })
      setFormError(result.message)
      toast.error(result.message)
      return
    }
    toast.success('Account created. Welcome to Longlist.')
    navigate('/', { replace: true })
  }

  return (
    <div className="auth-center">
      <h1 className="auth-title">Create your account</h1>
      <p className="auth-sub">One account for finding work or hiring for it.</p>

      <form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Field label="Full name" htmlFor="register-name" error={errors.name?.message} required>
          <input
            id="register-name"
            autoComplete="name"
            className="input"
            placeholder="Your name"
            aria-required="true" aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'register-name-error' : undefined}
            {...register('name', {
              required: 'Enter your full name.',
              minLength: { value: 2, message: 'Use at least 2 characters.' },
            })}
          />
        </Field>

        <Field label="Email" htmlFor="register-email" error={errors.email?.message} required>
          <input
            id="register-email"
            type="email"
            autoComplete="email"
            className="input"
            placeholder="you@company.com"
            aria-required="true" aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'register-email-error' : undefined}
            {...register('email', {
              required: 'Enter your email address.',
              pattern: { value: EMAIL_PATTERN, message: 'Enter a valid email address.' },
            })}
          />
        </Field>

        <fieldset className="grid gap-2">
          <legend className="text-[13px] font-medium">I am joining as</legend>
          <div className="role-choice">
            <label className="role-option">
              <input type="radio" value="candidate" {...register('role')} />
              <span className="role-name">Candidate</span>
              <span className="role-note">Find roles, save them and track applications.</span>
            </label>
            <label className="role-option">
              <input type="radio" value="recruiter" {...register('role')} />
              <span className="role-name">Recruiter</span>
              <span className="role-note">Manage companies, job posts and applicants.</span>
            </label>
          </div>
        </fieldset>

        <Field
          label="Password"
          htmlFor="register-password"
          error={errors.password?.message}
          hint="At least 8 characters."
          required
        >
          <PasswordInput
            id="register-password"
            autoComplete="new-password"
            placeholder="Create a password"
            aria-required="true" aria-invalid={Boolean(errors.password)}
            aria-describedby={
              errors.password ? 'register-password-error' : 'register-password-hint'
            }
            {...register('password', {
              required: 'Create a password.',
              minLength: { value: 8, message: 'Use at least 8 characters.' },
            })}
          />
        </Field>

        <Field
          label="Confirm password"
          htmlFor="register-confirm"
          error={errors.confirm?.message}
          required
        >
          <PasswordInput
            id="register-confirm"
            autoComplete="new-password"
            placeholder="Repeat the password"
            aria-required="true" aria-invalid={Boolean(errors.confirm)}
            aria-describedby={errors.confirm ? 'register-confirm-error' : undefined}
            {...register('confirm', {
              required: 'Repeat your password.',
              validate: (value) => value === getValues('password') || 'Passwords do not match.',
            })}
          />
        </Field>

        {formError && (
          <p
            role="alert"
            className="rounded-[6px] border border-negative/20 bg-negative-bg px-3 py-2 text-[13px] text-negative-ink"
          >
            {formError}
          </p>
        )}

        <Button type="submit" variant="primary" size="lg" block loading={isSubmitting}>
          Create account
        </Button>
      </form>

      <p className="auth-foot">
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </div>
  )
}

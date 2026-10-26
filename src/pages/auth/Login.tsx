import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, Navigate, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Field } from '../../components/ui/Field'
import { Button } from '../../components/ui/Button'
import { PasswordInput } from '../../components/ui/PasswordInput'
import { useAuth } from '../../context/auth-context'
import { DEMO_ACCOUNTS, DEMO_PASSWORD } from '../../lib/constants'
import { usePageTitle } from '../../hooks/usePageTitle'

type LoginForm = {
  email: string
  password: string
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Login() {
  usePageTitle('Sign in')
  const { user, login, signInDemo } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const [formError, setFormError] = useState('')
  const demoHandled = useRef(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ defaultValues: { email: '', password: '' } })

  const state = location.state as { from?: string } | null
  const from = state?.from?.startsWith('/') ? state.from : undefined
  const requested = searchParams.get('next')
  const next =
    requested && requested.startsWith('/') && !requested.startsWith('//') ? requested : '/'
  const destination = from && from !== '/login' ? from : next

  const demoParam = searchParams.get('demo')

  useEffect(() => {
    if (demoHandled.current || user) return
    if (demoParam !== 'candidate' && demoParam !== 'recruiter') return
    demoHandled.current = true
    if (signInDemo(demoParam)) {
      toast.success(`Signed in to the ${demoParam} demo.`)
      navigate(destination, { replace: true })
    }
  }, [demoParam, destination, navigate, signInDemo, user])

  if (user) return <Navigate to={destination} replace />

  const onSubmit = (values: LoginForm) => {
    setFormError('')
    const result = login(values.email, values.password)
    if (!result.ok) {
      setFormError(result.message)
      toast.error(result.message)
      return
    }
    toast.success('Signed in.')
    navigate(destination, { replace: true })
  }

  const fillDemo = (role: 'candidate' | 'recruiter') => {
    setValue('email', DEMO_ACCOUNTS[role].email)
    setValue('password', DEMO_PASSWORD)
    setFormError('')
  }

  return (
    <div className="auth-center">
      <h1 className="auth-title">Sign in to Longlist</h1>
      <p className="auth-sub">Pick up the list where you left it.</p>

      <form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Field label="Email" htmlFor="login-email" error={errors.email?.message} required>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            className="input"
            placeholder="you@company.com"
            aria-required="true" aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'login-email-error' : undefined}
            {...register('email', {
              required: 'Enter the email on your account.',
              pattern: { value: EMAIL_PATTERN, message: 'Enter a valid email address.' },
            })}
          />
        </Field>

        <Field
          label="Password"
          htmlFor="login-password"
          error={errors.password?.message}
          required
          labelAction={
            <Link
              to="/forgot-password"
              className="text-[12px] text-muted underline decoration-border underline-offset-2 hover:text-ink"
            >
              Forgot password?
            </Link>
          }
        >
          <PasswordInput
            id="login-password"
            autoComplete="current-password"
            placeholder="Your password"
            aria-required="true" aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? 'login-password-error' : undefined}
            {...register('password', { required: 'Enter your password.' })}
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
          Sign in
        </Button>
      </form>

      <p className="auth-foot">
        New to Longlist? <Link to="/register">Create an account</Link>
      </p>

      <div className="mt-6 border-t border-border pt-4">
        <p className="text-[12px] text-muted">Demo accounts</p>
        <div className="demo-row">
          <button type="button" className="demo-chip" onClick={() => fillDemo('candidate')}>
            Fill candidate demo
          </button>
          <button type="button" className="demo-chip" onClick={() => fillDemo('recruiter')}>
            Fill recruiter demo
          </button>
        </div>
        <p className="mt-2 text-[12px] text-faint">Password for both demo accounts: {DEMO_PASSWORD}</p>
      </div>
    </div>
  )
}

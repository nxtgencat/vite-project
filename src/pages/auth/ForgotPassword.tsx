import { ArrowLeft, MailCheck } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Button } from '../../components/ui/Button'
import { Field } from '../../components/ui/Field'
import { useAuth } from '../../context/auth-context'
import { usePageTitle } from '../../hooks/usePageTitle'

type ResetForm = { email: string }

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function ForgotPassword() {
  usePageTitle('Reset password')
  const { requestReset } = useAuth()
  const [sentTo, setSentTo] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetForm>({ defaultValues: { email: '' } })

  const onSubmit = (values: ResetForm) => {
    requestReset(values.email)
    setSentTo(values.email)
    toast.success('Reset link requested.')
  }

  if (sentTo) {
    return (
      <div className="auth-center">
        <span className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-full bg-raised text-ink">
          <MailCheck size={20} aria-hidden="true" />
        </span>
        <h1 className="auth-title">Check your inbox</h1>
        <p className="auth-sub">
          If an account exists for {sentTo}, a reset link is on its way. This demo does not send
          email.
        </p>
        <div className="mt-7">
          <Link to="/login" className="btn lg block">
            <ArrowLeft size={16} aria-hidden="true" />
            Back to sign in
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-center">
      <h1 className="auth-title">Reset your password</h1>
      <p className="auth-sub">Enter the email on your account and we will send a reset link.</p>

      <form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Field label="Email" htmlFor="reset-email" error={errors.email?.message} required>
          <input
            id="reset-email"
            type="email"
            autoComplete="email"
            className="input"
            placeholder="you@company.com"
            aria-required="true" aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'reset-email-error' : undefined}
            {...register('email', {
              required: 'Enter your email address.',
              pattern: { value: EMAIL_PATTERN, message: 'Enter a valid email address.' },
            })}
          />
        </Field>
        <Button type="submit" variant="primary" size="lg" block>
          Send reset link
        </Button>
      </form>

      <p className="auth-foot">
        <Link to="/login" className="inline-flex items-center gap-1">
          <ArrowLeft size={14} aria-hidden="true" />
          Back to sign in
        </Link>
      </p>
    </div>
  )
}

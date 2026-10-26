import { PageHeader } from '../components/ui/PageHeader'
import { useAuth } from '../context/auth-context'
import { usePageTitle } from '../hooks/usePageTitle'

export default function Dashboard() {
  usePageTitle('Overview')
  const { user } = useAuth()

  return (
    <>
      <PageHeader
        title="Overview"
        sub={`Signed in as ${user?.name}. The hiring ledger is being assembled.`}
      />
      <div className="panel panel-pad">
        <h2 className="panel-title">Your workspace</h2>
        <p className="mt-2 max-w-[62ch] text-muted">
          Companies, job postings, applications and reports will appear here as each module is
          added.
        </p>
      </div>
    </>
  )
}

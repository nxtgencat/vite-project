import { Brand } from './components/Brand'

function App() {
  return (
    <main className="mx-auto max-w-[760px] px-6 py-16">
      <Brand />
      <h1 className="mt-16 text-[32px] leading-[38px] font-semibold tracking-[-0.03em]">
        The hiring ledger
      </h1>
      <p className="mt-3 max-w-[52ch] text-muted">
        Longlist keeps candidates, companies and open roles in one place. The application is being
        assembled.
      </p>
    </main>
  )
}

export default App

type LogoProps = { size?: number; className?: string }

export function Logo({ size = 20, className }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M3 4.75h14M3 10h9.5M3 15.25h5.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-2">
      <Logo />
      <span className="wordmark">{compact ? 'Longlist' : 'Longlist'}</span>
    </span>
  )
}

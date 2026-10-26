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
        d="M3.25 4.5v11"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M6.75 4.75h10.25M6.75 10h7.25M6.75 15.25h4.25"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function Brand() {
  return (
    <span className="flex items-center gap-2">
      <Logo />
      <span className="wordmark">Longlist</span>
    </span>
  )
}

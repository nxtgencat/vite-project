import { useState } from 'react'
import { avatarTint, initials } from '../../lib/format'
import { cx } from '../../lib/utils'

type AvatarProps = {
  name: string
  photo?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export function Avatar({ name, photo, size = 'md', className }: AvatarProps) {
  const tint = avatarTint(name)
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  const showPhoto = Boolean(photo) && failedSrc !== photo

  return (
    <span
      className={cx('avatar', size !== 'md' && size, className)}
      style={{ backgroundColor: tint.background, color: tint.color }}
      aria-hidden="true"
    >
      {photo && showPhoto ? (
        <img src={photo} alt="" onError={() => setFailedSrc(photo)} />
      ) : (
        initials(name)
      )}
    </span>
  )
}

type CompanyMarkProps = {
  name: string
  logo?: string
  size?: 'md' | 'lg'
  className?: string
}

export function CompanyMark({ name, logo, size = 'md', className }: CompanyMarkProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  const showLogo = Boolean(logo) && failedSrc !== logo

  return (
    <span className={cx('monogram', size !== 'md' && size, className)} aria-hidden="true">
      {logo && showLogo ? (
        <img src={logo} alt="" onError={() => setFailedSrc(logo)} />
      ) : (
        initials(name)
      )}
    </span>
  )
}

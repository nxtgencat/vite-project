const AVATAR_TINTS = [
  { background: '#f3e9e6', color: '#5e3a31' },
  { background: '#f1eddd', color: '#584d26' },
  { background: '#e8efe3', color: '#3d5136' },
  { background: '#e1efec', color: '#2f514b' },
  { background: '#e5ebf3', color: '#344a63' },
]

export function hashString(value: string) {
  let hash = 0
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

export function initials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return '—'
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase()
  return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase()
}

export function avatarTint(name: string) {
  return AVATAR_TINTS[hashString(name) % AVATAR_TINTS.length]
}

export function plural(count: number, singular: string, pluralForm = `${singular}s`) {
  return `${count.toLocaleString('en-US')} ${count === 1 ? singular : pluralForm}`
}

const money = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

export function formatMoney(value: number) {
  return money.format(value)
}

export function formatSalary(min: number, max: number) {
  return `${formatMoney(min)} – ${formatMoney(max)}`
}

const dayMonth = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

const dayMonthShort = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
})

const monthShort = new Intl.DateTimeFormat('en-GB', { month: 'short' })

export function formatDate(iso: string) {
  const date = new Date(iso)
  return Number.isNaN(date.getTime()) ? '—' : dayMonth.format(date)
}

export function formatDayMonth(iso: string) {
  const date = new Date(iso)
  return Number.isNaN(date.getTime()) ? '—' : dayMonthShort.format(date)
}

export function formatMonth(iso: string) {
  const date = new Date(iso)
  return Number.isNaN(date.getTime()) ? '—' : monthShort.format(date)
}

export function monthLabel(date: Date) {
  return monthShort.format(date)
}

export function formatDateTime(iso: string) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '—'
  return `${dayMonth.format(date)}, ${date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  })}`
}

export function relativeTime(iso: string, now = new Date()) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '—'
  const diff = now.getTime() - date.getTime()
  const minutes = Math.round(diff / 60_000)
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.round(hours / 24)
  if (days === 1) return 'Yesterday'
  if (days < 30) return `${days} days ago`
  return formatDate(iso)
}

export function daysFromNow(days: number, hour = 10) {
  const date = new Date()
  date.setDate(date.getDate() + days)
  date.setHours(hour, 0, 0, 0)
  return date.toISOString()
}

export function daysUntil(iso: string, now = new Date()) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return 0
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const startOfDeadline = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  return Math.round((startOfDeadline.getTime() - startOfToday.getTime()) / 86_400_000)
}

export function deadlineLabel(iso: string) {
  const days = daysUntil(iso)
  if (days < 0) return `Closed ${formatDayMonth(iso)}`
  if (days === 0) return 'Closes today'
  if (days === 1) return 'Closes tomorrow'
  if (days <= 14) return `Closes in ${days} days`
  return `Closes ${formatDayMonth(iso)}`
}

export function isPast(iso: string) {
  return new Date(iso).getTime() < Date.now()
}

export function toDateInput(iso: string) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

export function todayInput() {
  return toDateInput(new Date().toISOString())
}

export function parseSkills(value: string) {
  return value
    .split(',')
    .map((skill) => skill.trim())
    .filter(Boolean)
}

export function titleCase(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

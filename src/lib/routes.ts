export const SCREEN_LABELS: Array<[RegExp, string]> = [
  [/^\/$/, 'Overview'],
  [/^\/companies\/[^/]+$/, 'Company'],
  [/^\/companies$/, 'Companies'],
  [/^\/jobs\/new$/, 'Post a job'],
  [/^\/jobs\/manage$/, 'Job postings'],
  [/^\/jobs\/[^/]+\/edit$/, 'Edit job'],
  [/^\/jobs\/[^/]+$/, 'Job details'],
  [/^\/jobs$/, 'Find jobs'],
  [/^\/applications$/, 'Applications'],
  [/^\/saved-jobs$/, 'Saved jobs'],
  [/^\/profile$/, 'Profile'],
  [/^\/reports$/, 'Reports'],
]

export function screenLabel(pathname: string) {
  return SCREEN_LABELS.find(([pattern]) => pattern.test(pathname))?.[1] ?? 'Longlist'
}

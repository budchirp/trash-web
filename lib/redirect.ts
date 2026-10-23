const isAuthPath = (pathname: string): boolean => {
  const segments = pathname.split('/').filter(Boolean)
  const index = segments.indexOf('auth')

  if (index !== -1) return segments[index + 1] === 'signin' || segments[index + 1] === 'signup'

  return segments.includes('onboarding')
}

export const sanitize = (value?: string | null): string | null => {
  if (!value) return null

  const path = value.trim()
  if (!path.startsWith('/') || path.startsWith('//') || path.includes('\\')) return null
  if (/^[a-zA-Z][a-zA-Z\d+.-]*:/.test(path)) return null

  const { pathname } = new URL(path, 'http://trash.local')
  if (isAuthPath(pathname)) return null

  return path
}

export const withRedirect = (path: string, redirectTo?: string | null): string => {
  const safe = sanitize(redirectTo)
  return safe ? `${path}?redirectTo=${encodeURIComponent(safe)}` : path
}

export const currentPath = (): string => `${window.location.pathname}${window.location.search}`

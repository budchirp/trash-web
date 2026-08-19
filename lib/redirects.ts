import { LINKS } from '@/lib/link'

const isInternalFlowRedirect = (pathname: string): boolean => {
  const [, first, second, third] = pathname.split('/')
  const authPage = first === 'auth' ? second : second === 'auth' ? third : null
  const onboardingPage = first === 'onboarding' || second === 'onboarding'

  return authPage === 'signin' || authPage === 'signup' || onboardingPage
}

export const safeRedirectTo = (value?: string | null): string | null => {
  if (!value) return null

  const path = value.trim()
  if (!path.startsWith('/') || path.startsWith('//') || path.includes('\\')) return null
  if (/^[a-zA-Z][a-zA-Z\d+.-]*:/.test(path)) return null

  try {
    const url = new URL(path, 'http://trash.local')
    if (isInternalFlowRedirect(url.pathname)) return null

    const nestedRedirects = url.searchParams.getAll('redirectTo').filter(Boolean)
    if (nestedRedirects.some((redirectTo) => !safeRedirectTo(redirectTo))) return null
  } catch {
    return null
  }

  return path
}

export const getRedirectQuery = (redirectTo: string | null | undefined): string =>
  redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''

export const getCurrentRedirect = (): string =>
  `${window.location.pathname}${window.location.search}`

const getAuthPath = (page: 'signin' | 'signup', redirectTo: string | null | undefined): string => {
  const path = page === 'signin' ? LINKS.auth.signIn : LINKS.auth.signUp

  return `${path}${getRedirectQuery(redirectTo)}`
}

export const getSignInPath = (redirectTo?: string | null): string =>
  getAuthPath('signin', safeRedirectTo(redirectTo) ?? LINKS.home)

export const getSignUpPath = (redirectTo?: string | null): string =>
  getAuthPath('signup', safeRedirectTo(redirectTo) ?? LINKS.home)

const isInternalFlowRedirect = (pathname: string): boolean => {
  const [, first, second, third] = pathname.split('/')
  const authPage = first === 'auth' ? second : second === 'auth' ? third : null
  const onboardingPage = first === 'onboarding' || second === 'onboarding'

  return authPage === 'signin' || authPage === 'signup' || onboardingPage
}

const getSafeRedirectTo = (value: string | null | undefined, depth: number): string | null => {
  if (!value || depth > 3) return null

  const path = value.trim()
  if (!path.startsWith('/') || path.startsWith('//') || path.includes('\\')) return null
  if (/^[a-zA-Z][a-zA-Z\d+.-]*:/.test(path)) return null

  try {
    const url = new URL(path, 'http://trash.local')
    if (isInternalFlowRedirect(url.pathname)) return null

    const nestedRedirects = url.searchParams.getAll('redirectTo').filter(Boolean)
    if (nestedRedirects.some((redirectTo) => !getSafeRedirectTo(redirectTo, depth + 1))) {
      return null
    }
  } catch {
    return null
  }

  return path
}

export const safeRedirectTo = (value?: string | null): string | null => getSafeRedirectTo(value, 0)

export const getSignInPath = (locale: string, redirectTo?: string | null): string =>
  `/${locale}/auth/signin?redirectTo=${encodeURIComponent(
    safeRedirectTo(redirectTo) ?? `/${locale}/dashboard`
  )}`

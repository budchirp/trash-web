import { redirect } from 'next/navigation'

import { getCookies } from 'next-client-cookies/server'
import { AccountSession } from './account-session'
import { UserService } from '@/service/user'

import type { User } from '@/types/api/user'

export type AuthenticatedSession = {
  jwt: string
  user: User
}

const isInternalFlowRedirect = (pathname: string): boolean => {
  const [, first, second, third] = pathname.split('/')
  const authPage = first === 'auth' ? second : second === 'auth' ? third : null
  const onboardingPage = first === 'onboarding' || second === 'onboarding'

  return authPage === 'signin' || authPage === 'signup' || onboardingPage
}

const getSafeRedirectTo = (value: string | null | undefined, depth: number): string | null => {
  if (!value) return null
  if (depth > 3) return null

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

export const getAuthenticatedSession = async (
  locale: string = 'en',
  redirectTo?: string | null
): Promise<AuthenticatedSession> => {
  const cookies = await getCookies()
  const accountSession = new AccountSession(cookies)
  const jwt = accountSession.get()
  const signInPath = `/${locale}/auth/signin?redirectTo=${encodeURIComponent(
    safeRedirectTo(redirectTo) ?? `/${locale}/dashboard`
  )}`

  if (!jwt) redirect(signInPath)

  const user = await UserService.get({ jwt, locale })
  if (user.error) {
    if (user.status === 401) {
      accountSession.remove(jwt)
      redirect(signInPath)
    }

    throw new Error(user.message)
  }

  return { jwt, user: user.data }
}

export const _authtenticated = async (
  locale: string = 'en',
  redirectTo?: string | null
): Promise<string> => {
  const { jwt } = await getAuthenticatedSession(locale, redirectTo)

  return jwt
}

export const _public = async (locale: string = 'en', redirectTo?: string | null): Promise<void> => {
  const cookies = await getCookies()
  const accountSession = new AccountSession(cookies)
  const jwt = accountSession.get()
  if (!jwt) return

  const user = await UserService.get({ jwt, locale })
  if (user.error) {
    if (user.status === 401) {
      accountSession.remove(jwt)
      return
    }

    throw new Error(user.message)
  }

  const safePath = safeRedirectTo(redirectTo)
  if (!user.data?.profile?.name?.trim()) {
    const query = safePath ? `?redirectTo=${encodeURIComponent(safePath)}` : ''
    redirect(`/${locale}/onboarding${query}`)
  }

  redirect(safePath ?? `/${locale}/dashboard`)
}

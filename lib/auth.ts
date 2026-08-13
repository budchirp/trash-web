import { redirect, unauthorized } from 'next/navigation'

import { getCookies } from 'next-client-cookies/server'
import { AccountSession } from './account-session'
import { UserService } from '@/service/user'
import { safeRedirectTo } from '@/lib/redirects'

import type { User } from '@/types/api/user'

export type AuthenticatedSession = {
  jwt: string
  user: User
}

export type SessionLookup = {
  session: AuthenticatedSession | null
  error: {
    message: string
    status: number
  } | null
}

export { safeRedirectTo }

export const getCurrentSession = async (locale: string = 'en'): Promise<SessionLookup> => {
  const cookies = await getCookies()
  const accountSession = new AccountSession(cookies)
  const jwt = accountSession.get()
  if (!jwt) return { session: null, error: null }

  const response = await UserService.get({ jwt, locale })
  if (response.error) {
    if (response.status === 401) return { session: null, error: null }

    return {
      session: null,
      error: { message: response.message, status: response.status }
    }
  }

  if (!response.data?.id) {
    return { session: null, error: { message: 'Invalid user response', status: 500 } }
  }

  return {
    session: { jwt, user: response.data },
    error: null
  }
}

export const _authenticate = async (
  locale: string = 'en',
  _redirectTo?: string | null
): Promise<AuthenticatedSession> => {
  const result = await getCurrentSession(locale)
  if (result.error) throw new Error(result.error.message)

  if (!result.session) unauthorized()

  return result.session
}

export const _public = async (locale: string = 'en', redirectTo?: string | null): Promise<void> => {
  const result = await getCurrentSession(locale)
  if (result.error) throw new Error(result.error.message)

  if (!result.session) return

  const url = safeRedirectTo(redirectTo)
  if (!result.session.user.profile?.name?.trim()) {
    const query = url ? `?redirectTo=${encodeURIComponent(url)}` : ''
    const onboardingPath = `/${locale}/onboarding${query}`
    redirect(onboardingPath)
  }

  redirect(url ?? `/${locale}/dashboard`)
}

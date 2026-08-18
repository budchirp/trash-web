import { redirect } from 'next/navigation'
import { cache } from 'react'

import { getCookies } from 'next-client-cookies/server'
import { AccountSession } from './account-session'
import { UserService } from '@/service/user'
import { getSignInPath, safeRedirectTo } from '@/lib/redirects'
import { LINKS } from '@/lib/link'

import type { User } from '@/types/api/user'

export type AuthenticatedSession = {
  jwt: string
  user: User
}

export { safeRedirectTo }

export const getCurrentSession = cache(
  async (locale: string = 'en'): Promise<AuthenticatedSession | null> => {
    const cookies = await getCookies()
    const accountSession = new AccountSession(cookies)
    const jwt = accountSession.get()
    if (!jwt) return null

    const response = await UserService.get({ jwt, locale })
    if (response.error || !response.data?.id) return null

    return { jwt, user: response.data }
  }
)

export const _authenticate = async (
  locale: string = 'en',
  redirectTo?: string | null
): Promise<AuthenticatedSession> => {
  const session = await getCurrentSession(locale)

  if (!session) redirect(getSignInPath(redirectTo))

  return session
}

export const _authFlow = async (
  locale: string = 'en',
  redirectTo?: string | null
): Promise<void> => {
  if (safeRedirectTo(redirectTo)) return

  await _public(locale)
}

export const _public = async (locale: string = 'en'): Promise<void> => {
  const session = await getCurrentSession(locale)
  if (!session) return

  if (!session.user.profile?.name?.trim()) {
    redirect(`/${locale}${LINKS.onboarding}`)
  }

  redirect(`/${locale}${LINKS.dashboard}`)
}

import { cache } from 'react'

import { getCookies } from 'next-client-cookies/server'
import { getLocale } from 'next-intl/server'
import { redirect } from '@/lib/i18n/navigation'
import { sanitize, withRedirect } from '@/lib/redirect'
import { token } from '@/lib/session'
import { UserService } from '@/service/user'
import { LINKS } from '@/lib/link'

import type { User } from '@/types/api/user'

export type CurrentSession = {
  token: string
  user: User
}

export const getSession = cache(async (): Promise<CurrentSession | null> => {
  const value = token(await getCookies())
  if (!value) return null

  const response = await UserService.get(value)
  if (response.error) return null

  return { token: value, user: response.data }
})

export const requireSession = async (redirectTo?: string | null): Promise<CurrentSession> => {
  const session = await getSession()
  if (session) return session

  return redirect({ href: withRedirect(LINKS.auth.signIn, redirectTo), locale: await getLocale() })
}

export const requireAnonymous = async (redirectTo?: string | null): Promise<void> => {
  const session = await getSession()
  if (!session || sanitize(redirectTo)) return

  redirect({
    href: session.user.profile?.name?.trim() ? LINKS.dashboard : LINKS.onboarding,
    locale: await getLocale()
  })
}

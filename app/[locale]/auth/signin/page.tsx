import type React from 'react'

import { SignInClientPage } from '@/app/[locale]/auth/signin/page.client'
import { _authFlow, getCurrentSession } from '@/lib/auth'
import { safeRedirectTo } from '@/lib/redirects'
import { getCookies } from 'next-client-cookies/server'
import { AccountSession } from '@/lib/account-session'

import { Section } from '@trash-kit/ui'

import type { DynamicPageProps } from '@/types/app/page'
import type { SavedAccount } from '@/types/app/account'

const SignInPage: React.FC<DynamicPageProps> = async ({
  params,
  searchParams
}: DynamicPageProps): Promise<React.ReactNode> => {
  const { locale } = await params
  const { redirectTo } = await searchParams

  const url = safeRedirectTo(redirectTo)
  const authorizePath = url?.startsWith(`/${locale}/authorize`) ?? false

  let token: string | null = null
  let accounts: SavedAccount[] = []

  await _authFlow(locale, url)

  if (url) {
    const session = await getCurrentSession(locale)

    if (session && authorizePath) {
      const cookies = await getCookies()
      const accountSession = new AccountSession(cookies)
      token = session.jwt
      accounts = await accountSession.getAllAccounts(locale, {
        token: session.jwt,
        user: session.user
      })
    }
  }

  return (
    <Section>
      <SignInClientPage redirectTo={url} accounts={accounts} token={token} />
    </Section>
  )
}

export default SignInPage

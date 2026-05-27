import type React from 'react'

import { SignInClientPage } from '@/app/[locale]/auth/signin/page.client'
import { _public, safeRedirectTo } from '@/lib/auth'
import { getCookies } from 'next-client-cookies/server'
import { UserService } from '@/service/user'
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

  const safePath = safeRedirectTo(redirectTo)
  const authorizePath = safePath?.startsWith(`/${locale}/authorize`) ?? false

  let token: string | null = null
  let accounts: SavedAccount[] = []

  if (safePath) {
    const cookies = await getCookies()
    const accountSession = new AccountSession(cookies)
    const currentToken = accountSession.get()

    if (currentToken) {
      const response = await UserService.get({ jwt: currentToken, locale })
      if (response.error) {
        if (response.status === 401) accountSession.remove(currentToken)
        else throw new Error(response.message)
      } else if (authorizePath) {
        token = currentToken
        accounts = await accountSession.getAllAccounts(locale, {
          token: currentToken,
          user: response.data
        })
      }
    }
  } else {
    await _public(locale)
  }

  return (
    <Section>
      <SignInClientPage redirectTo={safePath} accounts={accounts} token={token} />
    </Section>
  )
}

export default SignInPage

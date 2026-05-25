import type React from 'react'

import { SignInClientPage } from '@/app/[locale]/auth/signin/page.client'
import { _public, safeRedirectTo } from '@/lib/auth'
import { getCookies } from 'next-client-cookies/server'
import { CONSTANTS } from '@/lib/constants'
import { UserService } from '@/service/user'

import { Section } from '@trash-kit/ui'

import type { DynamicPageProps } from '@/types/app/page'
import type { User } from '@/types/api/user'

const SignInPage: React.FC<DynamicPageProps> = async ({
  params,
  searchParams
}: DynamicPageProps): Promise<React.ReactNode> => {
  const { locale } = await params
  const { redirectTo } = await searchParams

  const safePath = safeRedirectTo(redirectTo)

  let user: User | null = null

  if (safePath) {
    const cookies = await getCookies()
    const jwt = cookies.get(CONSTANTS.COOKIES.TOKEN)

    if (jwt) {
      const response = await UserService.get({ jwt, locale })
      if (response.error) {
        if (response.status === 401) cookies.remove(CONSTANTS.COOKIES.TOKEN)
        else throw new Error(response.message)
      } else {
        user = response.data
      }
    }
  } else {
    await _public(locale)
  }

  return (
    <Section>
      <SignInClientPage redirectTo={safePath} currentUser={user} />
    </Section>
  )
}

export default SignInPage

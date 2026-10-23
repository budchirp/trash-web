import type React from 'react'

import { SignInClientPage } from '@/app/[locale]/auth/signin/page.client'
import { getCookies } from 'next-client-cookies/server'
import { getSession, requireAnonymous } from '@/lib/auth'
import { sanitize } from '@/lib/redirect'
import { list } from '@/lib/session'

import { Section } from '@trash-kit/ui'

import type { DynamicPageProps } from '@/types/app/page'

const SignInPage: React.FC<DynamicPageProps> = async ({
  searchParams
}: DynamicPageProps): Promise<React.ReactNode> => {
  const { redirectTo } = await searchParams

  const url = sanitize(redirectTo)

  await requireAnonymous(url)

  const session = url?.includes('/authorize') ? await getSession() : null
  const accounts = session ? await list(await getCookies(), session) : []

  return (
    <Section>
      <SignInClientPage redirectTo={url} accounts={accounts} token={session?.token ?? null} />
    </Section>
  )
}

export default SignInPage

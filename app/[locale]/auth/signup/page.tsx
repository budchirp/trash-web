import type React from 'react'

import { SignUpClientPage } from '@/app/[locale]/auth/signup/page.client'
import { _authFlow } from '@/lib/auth'
import { safeRedirectTo } from '@/lib/redirects'

import { Section } from '@trash-kit/ui'

import type { DynamicPageProps } from '@/types/app/page'

const SignUpPage: React.FC<DynamicPageProps> = async ({
  params,
  searchParams
}: DynamicPageProps): Promise<React.ReactNode> => {
  const { locale } = await params
  const { redirectTo } = await searchParams

  const url = safeRedirectTo(redirectTo)

  await _authFlow(locale, url)

  return (
    <Section>
      <SignUpClientPage redirectTo={url} />
    </Section>
  )
}

export default SignUpPage

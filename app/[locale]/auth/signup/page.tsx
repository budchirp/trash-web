import type React from 'react'

import { SignUpClientPage } from '@/app/[locale]/auth/signup/page.client'
import { _public, safeRedirectTo } from '@/lib/auth'

import { Section } from '@trash-kit/ui'

import type { DynamicPageProps } from '@/types/app/page'

const SignUpPage: React.FC<DynamicPageProps> = async ({
  params,
  searchParams
}: DynamicPageProps): Promise<React.ReactNode> => {
  const { locale } = await params
  const { redirectTo } = await searchParams

  const safePath = safeRedirectTo(redirectTo)

  await _public(locale, safePath)

  return (
    <Section>
      <SignUpClientPage redirectTo={safePath} />
    </Section>
  )
}

export default SignUpPage

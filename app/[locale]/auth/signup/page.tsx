import type React from 'react'

import { SignUpClientPage } from '@/app/[locale]/auth/signup/page.client'
import { requireAnonymous } from '@/lib/auth'
import { sanitize } from '@/lib/redirect'

import { Section } from '@trash-kit/ui'

import type { DynamicPageProps } from '@/types/app/page'

const SignUpPage: React.FC<DynamicPageProps> = async ({
  searchParams
}: DynamicPageProps): Promise<React.ReactNode> => {
  const { redirectTo } = await searchParams

  const url = sanitize(redirectTo)

  await requireAnonymous(url)

  return (
    <Section>
      <SignUpClientPage redirectTo={url} />
    </Section>
  )
}

export default SignUpPage

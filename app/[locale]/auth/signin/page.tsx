import type React from 'react'

import { SignInClientPage } from '@/app/[locale]/auth/signin/page.client'
import { _public } from '@/lib/auth'

import { Section } from '@trash-kit/ui'

const SignInPage: React.FC = async (): Promise<React.ReactNode> => {
  await _public()

  return (
    <Section>
      <SignInClientPage />
    </Section>
  )
}

export default SignInPage

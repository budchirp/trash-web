import type React from 'react'

import { SignUpClientPage } from '@/app/[locale]/auth/signup/page.client'
import { _public } from '@/lib/auth'

import { Section } from '@trash-kit/ui'

const SignUpPage: React.FC = async (): Promise<React.ReactNode> => {
  await _public()

  return (
    <Section>
      <SignUpClientPage />
    </Section>
  )
}

export default SignUpPage

import type React from 'react'

import { requireSession } from '@/lib/auth'

import { DevelopersClientPage } from './page.client'
import { Section } from '@trash-kit/ui'

const Page: React.FC = async (): Promise<React.ReactNode> => {
  const { token, user } = await requireSession('/developers')

  return (
    <Section>
      <DevelopersClientPage token={token} user={user} />
    </Section>
  )
}

export default Page

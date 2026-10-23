import type React from 'react'

import { getTranslations } from 'next-intl/server'
import { requireSession } from '@/lib/auth'
import { LINKS } from '@/lib/link'

import { Container, Section } from '@trash-kit/ui'

const Page: React.FC = async (): Promise<React.ReactNode> => {
  await requireSession(LINKS.dashboard)

  const t = await getTranslations('dashboard')

  return (
    <Section>
      <Container>
        <Section title={t('title')}>Home</Section>
      </Container>
    </Section>
  )
}

export default Page

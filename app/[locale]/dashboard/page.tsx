import type React from 'react'

import { getTranslations } from 'next-intl/server'
import { _authtenticated } from '@/lib/auth'

import { Container, Section } from '@trash-kit/ui'

import type { DynamicPageProps } from '@/types/app/page'

const Page: React.FC<DynamicPageProps> = async ({
  params
}: DynamicPageProps): Promise<React.ReactNode> => {
  await _authtenticated()

  const { locale } = await params
  const t = await getTranslations({
    namespace: 'dashboard',
    locale
  })

  return (
    <Section>
      <Container>
        <Section title={t('title')} description={t('description')}>
          hi
        </Section>
      </Container>
    </Section>
  )
}

export default Page

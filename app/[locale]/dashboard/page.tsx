import type React from 'react'

import { getTranslations } from 'next-intl/server'
import { _authtenticated } from '@/lib/auth'

import { Container, Section } from '@trash-kit/ui'

import type { DynamicPageProps } from '@/types/app/page'

const Page: React.FC<DynamicPageProps> = async ({
  params
}: DynamicPageProps): Promise<React.ReactNode> => {
  const { locale } = await params
  await _authtenticated(locale, `/${locale}/dashboard`)

  const t = await getTranslations({
    namespace: 'dashboard',
    locale
  })

  return (
    <Section>
      <Container>
        <Section title={t('title')} description={t('description')}>
          Dashboard
        </Section>
      </Container>
    </Section>
  )
}

export default Page

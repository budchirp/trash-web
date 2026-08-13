import type React from 'react'

import { ProfileSettingsClientPage } from './page.client'
import { _authenticate } from '@/lib/auth'
import { getTranslations } from 'next-intl/server'

import { Column, Section } from '@trash-kit/ui'

import type { DynamicPageProps } from '@/types/app/page'

const Page: React.FC<DynamicPageProps> = async ({
  params
}: DynamicPageProps): Promise<React.ReactNode> => {
  const { locale } = await params

  const t = await getTranslations({ namespace: 'settings.profile', locale })

  const { jwt, user } = await _authenticate(locale, `/${locale}/settings/profile`)

  return (
    <Column>
      <Section title={t('title')} description={t('description')}>
        <ProfileSettingsClientPage jwt={jwt} locale={locale} user={user} />
      </Section>
    </Column>
  )
}

export default Page

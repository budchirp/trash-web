import type React from 'react'

import { ProfileSettingsClientPage } from './page.client'
import { _authtenticated } from '@/lib/auth'
import { UserService } from '@/service/user'
import { getTranslations } from 'next-intl/server'

import { Column, Section } from '@trash-kit/ui'

import type { DynamicPageProps } from '@/types/app/page'

const Page: React.FC<DynamicPageProps> = async ({
  params
}: DynamicPageProps): Promise<React.ReactNode> => {
  const { locale } = await params

  const t = await getTranslations({ namespace: 'settings.profile', locale })

  const jwt = await _authtenticated(locale, `/${locale}/settings/profile`)
  const user = await UserService.get({ jwt, locale })

  if (user.error) throw new Error(user.message)

  return (
    <Column>
      <Section title={t('title')} description={t('description')}>
        <ProfileSettingsClientPage jwt={jwt} locale={locale} user={user.data} />
      </Section>
    </Column>
  )
}

export default Page

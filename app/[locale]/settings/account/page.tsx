import type React from 'react'

import { AccountClientPage } from './page.client'
import { _authenticate } from '@/lib/auth'
import { getTranslations } from 'next-intl/server'

import { Column, Section } from '@trash-kit/ui'

import type { DynamicPageProps } from '@/types/app/page'

const Page: React.FC<DynamicPageProps> = async ({
  params
}: DynamicPageProps): Promise<React.ReactNode> => {
  const { locale } = await params

  const t = await getTranslations({ namespace: 'settings.account', locale })

  const { user } = await _authenticate(locale, `/${locale}/settings/account`)

  return (
    <Column>
      <Section title={t('title')}>
        <form>
          <AccountClientPage email={user.email} username={user.username} />
        </form>
      </Section>
    </Column>
  )
}

export default Page

import type React from 'react'

import { AccountClientPage } from './page.client'
import { requireSession } from '@/lib/auth'
import { getTranslations } from 'next-intl/server'

import { Column, Section } from '@trash-kit/ui'

import { LINKS } from '@/lib/link'

const Page: React.FC = async (): Promise<React.ReactNode> => {
  const t = await getTranslations('settings.account')

  const { user } = await requireSession(LINKS.settings.account)

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

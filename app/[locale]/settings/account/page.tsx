import { getTranslations } from 'next-intl/server'

import { Section } from '@trash-kit/ui'
import { DetailsTable } from '@/components/ui/details-table'
import { requireSession } from '@/lib/auth'
import { LINKS } from '@/lib/link'

export default async function Page() {
  const t = await getTranslations('settings.account')
  const { user } = await requireSession(LINKS.settings.account)

  return (
    <Section title={t('title')}>
      <DetailsTable
        rows={[
          { label: t('username'), value: user.username },
          { label: t('email'), value: user.email }
        ]}
      />
    </Section>
  )
}

import type React from 'react'

import { CenteredPage } from '@/components/vertical-page'
import { Link } from '@/lib/i18n/navigation'
import { LINKS } from '@/lib/link'
import { getTranslations } from 'next-intl/server'

import { Button } from '@trash-kit/ui'

const ForbiddenPage: React.FC = async (): Promise<React.ReactNode> => {
  const t = await getTranslations('common.forbidden')

  return (
    <CenteredPage title={t('title')} items={[t('description')]}>
      <Link href={LINKS.home}>
        <Button>{t('back')}</Button>
      </Link>
    </CenteredPage>
  )
}

export default ForbiddenPage

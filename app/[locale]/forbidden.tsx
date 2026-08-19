import type React from 'react'

import { CenteredPage } from '@/components/vertical-page'
import { Link } from '@/lib/i18n/routing'
import { LINKS } from '@/lib/link'
import { getTranslations } from 'next-intl/server'

import { Button } from '@trash-kit/ui'

import type { DynamicPageProps } from '@/types/app/page'

const ForbiddenPage: React.FC<DynamicPageProps> = async ({
  params
}: DynamicPageProps): Promise<React.ReactNode> => {
  const { locale } = await params
  const t = await getTranslations({ namespace: 'common.forbidden', locale })

  return (
    <CenteredPage title={t('title')} items={[t('description')]}>
      <Link href={LINKS.home}>
        <Button>{t('back')}</Button>
      </Link>
    </CenteredPage>
  )
}

export default ForbiddenPage

import type React from 'react'

import { unauthorized } from 'next/navigation'
import { getTranslations } from 'next-intl/server'

import { CenteredPage } from '@/components/vertical-page'

type ServiceError = {
  message: string
  status?: number
}

type ServiceErrorScreenProps = {
  response: ServiceError
}

export const ServiceErrorScreen = async ({
  response
}: ServiceErrorScreenProps): Promise<React.ReactNode> => {
  if (response.status === 401) unauthorized()

  const t = await getTranslations()

  return <CenteredPage title={t('common.error')} items={[response.message || t('common.error')]} />
}

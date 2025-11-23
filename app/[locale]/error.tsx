'use client'

import type React from 'react'

import { CenteredPage } from '@/components/vertical-page'
import { MetadataManager } from '@/lib/metadata-manager'
import { useTranslations } from 'next-intl'

import { Button } from '@trash-kit/ui'

import type { ErrorProps } from '@/types/error'
import type { Metadata } from 'next'

const ErrorPage: React.FC<ErrorProps> = ({ error, reset }: ErrorProps): React.ReactNode => {
  const t = useTranslations()

  return (
    <CenteredPage items={[t('common.error')]} title={'500'}>
      <Button onClick={() => reset()}>{t('common.retry')}</Button>
    </CenteredPage>
  )
}

export const metadata: Metadata = MetadataManager.generate('Error', '500')

export default ErrorPage

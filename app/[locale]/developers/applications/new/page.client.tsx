'use client'

import type React from 'react'

import { ApplicationForm } from '@/components/app/developers/applications/form'
import { useTranslations } from 'next-intl'

import { Section } from '@trash-kit/ui'

type NewApplicationClientPageProps = {
  token: string
}

export const NewApplicationClientPage: React.FC<NewApplicationClientPageProps> = ({
  token
}: NewApplicationClientPageProps): React.ReactNode => {
  const t = useTranslations('developers.applications.new')

  return (
    <Section title={t('title')}>
      <ApplicationForm token={token} />
    </Section>
  )
}

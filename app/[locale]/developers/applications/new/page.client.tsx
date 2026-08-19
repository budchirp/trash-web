'use client'

import type React from 'react'

import { ApplicationForm } from '@/components/app/developers/application-form'
import { useTranslations } from 'next-intl'

import { Container, Section } from '@trash-kit/ui'

type NewApplicationClientPageProps = {
  jwt: string
}

export const NewApplicationClientPage: React.FC<NewApplicationClientPageProps> = ({
  jwt
}: NewApplicationClientPageProps): React.ReactNode => {
  const t = useTranslations('developers.applications.new')

  return (
    <Container className='max-w-lg!'>
      <Section title={t('title')}>
        <ApplicationForm jwt={jwt} />
      </Section>
    </Container>
  )
}

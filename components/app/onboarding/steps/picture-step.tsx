'use client'

import type React from 'react'

import { ProfilePictureField } from '@/components/app/settings/profile/profile-picture-field'

import { Button, Column, Heading, Row, Section } from '@trash-kit/ui'
import { useTranslations } from 'next-intl'

type PictureStepProps = {
  onBack: () => void
  src: string | null
  alt: string
  file: File | null
  isSubmitting: boolean
  onFileChange: (file: File | null) => void
}

export const PictureStep: React.FC<PictureStepProps> = ({
  onBack,
  src,
  alt,
  file,
  isSubmitting,
  onFileChange
}: PictureStepProps): React.ReactNode => {
  const t = useTranslations()

  return (
    <Section title={t('profile.picture_step')}>
      <Column className='gap-4'>
        <Column>
          <ProfilePictureField src={src} file={file} alt={alt} onFileChange={onFileChange} />
        </Column>

        <Row className='w-full justify-between'>
          <Button type='button' onClick={onBack}>
            {t('common.back')}
          </Button>

          <Button disabled={isSubmitting} type='submit' loading={isSubmitting}>
            {isSubmitting ? t('common.loading') : t('common.submit')}
          </Button>
        </Row>
      </Column>
    </Section>
  )
}

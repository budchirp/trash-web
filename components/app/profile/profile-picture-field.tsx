'use client'

import type React from 'react'

import { Avatar } from '@/components/app/settings/avatar'
import { useTranslations } from 'next-intl'

import { Column, Divider, Field, Heading, Input, Label, Row, Text } from '@trash-kit/ui'

type ProfilePictureFieldProps = {
  src: string | null
  alt: string
  file: File | null
  onFileChange: (file: File | null) => void
}

export const ProfilePictureField: React.FC<ProfilePictureFieldProps> = ({
  src,
  alt,
  file,
  onFileChange
}: ProfilePictureFieldProps): React.ReactNode => {
  const t = useTranslations('profile')

  return (
    <Column className='gap-4'>
      <Row className='gap-3'>
        <Avatar src={src} alt={alt} className='size-16' showUsername={false} />

        <Heading size='h4'>{file?.name ?? t('no_picture')}</Heading>
      </Row>

      <Field name='picture'>
        <Label>{t('picture')}:</Label>
        <Input
          accept='image/*'
          type='file'
          onChange={(event) => onFileChange(event.target.files?.[0] ?? null)}
        />
      </Field>
    </Column>
  )
}

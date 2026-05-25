'use client'

import type React from 'react'

import { Link } from '@/lib/i18n/routing'
import { useTranslations } from 'next-intl'

import { Button, Column, Field, Input, Label, Row } from '@trash-kit/ui'

type AccountClientPageProps = {
  username: string
  email: string
}

export const AccountClientPage: React.FC<AccountClientPageProps> = ({
  username,
  email
}: AccountClientPageProps): React.ReactNode => {
  const t = useTranslations('settings.account')

  return (
    <Column className='gap-4'>
      <Column className='gap-2'>
        <Field name='username'>
          <Label>{t('username')}:</Label>
          <Input disabled value={username} />
        </Field>

        <Field name='email'>
          <Label>{t('email')}:</Label>
          <Input disabled value={email} />
        </Field>
      </Column>
    </Column>
  )
}

'use client'

import type React from 'react'

import { useTranslations } from 'next-intl'

import { Column, Field, Input, Label } from '@trash-kit/ui'

import type { ProfileInputValues } from '@/service/user/schema'
import type { FieldErrors, UseFormRegister } from 'react-hook-form'

type ProfileFieldsProps = {
  register: UseFormRegister<ProfileInputValues>
  errors: FieldErrors<ProfileInputValues>
}

export const ProfileFields: React.FC<ProfileFieldsProps> = ({
  register,
  errors
}: ProfileFieldsProps): React.ReactNode => {
  const t = useTranslations('profile')
  const t_common = useTranslations('common')

  return (
    <Column className='gap-2'>
      <Field name='name' error={errors.name?.message}>
        <Label>{t('name')}:</Label>
        <Input placeholder={t_common('enter_field', { field: t('name') })} {...register('name')} />
      </Field>

      <Field name='gender' error={errors.gender?.message}>
        <Label>{t('gender')}:</Label>
        <select
          className='w-full rounded-3xl border border-outline bg-surface-primary px-4 py-1.5 text-primary outline-none'
          {...register('gender')}
        >
          <option value=''>{t('gender_empty')}</option>
          <option value='male'>{t('male')}</option>
          <option value='female'>{t('female')}</option>
        </select>
      </Field>
    </Column>
  )
}

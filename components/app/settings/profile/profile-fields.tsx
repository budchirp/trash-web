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
  const t = useTranslations()

  return (
    <Column className='gap-2'>
      <Field name='name' error={errors.name?.message}>
        <Label>{t('auth.form.name')}:</Label>
        <Input
          placeholder={t('common.enter_field', { field: t('auth.form.name') })}
          {...register('name')}
        />
      </Field>

      <Field name='gender' error={errors.gender?.message}>
        <Label>{t('profile.gender.title')}:</Label>
        <select
          className='w-full rounded-3xl border border-outline bg-surface-primary px-4 py-1.5 text-primary outline-none'
          {...register('gender')}
        >
          <option value=''>{t('profile.gender.empty')}</option>
          <option value='male'>{t('profile.gender.male')}</option>
          <option value='female'>{t('profile.gender.female')}</option>
        </select>
      </Field>
    </Column>
  )
}

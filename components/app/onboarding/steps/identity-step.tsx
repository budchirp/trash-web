'use client'

import type React from 'react'

import { ProfileFields } from '@/components/app/settings/profile/profile-fields'

import { Button, Column, Heading, Row, Section } from '@trash-kit/ui'

import type { ProfileInputValues } from '@/service/user/schema'
import type { FieldErrors, UseFormRegister } from 'react-hook-form'
import { useTranslations } from 'next-intl'

type IdentityStepProps = {
  register: UseFormRegister<ProfileInputValues>
  errors: FieldErrors<ProfileInputValues>
  onNext: () => void
}

export const IdentityStep: React.FC<IdentityStepProps> = ({
  register,
  errors,
  onNext
}: IdentityStepProps): React.ReactNode => {
  const t = useTranslations()

  return (
    <Section title={t('profile.identity_step')}>
      <Column className='gap-4'>
        <Column>
          <ProfileFields register={register} errors={errors} />
        </Column>

        <Row className='w-full justify-end'>
          <Button type='button' onClick={onNext}>
            {t('common.next')}
          </Button>
        </Row>
      </Column>
    </Section>
  )
}

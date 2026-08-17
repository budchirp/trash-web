'use client'

import type React from 'react'
import { useContext } from 'react'

import { UserContext } from '@/context/user'
import { handle } from '@/lib/handle-service'
import { UserService } from '@/service/user'
import { profileSchema, type ProfileInputValues, type ProfileValues } from '@/service/user/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLocale, useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'

import {
  Button,
  Checkbox,
  Column,
  Field,
  Input,
  Label,
  Row,
  Select,
  Text,
  toast
} from '@trash-kit/ui'

import type { User } from '@/types/api/user'

type ProfileFormProps = {
  jwt: string
  submitLabel?: string
  onSuccess?: (user: User) => void
}

export const ProfileForm: React.FC<ProfileFormProps> = ({
  jwt,
  submitLabel,
  onSuccess
}: ProfileFormProps): React.ReactNode => {
  const { user, setUser } = useContext(UserContext)

  const locale = useLocale()

  const t = useTranslations('profile')
  const t_common = useTranslations('common')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ProfileInputValues, unknown, ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.profile?.name ?? '',
      gender: user?.profile?.gender ?? '',
      picture: user?.profile?.picture ?? '',
      public: user?.profile?.public ?? false
    }
  })

  const onSubmit = async (values: ProfileValues) => {
    const response = await UserService.updateProfile(
      {
        name: values.name,
        gender: values.gender,
        public: values.public
      },
      { jwt, locale }
    )

    if (handle(response)) return

    let updatedUser: User | null = null
    if (response.data && user) {
      updatedUser = {
        ...user,
        profile: { ...user.profile, ...response.data }
      }
      setUser(updatedUser)
    }

    if (onSuccess) {
      onSuccess(updatedUser ?? user!)
    } else {
      toast(response.message || t_common('success'))
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Column className='gap-4'>
        <Column className='gap-2'>
          <Field name='name' error={errors.name?.message}>
            <Label>{t('name')}:</Label>
            <Input
              placeholder={t_common('enter_field', { field: t('name') })}
              {...register('name')}
            />
          </Field>

          <Field name='gender' error={errors.gender?.message}>
            <Label>{t('gender.title')}:</Label>
            <Select {...register('gender')}>
              <option value=''>{t('gender.empty')}</option>
              <option value='male'>{t('gender.male')}</option>
              <option value='female'>{t('gender.female')}</option>
            </Select>
          </Field>

          <Field name='public' error={errors.public?.message}>
            <Checkbox {...register('public')}>
              <Text>{t('public')}</Text>
            </Checkbox>
          </Field>
        </Column>

        <Row className='w-full justify-end'>
          <Button disabled={isSubmitting} type='submit' loading={isSubmitting}>
            {isSubmitting ? t_common('loading') : (submitLabel ?? t_common('save'))}
          </Button>
        </Row>
      </Column>
    </form>
  )
}

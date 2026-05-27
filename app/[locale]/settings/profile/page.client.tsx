'use client'

import type React from 'react'
import { useEffect, useState } from 'react'

import { ProfileFields } from '@/components/app/settings/profile/profile-fields'
import { ProfilePictureField } from '@/components/app/settings/profile/profile-picture-field'
import { profileSchema, type ProfileInputValues, type ProfileValues } from '@/service/user/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { UserService } from '@/service/user'
import { useForm } from 'react-hook-form'
import { useTranslations } from 'next-intl'

import { Button, Column, Row, toast } from '@trash-kit/ui'

import type { User } from '@/types/api/user'

type ProfileSettingsClientPageProps = {
  jwt: string
  locale: string
  user: User
}

export const ProfileSettingsClientPage: React.FC<ProfileSettingsClientPageProps> = ({
  jwt,
  locale,
  user
}: ProfileSettingsClientPageProps): React.ReactNode => {
  const t = useTranslations('profile')
  const t_common = useTranslations('common')

  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ProfileInputValues, unknown, ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.profile?.name ?? '',
      gender: user.profile?.gender ?? '',
      picture: user.profile?.picture ?? ''
    }
  })

  useEffect(() => {
    if (!file || !file.type.startsWith('image/')) {
      setPreview(null)
      return
    }

    const url = URL.createObjectURL(file)
    setPreview(url)

    return () => URL.revokeObjectURL(url)
  }, [file])

  const onSubmit = async (values: ProfileValues) => {
    const profile = await UserService.updateProfile(values, { jwt, locale })
    if (profile.error) {
      toast(profile.message)
      return
    }

    toast(profile.message || t_common('success'))
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Column className='gap-4'>
        <Column className='gap-2'>
          <ProfileFields register={register} errors={errors} />

          <ProfilePictureField
            src={preview}
            alt={file?.name ?? user.profile?.name ?? user.username}
            file={file}
            onFileChange={setFile}
          />
        </Column>

        <Row className='w-full justify-end'>
          <Button disabled={isSubmitting} type='submit' loading={isSubmitting}>
            {isSubmitting ? t_common('loading') : t('submit')}
          </Button>
        </Row>
      </Column>
    </form>
  )
}

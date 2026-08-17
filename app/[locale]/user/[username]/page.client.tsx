'use client'

import type React from 'react'

import { ProfileView } from '@/components/app/user/profile/profile-view'
import { Avatar } from '@/components/app/user/avatar'
import { useTranslations } from 'next-intl'
import { Link } from '@/lib/i18n/routing'

import { Button, Row, Heading } from '@trash-kit/ui'

import type { User } from '@/types/api/user'

type ProfileClientPageProps = {
  user: User
  isCurrentUser?: boolean
}

export const ProfileClientPage: React.FC<ProfileClientPageProps> = ({
  user,
  isCurrentUser = false
}): React.ReactNode => {
  const t = useTranslations('profile')

  const profile = user.profile

  const isRedacted = !isCurrentUser && (profile == null || profile.public === false)

  return (
    <ProfileView
      avatar={
        <Avatar
          user={isRedacted ? null : (user as User)}
          className='size-32 md:size-48'
          showUsername={false}
        />
      }
      header={
        <Row className='gap-4'>
          {isCurrentUser && (
            <Link href={`/user/${encodeURIComponent(user.username)}/edit`}>
              <Button>{t('edit')}</Button>
            </Link>
          )}
        </Row>
      }
    >
      {isRedacted ||
        (profile?.name && (
          <Heading size='h1'>{isRedacted ? t('private_title') : profile?.name}</Heading>
        ))}

      <Heading size='h3' className='text-content-tertiary'>
        @{user.username}
      </Heading>
    </ProfileView>
  )
}

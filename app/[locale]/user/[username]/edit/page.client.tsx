'use client'

import type React from 'react'

import { ProfileForm } from '@/components/app/user/profile/profile-form'
import { ProfileView } from '@/components/app/user/profile/profile-view'
import { Avatar } from '@/components/app/user/avatar'

import type { User } from '@/types/api/user'

type ProfileEditClientPageProps = {
  token: string

  user: User
}

export const ProfileEditClientPage: React.FC<ProfileEditClientPageProps> = ({
  token
}): React.ReactNode => {
  return (
    <ProfileView avatar={<Avatar token={token} className='size-32 md:size-48' />}>
      <ProfileForm token={token} />
    </ProfileView>
  )
}

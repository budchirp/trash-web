'use client'

import type React from 'react'

import { ProfileForm } from '@/components/app/user/profile/profile-form'
import { ProfileView } from '@/components/app/user/profile/profile-view'
import { Avatar } from '@/components/app/user/avatar'

import type { User } from '@/types/api/user'

type ProfileEditClientPageProps = {
  jwt: string

  user: User
}

export const ProfileEditClientPage: React.FC<ProfileEditClientPageProps> = ({
  jwt
}): React.ReactNode => {
  return (
    <ProfileView avatar={<Avatar jwt={jwt} className='size-32 md:size-48' />}>
      <ProfileForm jwt={jwt} />
    </ProfileView>
  )
}

'use client'

import type React from 'react'

import { ProfileCard } from '@/components/app/profile/profile-card'

import type { User } from '@/types/api/user'

type ProfileClientPageProps = {
  user: User
}

export const ProfileClientPage: React.FC<ProfileClientPageProps> = ({
  user
}: ProfileClientPageProps): React.ReactNode => <ProfileCard user={user} />

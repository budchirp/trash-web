import type React from 'react'

import { requireSession } from '@/lib/auth'
import { forbidden } from 'next/navigation'

import type { DynamicPageProps } from '@/types/app/page'
import { Avatar } from '@/components/app/user/avatar'
import { ProfileForm } from '@/components/app/user/profile/profile-form'
import { ProfileView } from '@/components/app/user/profile/profile-view'

const Page: React.FC<DynamicPageProps> = async ({
  params
}: DynamicPageProps): Promise<React.ReactNode> => {
  const { username } = await params
  const { token, user } = await requireSession(`/user/${username}/edit`)

  if (user.username !== username) forbidden()

  return (
    <ProfileView avatar={<Avatar token={token} className='size-32 md:size-48' />}>
      <ProfileForm token={token} />
    </ProfileView>
  )
}

export default Page

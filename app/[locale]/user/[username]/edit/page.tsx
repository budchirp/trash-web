import type React from 'react'

import { requireSession } from '@/lib/auth'
import { forbidden } from 'next/navigation'

import type { DynamicPageProps } from '@/types/app/page'
import { ProfileEditClientPage } from './page.client'

const Page: React.FC<DynamicPageProps> = async ({
  params
}: DynamicPageProps): Promise<React.ReactNode> => {
  const { username } = await params
  const { token, user } = await requireSession(`/user/${username}/edit`)

  if (user.username !== username) forbidden()

  return <ProfileEditClientPage token={token} user={user} />
}

export default Page

import type React from 'react'

import { _authenticate } from '@/lib/auth'
import { forbidden } from 'next/navigation'

import type { DynamicPageProps } from '@/types/app/page'
import { ProfileEditClientPage } from './page.client'

const Page: React.FC<DynamicPageProps> = async ({
  params
}: DynamicPageProps): Promise<React.ReactNode> => {
  const { locale, username } = await params
  const { jwt, user } = await _authenticate(locale, `/${locale}/user/${username}/edit`)

  if (user.username !== username) forbidden()

  return <ProfileEditClientPage jwt={jwt} user={user} />
}

export default Page

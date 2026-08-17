import type React from 'react'

import { ProfileClientPage } from '@/app/[locale]/user/[username]/page.client'
import { UserService } from '@/service/user'
import { _authenticate } from '@/lib/auth'
import { notFound } from 'next/navigation'

import type { DynamicPageProps } from '@/types/app/page'
import type { User } from '@/types/api/user'

const Page: React.FC<DynamicPageProps> = async ({
  params
}: DynamicPageProps): Promise<React.ReactNode> => {
  const { locale, username } = await params

  const { jwt, user } = await _authenticate(locale, `/user/${username}`)

  if (user.username === username) {
    return <ProfileClientPage user={user} isCurrentUser />
  }

  const response = await UserService.getByUsername(username, { jwt, locale })
  if (response.error) {
    if (response.status === 404) notFound()
    throw new Error(response.message)
  }

  return <ProfileClientPage user={response.data as User} />
}

export default Page

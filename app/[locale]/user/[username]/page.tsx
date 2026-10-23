import type React from 'react'

import { ProfileClientPage } from '@/app/[locale]/user/[username]/page.client'
import { UserService } from '@/service/user'
import { requireSession } from '@/lib/auth'
import { notFound } from 'next/navigation'

import type { DynamicPageProps } from '@/types/app/page'
import type { User } from '@/types/api/user'

const Page: React.FC<DynamicPageProps> = async ({
  params
}: DynamicPageProps): Promise<React.ReactNode> => {
  const { username } = await params

  const { token, user } = await requireSession(`/user/${username}`)

  if (user.username === username) {
    return <ProfileClientPage user={user} isCurrentUser />
  }

  const response = await UserService.getByUsername(username, token)
  if (response.error) {
    if (response.status === 404) notFound()
    throw new Error(response.message)
  }

  return <ProfileClientPage user={response.data as User} />
}

export default Page

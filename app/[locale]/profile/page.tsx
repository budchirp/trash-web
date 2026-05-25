import type React from 'react'

import { ProfileClientPage } from './page.client'
import { _authtenticated } from '@/lib/auth'
import { UserService } from '@/service/user'

import type { DynamicPageProps } from '@/types/app/page'

const Page: React.FC<DynamicPageProps> = async ({
  params
}: DynamicPageProps): Promise<React.ReactNode> => {
  const { locale } = await params
  
  const jwt = await _authtenticated(locale, `/${locale}/profile`)
  const user = await UserService.get({ jwt, locale })

  if (user.error) throw new Error(user.message)

  return <ProfileClientPage user={user.data} />
}

export default Page

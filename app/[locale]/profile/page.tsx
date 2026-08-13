import type React from 'react'

import { ProfileClientPage } from './page.client'
import { _authenticate } from '@/lib/auth'

import type { DynamicPageProps } from '@/types/app/page'

const Page: React.FC<DynamicPageProps> = async ({
  params
}: DynamicPageProps): Promise<React.ReactNode> => {
  const { locale } = await params

  const { user } = await _authenticate(locale, `/${locale}/profile`)

  return <ProfileClientPage user={user} />
}

export default Page

import type React from 'react'

import { _authenticate } from '@/lib/auth'
import { redirect } from 'next/navigation'

import type { DynamicPageProps } from '@/types/app/page'
import { NewApplicationClientPage } from './page.client'

const Page: React.FC<DynamicPageProps> = async ({
  params
}: DynamicPageProps): Promise<React.ReactNode> => {
  const { locale } = await params
  const { jwt, user } = await _authenticate(locale, `/${locale}/developers/applications/new`)

  if (!user.profile?.dev) redirect(`/${locale}/developers`)

  return <NewApplicationClientPage jwt={jwt} />
}

export default Page

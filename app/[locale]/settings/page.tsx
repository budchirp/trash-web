import type React from 'react'

import { redirect } from 'next/navigation'
import { LINKS } from '@/lib/link'

import type { DynamicPageProps } from '@/types/app/page'

const Page: React.FC<DynamicPageProps> = async ({
  params
}: DynamicPageProps): Promise<React.ReactNode> => {
  const { locale } = await params

  redirect(`/${locale}${LINKS.settings.account}`)
}

export default Page

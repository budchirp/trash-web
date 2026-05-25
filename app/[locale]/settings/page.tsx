import type React from 'react'

import { redirect } from 'next/navigation'

import type { DynamicPageProps } from '@/types/app/page'

const Page: React.FC<DynamicPageProps> = async ({
  params
}: DynamicPageProps): Promise<React.ReactNode> => {
  const { locale } = await params

  redirect(`/${locale}/settings/account`)
}

export default Page

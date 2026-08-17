import type React from 'react'

import { OnboardingClientPage } from './page.client'
import { _authenticate } from '@/lib/auth'
import { safeRedirectTo } from '@/lib/redirects'
import { redirect } from 'next/navigation'

import type { DynamicPageProps } from '@/types/app/page'

const Page: React.FC<DynamicPageProps> = async ({
  params,
  searchParams
}: DynamicPageProps): Promise<React.ReactNode> => {
  const { locale } = await params
  const { redirectTo } = await searchParams

  const url = safeRedirectTo(redirectTo)
  const query = url ? `?redirectTo=${encodeURIComponent(url)}` : ''

  const { jwt, user } = await _authenticate(locale, `/onboarding${query}`)

  if (user.profile?.name?.trim()) {
    redirect(url ?? `/${locale}/dashboard`)
  }

  return <OnboardingClientPage jwt={jwt} redirectTo={url} />
}

export default Page

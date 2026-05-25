import type React from 'react'

import { OnboardingClientPage } from './page.client'
import { _authtenticated, safeRedirectTo } from '@/lib/auth'
import { UserService } from '@/service/user'
import { redirect } from 'next/navigation'

import type { DynamicPageProps } from '@/types/app/page'
import { Section } from '@trash-kit/ui'

const Page: React.FC<DynamicPageProps> = async ({
  params,
  searchParams
}: DynamicPageProps): Promise<React.ReactNode> => {
  const { locale } = await params
  const { redirectTo } = await searchParams

  const safePath = safeRedirectTo(redirectTo)
  const query = safePath ? `?redirectTo=${encodeURIComponent(safePath)}` : ''

  const jwt = await _authtenticated(locale, `/${locale}/onboarding${query}`)

  const user = await UserService.get({ jwt, locale })
  if (user.error) throw new Error(user.message)

  if (!user.data?.profile?.name?.trim()) {
    redirect(safePath ?? `/${locale}/dashboard`)
  }

  return (
    <OnboardingClientPage jwt={jwt} locale={locale} user={user.data} redirectTo={safePath} />
  )
}

export default Page

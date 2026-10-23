import type React from 'react'

import { OnboardingClientPage } from './page.client'
import { requireSession } from '@/lib/auth'
import { sanitize, withRedirect } from '@/lib/redirect'
import { redirect } from '@/lib/i18n/navigation'
import { getLocale } from 'next-intl/server'
import { LINKS } from '@/lib/link'

import type { DynamicPageProps } from '@/types/app/page'

const Page: React.FC<DynamicPageProps> = async ({
  searchParams
}: DynamicPageProps): Promise<React.ReactNode> => {
  const { redirectTo } = await searchParams

  const url = sanitize(redirectTo)

  const { token, user } = await requireSession(withRedirect(LINKS.onboarding, url))

  if (user.profile?.name?.trim()) {
    redirect({ href: url ?? LINKS.dashboard, locale: await getLocale() })
  }

  return <OnboardingClientPage token={token} redirectTo={url} />
}

export default Page

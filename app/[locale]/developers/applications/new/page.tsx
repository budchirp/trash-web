import type React from 'react'

import { requireSession } from '@/lib/auth'
import { redirect } from '@/lib/i18n/navigation'
import { getLocale } from 'next-intl/server'

import { LINKS } from '@/lib/link'
import { NewApplicationClientPage } from './page.client'

const Page: React.FC = async (): Promise<React.ReactNode> => {
  const { token, user } = await requireSession(LINKS.developers.newApplication)

  if (!user.profile?.dev) {
    redirect({ href: LINKS.developers.root, locale: await getLocale() })
  }

  return <NewApplicationClientPage token={token} />
}

export default Page

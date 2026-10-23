import type React from 'react'

import { getLocale } from 'next-intl/server'
import { redirect } from '@/lib/i18n/navigation'
import { LINKS } from '@/lib/link'

const Page: React.FC = async (): Promise<React.ReactNode> => {
  return redirect({ href: LINKS.settings.account, locale: await getLocale() })
}

export default Page

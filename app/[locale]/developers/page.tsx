import { getLocale } from 'next-intl/server'
import { redirect } from '@/lib/i18n/navigation'
import { LINKS } from '@/lib/link'

export default async function Page() {
  return redirect({ href: LINKS.developers.applications, locale: await getLocale() })
}

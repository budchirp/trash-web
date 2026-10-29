import { notFound } from 'next/navigation'
import { getLocale } from 'next-intl/server'
import { requireDeveloper } from '@/lib/auth'
import { redirect } from '@/lib/i18n/navigation'
import { LINKS } from '@/lib/link'
import { withRedirect } from '@/lib/redirect'
import { ApplicationService } from '@/service/application'

export const getDeveloperApplication = async (id: string, returnTo: string) => {
  const { token } = await requireDeveloper(returnTo)
  const application = await ApplicationService.get(id, token)

  if (application.error) {
    if (application.status === 404) notFound()
    if (application.status === 401) {
      redirect({
        href: withRedirect(LINKS.auth.signIn, returnTo),
        locale: await getLocale()
      })
    }
  }

  return { token, application }
}

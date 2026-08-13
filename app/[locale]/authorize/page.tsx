import type React from 'react'

import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'

import { AuthorizeClientPage } from './page.client'
import { ApplicationService } from '@/service/application'
import { _authenticate } from '@/lib/auth'
import { getSignInPath } from '@/lib/redirects'
import { ServiceError } from '@/components/service-error'

import { Container, Section } from '@trash-kit/ui'

import type { DynamicPageProps } from '@/types/app/page'

const Page: React.FC<DynamicPageProps> = async ({
  params,
  searchParams: _searchParams
}: DynamicPageProps): Promise<React.ReactNode> => {
  const { locale } = await params
  const t = await getTranslations('auth.authorize')

  const searchParams = await _searchParams
  const redirectTo = `/${locale}/authorize?${new URLSearchParams(
    Object.entries(searchParams).filter((entry): entry is [string, string] => Boolean(entry[1]))
  ).toString()}`

  const { jwt, user } = await _authenticate(locale, redirectTo)

  const { callback, id, permissions } = searchParams

  const renderError = (message: string): React.ReactNode => (
    <Container className='max-w-lg!'>
      <Section title={t('title')}>
        <ServiceError message={message} />
      </Section>
    </Container>
  )

  if (!id || !callback || !permissions) return renderError(t('invalid_request'))

  const application = await ApplicationService.get(id, { jwt, locale })
  if (application.error) {
    if (application.status === 401) redirect(getSignInPath(redirectTo))

    return renderError(application.message)
  }

  return (
    <Section>
      <AuthorizeClientPage
        jwt={jwt}
        user={user}
        callback={callback}
        application={application.data}
        permissions={permissions?.split(',') || []}
      />
    </Section>
  )
}

export default Page

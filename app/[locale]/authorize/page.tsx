import type React from 'react'

import { AuthorizeClientPage } from './page.client'
import { ApplicationService } from '@/service/application'
import { _authenticate } from '@/lib/auth'
import { ServiceErrorScreen } from '@/components/service-error-screen'

import { Section } from '@trash-kit/ui'

import type { DynamicPageProps } from '@/types/app/page'

const Page: React.FC<DynamicPageProps> = async ({
  params,
  searchParams: _searchParams
}: DynamicPageProps): Promise<React.ReactNode> => {
  const { locale } = await params

  const searchParams = await _searchParams
  const redirectTo = `/${locale}/authorize?${new URLSearchParams(
    Object.entries(searchParams).filter((entry): entry is [string, string] => Boolean(entry[1]))
  ).toString()}`

  const { jwt, user } = await _authenticate(locale, redirectTo)

  const { callback, id, permissions } = searchParams

  if (!id || !callback || !permissions) {
    return <ServiceErrorScreen response={{ message: 'Invalid authorization request' }} />
  }

  const application = await ApplicationService.get(id, { jwt, locale })
  if (application.error) return <ServiceErrorScreen response={application} />

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

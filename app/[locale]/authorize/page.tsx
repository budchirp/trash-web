import type React from 'react'

import { getTranslations } from 'next-intl/server'

import { AuthorizeClientPage } from './page.client'
import { ApplicationService } from '@/service/application'
import { requireSession } from '@/lib/auth'

import { Alert, Container, Section } from '@trash-kit/ui'

import type { DynamicPageProps } from '@/types/app/page'

const Page: React.FC<DynamicPageProps> = async ({
  searchParams: _searchParams
}: DynamicPageProps): Promise<React.ReactNode> => {
  const t = await getTranslations('auth.authorize')

  const searchParams = await _searchParams
  const redirectTo = `/authorize?${new URLSearchParams(
    Object.entries(searchParams).filter((entry): entry is [string, string] => Boolean(entry[1]))
  ).toString()}`

  const { token, user } = await requireSession(redirectTo)

  const { callback, id, permissions } = searchParams

  const error = (message: string): React.ReactNode => (
    <Container className='max-w-lg!'>
      <Section title={t('title')}>
        <Alert color='danger' description={message} />
      </Section>
    </Container>
  )

  if (!id || !callback || !permissions) return error(t('invalid_request'))

  const application = await ApplicationService.get(id, token)
  if (application.error) {
    return error(application.message)
  }

  return (
    <Section>
      <AuthorizeClientPage
        token={token}
        user={user}
        callback={callback}
        application={application.data}
        permissions={permissions?.split(',') || []}
      />
    </Section>
  )
}

export default Page

import type React from 'react'

import { AuthorizeClientPage } from './page.client'
import { ApplicationService } from '@/service/application'
import { _authtenticated } from '@/lib/auth'

import { Section } from '@trash-kit/ui'

import type { DynamicPageProps } from '@/types/app/page'
import type { Application } from '@/types/api/application'

const Page: React.FC<DynamicPageProps> = async ({
  params,
  searchParams
}: DynamicPageProps): Promise<React.ReactNode> => {
  const jwt = await _authtenticated()

  const { locale } = await params
  const { callback, id, permissions } = await searchParams

  const { data } = await ApplicationService.get(id as string, { jwt, locale })

  return (
    <Section>
      <AuthorizeClientPage
        jwt={jwt}
        callback={callback as string}
        application={data as Application}
        permissions={permissions?.split(',') || []}
      />
    </Section>
  )
}

export default Page

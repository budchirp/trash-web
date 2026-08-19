import type React from 'react'

import { _authenticate } from '@/lib/auth'

import type { DynamicPageProps } from '@/types/app/page'
import { DevelopersClientPage } from './page.client'
import { Section } from '@trash-kit/ui'

const Page: React.FC<DynamicPageProps> = async ({
  params
}: DynamicPageProps): Promise<React.ReactNode> => {
  const { locale } = await params
  const { jwt, user } = await _authenticate(locale, `/${locale}/developers`)

  return (
    <Section>
      <DevelopersClientPage jwt={jwt} user={user} />
    </Section>
  )
}

export default Page

import type React from 'react'

import { getTranslations } from 'next-intl/server'
import { _authtenticated } from '@/lib/auth'

import { Box, BoxContent, Column, Section, Text } from '@trash-kit/ui'

import type { DynamicPageProps } from '@/types/app/page'
import { UserService } from '@/service/user'

const Page: React.FC<DynamicPageProps> = async ({
  params
}: DynamicPageProps): Promise<React.ReactNode> => {
  const jwt = await _authtenticated()

  const { locale } = await params
  const t = await getTranslations({
    namespace: 'settings.account',
    locale
  })

  const { data: user } = await UserService.get({ jwt })

  return (
    <Column>
      <Section title={t('title')} description={t('description')}>
        <Box>
          <BoxContent>
            <Text>{JSON.stringify(user)}</Text>
          </BoxContent>
        </Box>
      </Section>
    </Column>
  )
}

export default Page

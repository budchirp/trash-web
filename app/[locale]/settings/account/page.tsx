import type React from 'react'

import { getCookies } from 'next-client-cookies/server'
import { getTranslations } from 'next-intl/server'
import { authenticatedRoute } from '@/lib/auth'
import { CONSTANTS } from '@/lib/constants'

import { Box, BoxContent, Column, Container, Section, Text } from '@trash-kit/ui'

import type { DynamicPageProps } from '@/types/page'

const Page: React.FC<DynamicPageProps> = async ({
  params
}: DynamicPageProps): Promise<React.ReactNode> => {
  const cookies = await getCookies()
  const token = cookies.get(CONSTANTS.COOKIES.TOKEN)

  const user = await authenticatedRoute(token)

  const { locale } = await params
  const t = await getTranslations({
    namespace: 'settings.account',
    locale
  })

  return (
    <Column padding='md'>
      <Container>
        <Section title={t('title')} description={t('description')}>
          <Box>
            <BoxContent>
              <Text>{JSON.stringify(user)}</Text>
            </BoxContent>
          </Box>
        </Section>
      </Container>
    </Column>
  )
}

export default Page

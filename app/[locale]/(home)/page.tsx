import type React from 'react'

import { getCookies } from 'next-client-cookies/server'
import { getTranslations } from 'next-intl/server'
import { CONSTANTS } from '@/lib/constants'
import { Link } from '@/lib/i18n/routing'

import {
  Box,
  BoxContent,
  Button,
  Column,
  Container,
  Grid,
  Heading,
  Row,
  Section
} from '@trash-kit/ui'

import type { DynamicPageProps } from '@/types/page'

const Page: React.FC<DynamicPageProps> = async ({
  params
}: DynamicPageProps): Promise<React.ReactNode> => {
  const cookies = await getCookies()
  const token = cookies.get(CONSTANTS.COOKIES.TOKEN)

  const { locale } = await params
  const t = await getTranslations({
    namespace: 'home',
    locale
  })

  const t_auth = await getTranslations({
    namespace: 'auth',
    locale
  })

  const apps = [
    {
      name: t('services.app.account.name'),
      description: t('services.app.account.description'),
      url: '/settings/account'
    }
  ]

  return (
    <Container>
      {token && (
        <Column padding='page'>
          <Section title={t('services.title')} description={t('services.description')}>
            <Grid>
              {apps.map((app, index) => (
                <Box className='hover:bg-surface-secondary' key={index}>
                  <Link href={app.url}>
                    <BoxContent className='gap-0'>
                      <Heading size='h3'>{app.name}</Heading>
                      <Heading size='h5'>{app.description}</Heading>
                    </BoxContent>
                  </Link>
                </Box>
              ))}
            </Grid>
          </Section>
        </Column>
      )}

      {!token && (
        <Column className='h-screen_ items-center pb-32 justify-center w-full'>
          <Column className='gap-1 justify-center items-center text-center'>
            <Heading size='h1'>{t('welcome.title')}</Heading>
            <Heading size='h3'>{t('welcome.description')}</Heading>
          </Column>

          <Row>
            <Link href='/auth/signin'>
              <Button>{t_auth('sign_in.title')}</Button>
            </Link>

            <Link href='/auth/signup'>
              <Button>{t_auth('sign_up.title')}</Button>
            </Link>
          </Row>
        </Column>
      )}
    </Container>
  )
}

export default Page

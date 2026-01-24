import type React from 'react'

import { getTranslations } from 'next-intl/server'
import { Link } from '@/lib/i18n/routing'
import { _public } from '@/lib/auth'

import { Button, Center, Column, Container, Heading, Row } from '@trash-kit/ui'

import type { DynamicPageProps } from '@/types/app/page'

const Page: React.FC<DynamicPageProps> = async ({
  params
}: DynamicPageProps): Promise<React.ReactNode> => {
  await _public()

  const { locale } = await params
  const t = await getTranslations({
    locale
  })

  return (
    <Container>
      <Center className='h-screen_ items-center justify-center gap-4'>
        <Column className='text-center gap-1 w-fit'>
          <Heading size='h1'>{t('home.title')}</Heading>
          <Heading size='h3' className='text-tertiary'>
            {t('home.description')}
          </Heading>
        </Column>

        <Row className='gap-2'>
          <Link href='/auth/signin'>
            <Button>{t('auth.sign_in.title')}</Button>
          </Link>

          <Link href='/auth/signup'>
            <Button>{t('auth.sign_up.title')}</Button>
          </Link>
        </Row>
      </Center>
    </Container>
  )
}

export default Page

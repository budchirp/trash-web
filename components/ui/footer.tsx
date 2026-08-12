import type React from 'react'

import { getTranslations } from 'next-intl/server'
import { Link } from '@/lib/i18n/routing'
import { Logo } from '@/components/logo'

import { BoxContent, Container, Divider, Row, Text } from '@trash-kit/ui'

export const Footer: React.FC = async (): Promise<React.ReactNode> => {
  const t = await getTranslations()

  return (
    <footer className='bg-surface-primary/50 backdrop-blur-xs border-t border-outline w-full'>
      <Container>
        <BoxContent padding='md' className='px-0'>
          <Row className='gap-2 justify-between'>
            <Logo />
          </Row>
        </BoxContent>

        <Divider />

        <BoxContent padding='md' className='px-0'>
          <Row className='gap-2 justify-between'>
            <Text className='font-medium'>Made by Can Kolay with ❤️</Text>

            <Row className='gap-4'>
              <Link href='/help/legal/terms-of-service'>
                <Text className='text-content-tertiary'>{t('legal.terms.title')}</Text>
              </Link>

              <Link href='/help/legal/privacy-policy'>
                <Text className='text-content-tertiary'>{t('legal.privacy.title')}</Text>
              </Link>
            </Row>
          </Row>
        </BoxContent>
      </Container>
    </footer>
  )
}

Footer.displayName = 'Footer'

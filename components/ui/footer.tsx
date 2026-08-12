'use client'

import type React from 'react'

import { SelectableLink } from '@/components/link'
import { useTranslations } from 'next-intl'
import { Logo } from '@/components/logo'

import { BoxContent, Container, Divider, Row, Text } from '@trash-kit/ui'

export const Footer: React.FC = (): React.ReactNode => {
  const t = useTranslations()

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
              <SelectableLink url='/help/legal/terms-of-service' label={t('legal.terms.title')} />

              <SelectableLink url='/help/legal/privacy-policy' label={t('legal.privacy.title')} />
            </Row>
          </Row>
        </BoxContent>
      </Container>
    </footer>
  )
}

Footer.displayName = 'Footer'

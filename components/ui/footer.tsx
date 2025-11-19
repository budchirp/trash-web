import type React from 'react'

import { Logo } from '@/components/logo'

import { BoxContent, Container, Divider, Row, Text } from '@trash-kit/ui'

export const Footer: React.FC = (): React.ReactNode => (
  <footer className='bg-surface-primary/50 backdrop-blur-xs border-t border-outline w-full'>
    <Container>
      <BoxContent padding='none' className='py-4'>
        <Row className='gap-2 justify-between'>
          <Logo />
        </Row>
      </BoxContent>

      <Divider />

      <BoxContent padding='none' className='py-4'>
        <Row className='gap-2 justify-between'>
          <Text className='font-medium text-secondary-accent'>Made by Can Kolay with ❤️</Text>
        </Row>
      </BoxContent>
    </Container>
  </footer>
)

Footer.displayName = 'Footer'

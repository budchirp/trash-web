import type React from 'react'

import { Avatar } from './avatar'
import { Links } from './links'

import { Column, Container, Row, Section } from '@trash-kit/ui'

import type { LayoutProps } from '@/types/app/layout'

const Layout: React.FC<LayoutProps> = async ({ children }: LayoutProps) => {
  return (
    <Section>
      <Container>
        <Row className='w-full flex-col md:gap-4 md:flex-row items-start'>
          <Column className='w-full h-min md:w-1/4'>
            <Section title={<Avatar />}>
              <Links />
            </Section>
          </Column>

          <Column className='w-full md:w-3/4 grow md:px-4'>{children}</Column>
        </Row>
      </Container>
    </Section>
  )
}

export default Layout

import type React from 'react'

import { Column, Container, Row, Section } from '@trash-kit/ui'

type SplitLayoutProps = {
  sidebar: React.ReactNode
  children: React.ReactNode
}

export const SplitLayout: React.FC<SplitLayoutProps> = ({
  sidebar,
  children
}: SplitLayoutProps): React.ReactNode => (
  <Section>
    <Container>
      <Row className='w-full flex-col md:gap-4 md:flex-row items-start'>
        <Column className='w-full md:w-1/4 h-min'>{sidebar}</Column>

        <Column className='w-full min-w-0 md:w-3/4 grow md:px-4'>{children}</Column>
      </Row>
    </Container>
  </Section>
)

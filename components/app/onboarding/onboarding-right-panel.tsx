'use client'

import { Column, Container } from '@trash-kit/ui'
import type React from 'react'

type OnboardingRightPanelProps = {
  children: React.ReactNode
}

export const OnboardingRightPanel: React.FC<OnboardingRightPanelProps> = ({
  children
}: OnboardingRightPanelProps): React.ReactNode => (
  <section className='flex lg:items-center size-full lg:px-4'>
    <Container className='flex justify-center lg:justify-start'>
      <Column className='gap-8 max-w-sm'>
        {children}
      </Column>
    </Container>
  </section>
)

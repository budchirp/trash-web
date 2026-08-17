'use client'

import type React from 'react'

import { Column, Container, Row } from '@trash-kit/ui'

type ProfileViewProps = {
  avatar: React.ReactNode
  header?: React.ReactNode | null
  children: React.ReactNode
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  avatar,
  header = null,
  children
}: ProfileViewProps): React.ReactNode => {
  return (
    <div>
      <div className='h-48 md:h-64 bg-linear-to-br border-b border-outline from-accent-500/80 to-accent-700' />

      <Container>
        <Column className='gap-4'>
          <Row className='items-center -mt-24 flex-col md:flex-row md:items-end gap-8'>
            {avatar}

            {header && <Column className='gap-2 pb-8 items-center md:items-start'>{header}</Column>}
          </Row>

          <Column className='text-center md:text-left'>{children}</Column>
        </Column>
      </Container>
    </div>
  )
}

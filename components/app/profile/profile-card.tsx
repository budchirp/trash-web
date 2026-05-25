'use client'

import type React from 'react'

import { Avatar } from '@/components/app/settings/avatar'

import { BoxContent, Column, Container, Heading, Row, Text } from '@trash-kit/ui'

import type { User } from '@/types/api/user'

type ProfileCardProps = {
  user: User
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  user
}: ProfileCardProps): React.ReactNode => {
  return (
    <div>
      <div className='h-48 md:h-64 bg-linear-to-br border-b border-outline from-accent-500/80 to-accent-700' />

      <Container>
        <Row className='items-center -mt-24 flex-col md:flex-row md:items-end gap-8'>
          <Avatar
            src={user.profile?.picture}
            alt={user.profile?.name ?? user.username}
            name={user.profile?.name}
            username={user.username}
            className='size-32 md:size-48'
            showUsername={false}
          />

          <Column className='gap-1 pb-2 text-center md:text-left'>
            <Heading size='h1'>{user.profile?.name || user.username}</Heading>
            <Heading size='h4' className='text-tertiary'>
              @{user.username}
            </Heading>
          </Column>
        </Row>
      </Container>
    </div>
  )
}

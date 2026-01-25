'use client'

import type React from 'react'

import { use } from 'react'

import { UserContext } from '@/context/user'
import { User } from 'lucide-react'

import { Center, Heading } from '@trash-kit/ui'

type AvatarProps = {
  showUsername?: boolean
}

export const Avatar: React.FC<AvatarProps> = ({
  showUsername = true
}: AvatarProps): React.ReactNode => {
  const { user } = use(UserContext)

  return (
    <Center className='gap-2 w-full'>
      <Center className='size-24 rounded-full border border-outline bg-surface-secondary p-1'>
        {user?.profile?.picture ? (
          <img src={user?.profile?.picture} alt={user?.profile?.name} />
        ) : (
          <User className='size-12' />
        )}
      </Center>

      {showUsername && <Heading size='h3'>{user?.profile?.name || user?.username}</Heading>}
    </Center>
  )
}

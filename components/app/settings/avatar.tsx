'use client'

import type React from 'react'

import { use } from 'react'

import { UserContext } from '@/context/user'
import { User } from 'lucide-react'

import { Center, Heading, cn } from '@trash-kit/ui'
import { IconBox, IconBoxProps } from '@/components/icon-box'

type AvatarProps = {
  showUsername?: boolean
  src?: string | null
  alt?: string | null
  name?: string | null
  username?: string | null
  className?: string
  color?: IconBoxProps['color']
}

export const Avatar: React.FC<AvatarProps> = ({
  showUsername = true,
  src,
  alt,
  name,
  username,
  className = 'size-24',
  color = 'secondary'
}: AvatarProps): React.ReactNode => {
  const { user } = use(UserContext)

  const picture = src ?? user?.profile?.picture
  const displayName = name ?? user?.profile?.name ?? username ?? user?.username
  const imageAlt = alt ?? displayName ?? 'Profile picture'

  return (
    <Center className={cn('gap-2', showUsername && 'w-full')}>
      <IconBox
        className={cn('p-1', className)}
        color={color}
        icon={
          picture ? (
            // biome-ignore lint/performance/noImgElement: profile images can be API URLs or local previews.
            <img className='size-full object-cover rounded-full' src={picture} alt={imageAlt} />
          ) : (
            <User className='size-1/2' />
          )
        }
      />

      {showUsername && <Heading size='h3'>{displayName}</Heading>}
    </Center>
  )
}

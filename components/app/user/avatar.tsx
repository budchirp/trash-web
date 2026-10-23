'use client'

import type React from 'react'

import { useUser } from '@/context/user'
import { useProfilePicture } from '@/lib/hooks/use-profile-picture'
import { IMAGE_TYPES } from '@/lib/file'
import { Camera, Trash } from 'lucide-react'

import {
  Avatar as UiAvatar,
  Button,
  Center,
  Heading,
  Row,
  Spinner,
  Text,
  cn
} from '@trash-kit/ui'

import type { User } from '@/types/api/user'

type AvatarProps = {
  user?: User | null
  token?: string
  showUsername?: boolean

  className?: string
}

export const Avatar: React.FC<AvatarProps> = ({
  user,
  token,
  showUsername = false,
  className = 'size-24'
}): React.ReactNode => {
  const { user: _user } = useUser()

  user = user ?? _user

  const { ref, picture, isLoading, progress, upload, remove } = useProfilePicture({
    token,
    src: user?.profile?.picture
  })

  const name = user?.profile?.name ?? user?.username

  const handleUpload = (): void => {
    ref.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0] ?? null

    e.target.value = ''

    void upload(file)
  }

  return (
    <Center className={cn('gap-2', showUsername && 'w-full')}>
      {token && (
        <input
          ref={ref}
          type='file'
          accept={IMAGE_TYPES.join(',')}
          className='hidden'
          onChange={handleFileChange}
        />
      )}

      <div className='relative'>
        <UiAvatar
          className={cn(className, '[&>div]:size-full')}
          size='xl'
          src={picture ?? undefined}
          alt={name}
          name={name}
        />

        {isLoading && (
          <Center className='absolute inset-0 z-10 size-full rounded-full bg-surface-accent/10 backdrop-blur-sm'>
            <Spinner className='size-6 text-content-primary' />

            <Text className='absolute bottom-4 text-sm font-semibold tabular-nums text-content-tertiary'>
              {progress}%
            </Text>
          </Center>
        )}

        {token && (
          <Center className='absolute inset-0 z-5 size-full rounded-full'>
            <Row className='absolute bottom-4 gap-2'>
              <Button type='button' onClick={handleUpload}>
                <Camera className='size-6' />
              </Button>

              {picture && (
                <Button type='button' color='secondary' onClick={() => void remove()}>
                  <Trash className='size-6' />
                </Button>
              )}
            </Row>
          </Center>
        )}
      </div>

      {showUsername && <Heading size='h3'>{name}</Heading>}
    </Center>
  )
}

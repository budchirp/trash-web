'use client'

import type React from 'react'

import { use } from 'react'

import { IconBox, type IconBoxProps } from '@/components/icon-box'
import { UserContext } from '@/context/user'
import { useProfilePicture } from '@/lib/hooks/use-profile-picture'
import { FileUtil } from '@/lib/file-util'
import { Camera, Loader2, Trash, UserIcon } from 'lucide-react'
import { useLocale } from 'next-intl'

import { Button, Center, Heading, Row, Text, cn } from '@trash-kit/ui'

import type { User } from '@/types/api/user'

type AvatarProps = {
  user?: User | null
  jwt?: string
  showUsername?: boolean

  className?: string
  color?: IconBoxProps['color']
}

export const Avatar: React.FC<AvatarProps> = ({
  user,
  jwt,
  showUsername = false,
  className = 'size-24',
  color = 'secondary'
}): React.ReactNode => {
  const { user: _user } = use(UserContext)
  const locale = useLocale()

  user = user ?? _user

  const { ref, picture, isLoading, progress, upload, remove } = useProfilePicture({
    jwt,
    locale,
    src: user?.profile?.picture
  })

  const name = user?.profile?.name ?? user?.username

  const initials = getInitials(name)

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
      {jwt && (
        <input
          ref={ref}
          type='file'
          accept={FileUtil.ALLOWED_IMAGE_TYPES.join(',')}
          className='hidden'
          onChange={handleFileChange}
        />
      )}

      <div className='relative'>
        <IconBox
          className={cn(picture ? 'p-0' : 'p-1', className)}
          color={picture != null ? 'primary' : color}
          icon={
            picture ? (
              <img src={picture} alt={name ?? ''} className='size-full rounded-full object-cover' />
            ) : initials ? (
              <span className='font-bold uppercase select-none text-content-primary tracking-wider text-sm md:text-base'>
                {initials}
              </span>
            ) : (
              <UserIcon className='size-1/2 text-content-tertiary' />
            )
          }
        />

        {isLoading && (
          <Center className='absolute inset-0 z-10 size-full rounded-full bg-surface-accent/10 backdrop-blur-sm'>
            <Loader2 className='size-6 animate-spin text-content-primary' />

            <Text className='absolute bottom-4 text-sm font-semibold tabular-nums text-content-tertiary'>
              {progress}%
            </Text>
          </Center>
        )}

        {jwt && (
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

const getInitials = (str?: string | null): string => {
  if (!str?.trim()) return ''

  str = str.trim()

  const parts = str.split(/\s+/)

  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }

  return str.slice(0, 2).toUpperCase()
}

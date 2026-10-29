'use client'

import type React from 'react'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { ProfileAvatar } from './profile-avatar'
import { ConfirmationDialog } from '@/components/dialogs/confirmation-dialog'

import { useUser } from '@/context/user'
import { useProfilePicture } from '@/lib/hooks/use-profile-picture'
import { IMAGE_TYPES } from '@/lib/file'
import { Camera, Trash } from 'lucide-react'

import { Button, Center, Heading, Row, Spinner, Text, cn } from '@trash-kit/ui'

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

  user = user === undefined ? _user : user
  const t = useTranslations('profile')
  const [confirmRemove, setConfirmRemove] = useState(false)

  const { ref, picture, isLoading, progress, upload, remove } = useProfilePicture({
    token,
    src: user?.profile?.picture ?? null
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

      <div className='group/avatar relative'>
        <ProfileAvatar className={className} src={picture} name={name} />

        {token && (
          <Center
            className={cn(
              'absolute inset-0 rounded-full bg-surface-primary/30 transition-opacity',
              '[@media(hover:hover)]:opacity-0 [@media(hover:hover)]:pointer-events-none',
              'group-hover/avatar:opacity-100 group-hover/avatar:pointer-events-auto',
              'group-focus-within/avatar:opacity-100 group-focus-within/avatar:pointer-events-auto'
            )}
          >
            <Row className='absolute bottom-3 inset-x-0 justify-center gap-2'>
              <Button
                type='button'
                shape='circle'
                className='size-8 p-0'
                aria-label={t('upload_picture')}
                title={t('upload_picture')}
                disabled={isLoading}
                onClick={handleUpload}
              >
                <Camera className='size-4' />
              </Button>
              {picture && (
                <Button
                  type='button'
                  shape='circle'
                  color='secondary'
                  className='size-8 p-0'
                  aria-label={t('remove_picture')}
                  title={t('remove_picture')}
                  disabled={isLoading}
                  onClick={() => setConfirmRemove(true)}
                >
                  <Trash className='size-4' />
                </Button>
              )}
            </Row>
          </Center>
        )}

        {isLoading && (
          <Center className='absolute inset-0 z-10 size-full rounded-full bg-surface-accent/10 backdrop-blur-sm'>
            <Spinner className='size-6 text-content-primary' />

            {progress != null && (
              <Text className='absolute bottom-4 text-sm font-semibold tabular-nums text-content-tertiary'>
                {progress}%
              </Text>
            )}
          </Center>
        )}
      </div>

      {showUsername && <Heading size='h3'>{name}</Heading>}
      <ConfirmationDialog
        open={confirmRemove}
        onClose={() => setConfirmRemove(false)}
        onConfirm={remove}
        title={t('remove_picture')}
        description={t('remove_picture_description')}
      />
    </Center>
  )
}

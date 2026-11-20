'use client'

import type React from 'react'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { ProfileAvatar } from './profile-avatar'
import { ConfirmationDialog } from '@/components/dialogs/confirmation-dialog'

import { useUser } from '@/context/user'
import { useProfilePicture } from '@/lib/hooks/use-profile-picture'
import { IMAGE_TYPES } from '@/lib/file'
import { Camera, RotateCcw, Trash } from 'lucide-react'

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

  const { ref, picture, isLoading, isDeleting, progress, upload, remove, canRetry, retry } =
    useProfilePicture({
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
    <Center className={cn('gap-1', showUsername && 'w-full')}>
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
        <ProfileAvatar className={className} src={picture} name={name} />

        {isLoading && (
          <Center className='pointer-events-none absolute inset-0 z-10 size-full rounded-full bg-surface-accent/10 backdrop-blur-sm'>
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

      {token && (
        <Row className='justify-center gap-2'>
          <Button
            type='button'
            shape='circle'
            className='size-9 p-0'
            title={t('upload_picture')}
            aria-label={t('upload_picture')}
            disabled={isDeleting}
            onClick={handleUpload}
          >
            <Camera className='size-4' />
          </Button>
          <Button
            type='button'
            color='secondary'
            shape='circle'
            className='size-9 p-0'
            title={t('remove_picture')}
            aria-label={t('remove_picture')}
            disabled={isDeleting || (!picture && !isLoading)}
            onClick={() => setConfirmRemove(true)}
          >
            <Trash className='size-4' />
          </Button>
        </Row>
      )}

      {canRetry && (
        <Button
          type='button'
          shape='circle'
          aria-label={t('retry_upload')}
          title={t('retry_upload')}
          onClick={() => void retry()}
          disabled={isLoading}
        >
          <RotateCcw className='size-4' />
        </Button>
      )}
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

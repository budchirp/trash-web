'use client'

import { useRef, useState } from 'react'

import { useUser } from '@/context/user'
import { handle } from '@/lib/handle'
import { validate } from '@/lib/file'
import { useObjectUrl } from '@/lib/hooks/use-object-url'
import { ProfilePictureService } from '@/service/user/profile-picture'
import { useTranslations } from 'next-intl'

import { toast } from '@trash-kit/ui'

type UseProfilePictureProps = {
  token?: string
  src?: string | null
  onPictureChange?: (url: string | null) => void
}

export const useProfilePicture = ({ token, src, onPictureChange }: UseProfilePictureProps) => {
  const t = useTranslations('profile')
  const { user, setUser } = useUser()

  const ref = useRef<HTMLInputElement>(null)
  const { url: localPicture, setFile: setLocalFile } = useObjectUrl()
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState<number | null>(null)

  const remotePicture = src !== undefined ? src : (user?.profile?.picture ?? null)
  const picture = localPicture ?? remotePicture

  const reset = () => {
    setLocalFile(null)
    if (ref.current) ref.current.value = ''
  }

  const upload = async (file: File | null) => {
    if (!file || isLoading) return

    const error = validate(file)
    if (error) {
      toast(error === 'too_large' ? t('errors.too_large') : t('errors.invalid_type'), {
        color: 'danger'
      })
      if (ref.current) ref.current.value = ''
      return
    }

    const objectUrl = setLocalFile(file)

    if (!token) {
      onPictureChange?.(objectUrl)
      return
    }

    setIsLoading(true)
    setProgress(0)

    const response = await ProfilePictureService.upload(file, token, setProgress)

    reset()
    setIsLoading(false)
    setProgress(null)

    if (handle(response)) return

    if (response.data) {
      setUser(response.data)
      onPictureChange?.(response.data.profile?.picture ?? null)
      toast(t('upload_success'))
    }
  }

  const remove = async () => {
    if (picture == null || isLoading) return

    if (token) {
      setIsLoading(true)

      const response = await ProfilePictureService.delete(token)

      setIsLoading(false)

      if (handle(response)) return

      if (user) {
        setUser({ ...user, profile: { ...user.profile, picture: null } })
      }
      toast(t('delete_success'))
    }

    reset()
    onPictureChange?.(null)
  }

  return {
    ref,
    picture,
    isLoading,
    progress,
    upload,
    remove
  }
}

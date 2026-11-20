'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/context/user'
import { handle } from '@/lib/handle'
import { validate } from '@/lib/file'
import { ProfilePictureService } from '@/service/user/profile-picture'
import type { Image } from '@/types/api/upload'
import { useTranslations } from 'next-intl'
import { toast } from '@trash-kit/ui'

type UseProfilePictureProps = {
  token?: string
  src?: Image | null
  onPictureChange?: (image: Image | null) => void
}

export const useProfilePicture = ({ token, src, onPictureChange }: UseProfilePictureProps) => {
  const t = useTranslations('profile')
  const { user, setUser } = useUser()
  const router = useRouter()
  const ref = useRef<HTMLInputElement>(null)
  const generation = useRef(0)
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState<number | null>(null)
  const [retryFile, setRetryFile] = useState<File | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const deleting = useRef(false)
  const picture = (src !== undefined ? src : user?.profile?.picture)?.url ?? null

  useEffect(
    () => () => {
      generation.current++
      if (token) ProfilePictureService.cancel(token)
    },
    [token]
  )

  const upload = async (file: File | null) => {
    if (!file || !token || deleting.current) return
    const error = validate(file)
    if (error) {
      toast(t(`errors.${error}`), { color: 'danger' })
      if (ref.current) ref.current.value = ''
      return
    }
    const current = ++generation.current
    setRetryFile(null)
    setIsLoading(true)
    setProgress(0)
    const response = await ProfilePictureService.upload(file, token, (value) => {
      if (current === generation.current) setProgress(value)
    })
    if (current !== generation.current) return
    setIsLoading(false)
    setProgress(null)
    if (ref.current) ref.current.value = ''
    if (response.error && response.code === 'image_upload_cancelled') return
    if (handle(response)) {
      setRetryFile(file)
      return
    }
    setUser((previous) =>
      previous
        ? {
            ...previous,
            profile: { ...previous.profile, picture: response.data }
          }
        : previous
    )
    onPictureChange?.(response.data)
    router.refresh()
    toast(t('upload_success'))
  }

  const remove = async () => {
    if (!token || deleting.current) return false
    const current = ++generation.current
    deleting.current = true
    setIsDeleting(true)
    setIsLoading(true)
    setProgress(null)
    setRetryFile(null)
    const response = await ProfilePictureService.delete(token)
    if (current !== generation.current) return false
    deleting.current = false
    setIsDeleting(false)
    setIsLoading(false)
    if (handle(response)) return false
    setUser((previous) =>
      previous
        ? {
            ...previous,
            profile: { ...previous.profile, picture: null }
          }
        : previous
    )
    onPictureChange?.(null)
    router.refresh()
    toast(t('delete_success'))
    return true
  }

  return {
    ref,
    picture,
    isLoading,
    isDeleting,
    progress,
    upload,
    remove,
    canRetry: retryFile !== null,
    retry: () => upload(retryFile)
  }
}

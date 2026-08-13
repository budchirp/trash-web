'use client'

import { getCurrentRedirect, getSignInPath } from '@/lib/redirects'

import { toast } from '@trash-kit/ui'

type ServiceResponseLike =
  | { error: false; message: string; data?: unknown }
  | { error: true; message: string; status: number; data?: null }

export const handle = <T extends ServiceResponseLike>(
  response: T,
  onError?: (message: string) => void
): response is Extract<T, { error: true }> => {
  if (!response.error) return false

  if (response.status === 401) {
    window.location.replace(getSignInPath(getCurrentRedirect()))
    return true
  }

  if (onError) onError(response.message)
  else toast(response.message)
  return true
}

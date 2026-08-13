'use client'

import { getSignInPath } from '@/lib/redirects'

import { toast } from '@trash-kit/ui'

type ServiceResponseLike =
  | { error: false; message: string; data?: unknown }
  | { error: true; message: string; status: number; data?: null }

export const handle = <T extends ServiceResponseLike>(
  response: T,
  locale: string
): response is Extract<T, { error: true }> => {
  if (!response.error) return false

  if (response.status === 401) {
    const redirectTo = `${window.location.pathname}${window.location.search}`
    window.location.replace(getSignInPath(locale, redirectTo))
    return true
  }

  toast(response.message)
  return true
}

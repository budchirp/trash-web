'use client'

import { currentPath, withRedirect } from '@/lib/redirect'
import { LINKS } from '@/lib/link'

import { toast } from '@trash-kit/ui'

import type { ApiServiceResponse } from '@/service/api'

export const handle = <T>(
  response: ApiServiceResponse<T>,
  onError?: (message: string) => void
): response is ApiServiceResponse<T> & { error: true } => {
  if (!response.error) return false

  if (response.status === 401) {
    window.location.replace(withRedirect(LINKS.auth.signIn, currentPath()))
    return true
  }

  if (onError) onError(response.message)
  else toast(response.message, { color: 'danger' })

  return true
}

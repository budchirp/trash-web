'use client'

import { useCookies } from 'next-client-cookies'
import { remove, token } from '@/lib/session'
import { SessionService } from '@/service/session'
import { LINKS } from '@/lib/link'
import { handle } from '@/lib/handle'

export const useLogout = (): (() => Promise<boolean>) => {
  const cookies = useCookies()

  return async () => {
    const value = token(cookies)

    if (value) {
      const response = await SessionService.delete(null, value)
      if (handle(response)) return false
      remove(cookies, value)
    }

    window.location.replace(LINKS.home)
    return true
  }
}

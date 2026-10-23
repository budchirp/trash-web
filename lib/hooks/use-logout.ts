'use client'

import { useCookies } from 'next-client-cookies'
import { remove, token } from '@/lib/session'
import { SessionService } from '@/service/session'
import { LINKS } from '@/lib/link'

export const useLogout = (): (() => Promise<void>) => {
  const cookies = useCookies()

  return async () => {
    const value = token(cookies)

    if (value) {
      await SessionService.delete(null, value)
      remove(cookies, value)
    }

    window.location.replace(LINKS.home)
  }
}

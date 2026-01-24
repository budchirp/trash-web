'use client'

import { useCookies } from 'next-client-cookies'
import { CONSTANTS } from '@/lib/constants'
import { SessionService } from '@/service/session'

export const useLogout = (): ((session?: string) => Promise<void>) => {
  const cookies = useCookies()

  try {
    const jwt = cookies.get(CONSTANTS.COOKIES.TOKEN)

    return async (token: string | null = null) => {
      if (jwt) {
        await SessionService.delete(token, { jwt })
      }

      if (!token) {
        cookies.remove(CONSTANTS.COOKIES.TOKEN)

        window.location.replace('/')
      }
    }
  } catch {
    return async () => {
      window.location.replace('/')
    }
  }
}

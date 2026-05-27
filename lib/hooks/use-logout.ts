'use client'

import { useCookies } from 'next-client-cookies'
import { AccountSession } from '@/lib/account-session'
import { SessionService } from '@/service/session'

export const useLogout = (): ((session?: string) => Promise<void>) => {
  const cookies = useCookies()

  try {
    const accountSession = new AccountSession(cookies)
    const jwt = accountSession.get()

    return async (token: string | null = null) => {
      if (jwt) {
        await SessionService.delete(token, { jwt })
      }

      if (!token) {
        accountSession.remove(jwt)

        window.location.replace('/')
      }
    }
  } catch {
    return async () => {
      window.location.replace('/')
    }
  }
}

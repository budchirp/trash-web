'use client'

import { use } from 'react'

import { useCookies } from 'next-client-cookies'
import { UserContext } from '@trash-kit/auth'
import { CONSTANTS } from '@/lib/constants'
import { trash } from '@/lib/trash'

export const useLogout = (): ((session?: string) => Promise<void>) => {
  const { logout } = use(UserContext)

  const cookies = useCookies()

  try {
    const token = cookies.get(CONSTANTS.COOKIES.TOKEN)

    return async (session?: string) => {
      cookies.remove(CONSTANTS.COOKIES.TOKEN)

      if (token) {
        await logout(trash, token, session)

        window.location.replace('/')
      }
    }
  } catch {
    return async () => {}
  }
}

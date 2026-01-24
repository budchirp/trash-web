import { redirect, unauthorized } from 'next/navigation'

import { getCookies } from 'next-client-cookies/server'
import { CONSTANTS } from './constants'
import { SessionService } from '@/service/session'

export const _authtenticated = async (): Promise<string> => {
  const cookies = await getCookies()

  const jwt = cookies.get(CONSTANTS.COOKIES.TOKEN)
  if (!jwt) {
    return unauthorized()
  }

  const session = await SessionService.get(null, { jwt })
  if (session.error) {
    cookies.remove(CONSTANTS.COOKIES.TOKEN)

    return redirect('/auth/signin')
  }

  return jwt
}

export const _public = async (): Promise<void> => {
  const cookies = await getCookies()

  const jwt = cookies.get(CONSTANTS.COOKIES.TOKEN)
  if (jwt) {
    return redirect('/dashboard')
  }
}

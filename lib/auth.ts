import { redirect, unauthorized } from 'next/navigation'
import { trash } from '@/lib/trash'

import { type User, SessionService, UserService } from '@trash-kit/auth'
import { getCookies } from 'next-client-cookies/server'
import { CONSTANTS } from './constants'

export const authenticatedRoute = async (token?: string | null): Promise<User> => {
  const cookies = await getCookies()

  if (!token) {
    return unauthorized()
  }

  const verify = await SessionService.verify(trash, { token })
  if (verify.error) {
    cookies.remove(CONSTANTS.COOKIES.TOKEN)

    return redirect('/auth/signin')
  }

  const user = await UserService.get(trash, { token })
  if (user.error) {
    cookies.remove(CONSTANTS.COOKIES.TOKEN)

    return redirect('/auth/signin')
  }

  return user.data
}

export const publicRoute = async (token?: string | null): Promise<void> => {
  if (token) {
    return redirect('/')
  }
}

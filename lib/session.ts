import { CONSTANTS } from '@/lib/constants'
import { UserService } from '@/service/user'

import type { SavedAccount } from '@/types/app/account'
import type { CookieAttributes, Cookies } from 'next-client-cookies'

const options: CookieAttributes = {
  path: '/',
  sameSite: 'lax',
  expires: CONSTANTS.COOKIES.TOKEN_DURATION
}

const saved = (cookies: Cookies): string[] => {
  try {
    const value = JSON.parse(cookies.get(CONSTANTS.COOKIES.TOKENS) ?? '[]')
    return Array.isArray(value) ? value.filter((item) => typeof item === 'string') : []
  } catch {
    return []
  }
}

export const token = (cookies: Cookies): string | undefined => cookies.get(CONSTANTS.COOKIES.TOKEN)

export const save = (cookies: Cookies, value: string): void => {
  const tokens = [value, ...saved(cookies).filter((item) => item !== value)]

  cookies.set(CONSTANTS.COOKIES.TOKEN, value, options)
  cookies.set(CONSTANTS.COOKIES.TOKENS, JSON.stringify(tokens), options)
}

export const remove = (cookies: Cookies, value?: string): void => {
  if (!value) return

  if (token(cookies) === value) cookies.remove(CONSTANTS.COOKIES.TOKEN, { path: '/' })

  const tokens = saved(cookies).filter((item) => item !== value)

  if (tokens.length > 0) cookies.set(CONSTANTS.COOKIES.TOKENS, JSON.stringify(tokens), options)
  else cookies.remove(CONSTANTS.COOKIES.TOKENS, { path: '/' })
}

export const list = async (cookies: Cookies, current: SavedAccount): Promise<SavedAccount[]> => {
  const tokens = [current.token, ...saved(cookies).filter((item) => item !== current.token)]

  const result = await Promise.all(
    tokens.map(async (value) => {
      if (value === current.token) return current

      const response = await UserService.get(value)
      if (response.error) return null

      return { token: value, user: response.data } satisfies SavedAccount
    })
  )

  const seen = new Set<string>()

  return result.filter((account): account is SavedAccount => {
    if (!account || seen.has(account.user.id)) return false

    seen.add(account.user.id)
    return true
  })
}

import { CONSTANTS } from '@/lib/constants'
import { UserService } from '@/service/user'

import type { SavedAccount } from '@/types/app/account'
import type { CookieAttributes } from 'next-client-cookies'

type AccountSessionCookies = {
  get: (name: string) => string | undefined
  set: (name: string, value: string, options?: CookieAttributes) => void
  remove: (name: string, options?: CookieAttributes) => void
}

export class AccountSession {
  private static readonly cookieOptions: CookieAttributes = {
    path: '/',
    sameSite: 'lax',
    expires: CONSTANTS.COOKIES.TOKEN_DURATION
  }

  private static readonly removeOptions: CookieAttributes = {
    path: '/'
  }

  private readonly cookies: AccountSessionCookies

  public constructor(cookies: AccountSessionCookies) {
    this.cookies = cookies
  }

  public get(): string | undefined {
    return this.cookies.get(CONSTANTS.COOKIES.TOKEN)
  }

  private getAll(): string[] {
    return this.normalize(this.parse(this.cookies.get(CONSTANTS.COOKIES.TOKENS)))
  }

  public set(token: string): void {
    this.cookies.set(CONSTANTS.COOKIES.TOKEN, token, AccountSession.cookieOptions)
  }

  public add(token: string): void {
    const savedTokens = this.getAll().filter((savedToken) => savedToken !== token)

    this.write([token, ...savedTokens])
  }

  public remove(token: string | null | undefined): void {
    if (!token) {
      this.clear()
      return
    }

    if (this.get() === token) this.clear()

    this.write(this.getAll().filter((savedToken) => savedToken !== token))
  }

  public clear(): void {
    this.cookies.remove(CONSTANTS.COOKIES.TOKEN, AccountSession.removeOptions)
  }

  public async getAllAccounts(
    locale: string,
    currentAccount: SavedAccount
  ): Promise<SavedAccount[]> {
    const tokens = [
      currentAccount.token,
      ...this.getAll().filter((token) => token !== currentAccount.token)
    ]
    const accounts: SavedAccount[] = []
    const userIds = new Set<string>()

    for (const token of tokens) {
      const account = await this.getAccount(token, locale, currentAccount)
      if (!account || userIds.has(account.user.id)) continue

      userIds.add(account.user.id)
      accounts.push(account)
    }

    return accounts
  }

  private async getAccount(
    token: string,
    locale: string,
    currentAccount: SavedAccount
  ): Promise<SavedAccount | null> {
    if (token === currentAccount.token) return currentAccount

    const response = await UserService.get({ jwt: token, locale })
    if (response.error) {
      if (response.status === 401) {
        this.remove(token)
        return null
      }

      throw new Error(response.message)
    }

    return { token, user: response.data }
  }

  private parse(value: string | undefined): unknown {
    if (!value) return []

    try {
      return JSON.parse(value)
    } catch {
      try {
        return JSON.parse(decodeURIComponent(value))
      } catch {
        return []
      }
    }
  }

  private normalize(tokens: unknown): string[] {
    if (!Array.isArray(tokens)) return []

    const uniqueTokens = new Set<string>()
    const normalizedTokens: string[] = []

    for (const token of tokens) {
      if (typeof token !== 'string') continue

      const normalizedToken = token.trim()
      if (!normalizedToken || uniqueTokens.has(normalizedToken)) continue

      uniqueTokens.add(normalizedToken)
      normalizedTokens.push(normalizedToken)
    }

    return normalizedTokens
  }

  private write(tokens: string[]): void {
    const normalizedTokens = this.normalize(tokens)

    if (normalizedTokens.length === 0) {
      this.cookies.remove(CONSTANTS.COOKIES.TOKENS, AccountSession.removeOptions)
      return
    }

    this.cookies.set(
      CONSTANTS.COOKIES.TOKENS,
      JSON.stringify(normalizedTokens),
      AccountSession.cookieOptions
    )
  }
}

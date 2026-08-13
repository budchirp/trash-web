import type { Session } from '@/types/api/session'
import type { Token } from '@/types/api/token'

export type TokenDto = {
  id: string
  expires_at: string
  permissions: string[]
}

export type SessionDto = {
  token: TokenDto
  ip: string
  browser: string
  device: {
    name: string
    os: string
    platform: string
  }
  created_at: string | null
}

export const mapToken = (token: TokenDto): Token => ({
  id: token.id,
  expiresAt: token.expires_at,
  permissions: token.permissions
})

export const mapSession = (session: SessionDto): Session => ({
  token: mapToken(session.token),
  ip: session.ip,
  browser: session.browser,
  device: session.device,
  createdAt: session.created_at
})

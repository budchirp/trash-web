import type { Token } from '@/types/api/token'

export type Session = {
  token: Token
  ip: string
  browser: string
  device: {
    name: string
    os: string
    platform: string
  }

  createdAt: string
}

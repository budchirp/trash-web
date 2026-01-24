import type { Application } from '@/types/api/application'
import type { Token } from '@/types/api/token'

export type Connection = {
  token: Token
  application: Application

  createdAt: string
}

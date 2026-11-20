import type { Image } from '@/types/api/upload'

export type Profile = {
  name?: string
  picture?: Image | null
  gender?: 'male' | 'female'
  public?: boolean
  dev?: boolean
}

export type User = {
  id: string

  email: string
  username: string

  profile?: Profile | null
}

export type PublicUser = {
  username: string
  profile: Profile | null
}

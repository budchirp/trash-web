export type Profile = {
  name?: string
  picture?: string | null
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

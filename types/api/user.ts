export type Profile = {
  name?: string
  picture?: string
  gender?: 'male' | 'female'
}

export type User = {
  id: string

  email: string
  username: string

  profile?: Profile | null
}

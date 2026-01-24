export type User = {
  id: string

  email: string
  username: string

  profile: {
    name?: string
    picture?: string
  }
}

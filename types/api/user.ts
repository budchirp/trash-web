export type Profile = {
  name?: string
  picture?: string | null
  gender?: 'male' | 'female'
  public?: boolean
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

export type ProfilePictureUploadRequest = {
  content_type: string
  content_length?: number
}

export type ProfilePictureUploadResponse = {
  url: string
  key: string
  expires_at: string
}

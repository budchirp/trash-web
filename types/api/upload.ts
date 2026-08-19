export type PresignedUploadRequest = {
  content_type: string
  content_length?: number
}

export type PresignedUploadResponse = {
  url: string
  key: string
  expires_at: string
}

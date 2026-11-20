export type Image = {
  id: string
  url: string
  content_type: string
  content_length: number
}

export type PresignedUploadRequest = {
  content_type: string
  content_length: number
}

export type PresignedUploadResponse = {
  upload_id: string
  upload_url: string
  method: string
  headers: Record<string, string[]>
  expires_at: string
}

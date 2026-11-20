import type { ApiServiceResponse } from '@/service/api'
import type { Image, PresignedUploadRequest, PresignedUploadResponse } from '@/types/api/upload'

export const IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'] as const
export const MAX_SIZE = 5_242_880
export type PictureError = 'invalid_type' | 'too_large' | 'empty'
export const contentType = (file: File) => (file.type === 'image/jpg' ? 'image/jpeg' : file.type)

export const validate = (file: File): PictureError | null => {
  if (!IMAGE_TYPES.includes(file.type as (typeof IMAGE_TYPES)[number])) return 'invalid_type'
  if (file.size < 1) return 'empty'
  if (file.size > MAX_SIZE) return 'too_large'
  return null
}

export const size = (bytes: number): string => {
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`
  if (bytes >= 1024) return `${Math.round(bytes / 1024)} KB`
  return `${bytes} B`
}

const failure = (
  message: string,
  status: number,
  code: string | null = null
): ApiServiceResponse<never> => ({ error: true, message, status, code, details: null, data: null })
const validationMessage = <T>(response: ApiServiceResponse<T>): ApiServiceResponse<T> =>
  response.error && response.status === 400 && response.details
    ? { ...response, message: Object.values(response.details).join(' ') || response.message }
    : response

export const cancelledUpload = () => failure('Image upload cancelled', 0, 'image_upload_cancelled')

// Use the signed headers, never the backend client's headers or credentials.
export const uploadHeaders = (values: Record<string, string[]>): Headers => {
  const headers = new Headers()
  for (const [name, entries] of Object.entries(values)) {
    if (['content-length', 'host', 'authorization', 'cookie'].includes(name.toLowerCase())) continue
    for (const value of entries) headers.append(name, value)
  }
  return headers
}

type UploadOptions = {
  initiate: (
    metadata: PresignedUploadRequest,
    signal: AbortSignal
  ) => Promise<ApiServiceResponse<PresignedUploadResponse>>
  complete: (id: string, signal: AbortSignal) => Promise<ApiServiceResponse<Image>>
  signal: AbortSignal
  onProgress?: (progress: number) => void
}

export const upload = async (
  file: File,
  { initiate, complete, signal, onProgress }: UploadOptions
): Promise<ApiServiceResponse<Image>> => {
  const invalid = validate(file)
  if (invalid)
    return failure(
      invalid === 'invalid_type'
        ? 'Only JPEG, PNG, and WebP images are allowed.'
        : 'Image size must be between 1 and 5,242,880 bytes.',
      400,
      'validation_failed'
    )

  // At most two upload sessions and three completion attempts per session.
  for (let session = 0; session < 2; session++) {
    if (signal.aborted) return cancelledUpload()
    const initiated = await initiate(
      { content_type: contentType(file), content_length: file.size },
      signal
    )
    if (signal.aborted) return cancelledUpload()
    if (initiated.error) return validationMessage(initiated)
    onProgress?.(0)
    try {
      const stored = await fetch(initiated.data.upload_url, {
        method: initiated.data.method,
        headers: uploadHeaders(initiated.data.headers),
        body: file,
        credentials: 'omit',
        signal
      })
      if (signal.aborted) return cancelledUpload()
      if (!stored.ok) return failure('Storage upload failed. Please retry.', stored.status)
    } catch {
      return signal.aborted ? cancelledUpload() : failure('Storage unavailable. Please retry.', 503)
    }
    onProgress?.(100)

    for (let attempt = 0; attempt < 3; attempt++) {
      if (signal.aborted) return cancelledUpload()
      const result = await complete(initiated.data.upload_id, signal)
      if (signal.aborted) return cancelledUpload()
      if (!result.error) return result
      if (
        (result.status === 409 && result.code === 'image_upload_inactive') ||
        (result.status === 410 && result.code === 'image_upload_expired')
      ) {
        if (session === 0) break
        return validationMessage(result)
      }
      if (
        result.status === 409 &&
        ['image_upload_incomplete', 'image_upload_changed'].includes(result.code ?? '') &&
        attempt < 2
      ) {
        continue
      }
      return validationMessage(result)
    }
  }
  return failure('Please start a new image upload.', 409, 'image_upload_inactive')
}

// A resource has one current operation. DELETE and newer selections invalidate it
// before making requests, including when a transport ignores abort.
export class ImageUploads {
  private pending = new Map<string, AbortController>()

  cancel(key: string) {
    this.pending.get(key)?.abort()
    this.pending.delete(key)
  }

  async run(key: string, task: (signal: AbortSignal) => Promise<ApiServiceResponse<Image>>) {
    this.cancel(key)
    const controller = new AbortController()
    this.pending.set(key, controller)
    try {
      const result = await task(controller.signal)
      return controller.signal.aborted ? cancelledUpload() : result
    } finally {
      if (this.pending.get(key) === controller) this.pending.delete(key)
    }
  }
}

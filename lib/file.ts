import type { ApiServiceResponse } from '@/service/api'
import type { PresignedUploadResponse } from '@/types/api/upload'

export const IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'] as const

export const MAX_SIZE = 5 * 1024 * 1024

export type PictureError = 'invalid_type' | 'too_large'

export const validate = (file: File): PictureError | null => {
  if (!IMAGE_TYPES.includes(file.type as (typeof IMAGE_TYPES)[number])) return 'invalid_type'
  if (file.size > MAX_SIZE) return 'too_large'

  return null
}

export const size = (bytes: number): string => {
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`
  if (bytes >= 1024) return `${Math.round(bytes / 1024)} KB`

  return `${bytes} B`
}

export type CreateUpload = () => Promise<ApiServiceResponse<PresignedUploadResponse>>

export const upload = async (
  file: File,
  createUpload: CreateUpload,
  onProgress?: (progress: number) => void
): Promise<ApiServiceResponse<null>> => {
  const presigned = await createUpload()
  if (presigned.error) return presigned

  let result = await put(presigned.data.url, file, file.type, onProgress)

  if (result.error && result.status === 403) {
    const refreshed = await createUpload()
    if (refreshed.error) return refreshed

    result = await put(refreshed.data.url, file, file.type, onProgress)
  }

  return result
}

const put = (
  url: string,
  file: File | Blob,
  contentType: string,
  onProgress?: (progress: number) => void
): Promise<ApiServiceResponse<null>> => {
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest()
    xhr.open('PUT', url, true)
    xhr.setRequestHeader('Content-Type', contentType)

    if (onProgress && xhr.upload) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          onProgress(Math.round((event.loaded / event.total) * 100))
        }
      }
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve({ error: false, message: '', data: null })
      } else {
        resolve({
          error: true,
          message: 'Failed to upload image to storage',
          status: xhr.status,
          code: null,
          details: null,
          data: null
        })
      }
    }

    xhr.onerror = () => {
      resolve({
        error: true,
        message: 'Network error during image upload',
        status: 0,
        code: null,
        details: null,
        data: null
      })
    }

    xhr.onabort = () => {
      resolve({
        error: true,
        message: 'Image upload aborted',
        status: 0,
        code: null,
        details: null,
        data: null
      })
    }

    xhr.send(file)
  })
}

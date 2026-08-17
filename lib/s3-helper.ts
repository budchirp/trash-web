import type { ServiceResponse } from '@trash-kit/core'

export class S3Helper {
  static upload(
    url: string,
    file: File | Blob,
    contentType: string,
    onProgress?: (progress: number) => void
  ): Promise<ServiceResponse<null>> {
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
          resolve({
            error: false,
            message: '',
            data: null
          })
        } else {
          resolve({
            error: true,
            message: 'Failed to upload image to storage',
            status: xhr.status,
            data: null
          })
        }
      }

      xhr.onerror = () => {
        resolve({
          error: true,
          message: 'Network error during image upload',
          status: 0,
          data: null
        })
      }

      xhr.onabort = () => {
        resolve({
          error: true,
          message: 'Image upload aborted',
          status: 0,
          data: null
        })
      }

      xhr.send(file)
    })
  }
}

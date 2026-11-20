import { ImageUploads, upload } from '@/lib/file'
import { request } from '@/service/api'
import type { Image, PresignedUploadRequest, PresignedUploadResponse } from '@/types/api/upload'

const uploads = new ImageUploads()

export const ProfilePictureService = {
  requestUpload(values: PresignedUploadRequest, token: string, signal?: AbortSignal) {
    return request<PresignedUploadResponse>({
      method: 'POST',
      path: '/user/profile/picture/uploads',
      body: values,
      token,
      signal
    })
  },

  completeUpload(uploadId: string, token: string, signal?: AbortSignal) {
    return request<Image>({
      method: 'POST',
      path: `/user/profile/picture/uploads/${encodeURIComponent(uploadId)}/complete`,
      token,
      signal
    })
  },

  cancel(token: string) {
    uploads.cancel(token)
  },

  delete(token: string) {
    uploads.cancel(token)
    return request({ method: 'DELETE', path: '/user/profile/picture', token, empty: true })
  },

  upload(file: File, token: string, onProgress?: (progress: number) => void) {
    return uploads.run(token, (signal) =>
      upload(file, {
        initiate: (metadata, signal) =>
          ProfilePictureService.requestUpload(metadata, token, signal),
        complete: (id, signal) => ProfilePictureService.completeUpload(id, token, signal),
        signal,
        onProgress
      })
    )
  }
}

import { ImageUploads, upload } from '@/lib/file'
import { request, type ApiServiceResponse } from '@/service/api'
import { mapApplication, type ApplicationDto } from '@/service/application/mapper'

import type { ApplicationValues } from '@/service/application/schema'
import type { Image, PresignedUploadRequest, PresignedUploadResponse } from '@/types/api/upload'
import type { Application } from '@/types/api/application'

const uploads = new ImageUploads()
const uploadKey = (id: string, token: string) => JSON.stringify([token, id])

export const ApplicationService = {
  async update(
    id: string,
    values: ApplicationValues,
    token: string
  ): Promise<ApiServiceResponse<Application>> {
    const response = await request<ApplicationDto>({
      method: 'PATCH',
      path: `/application/${encodeURIComponent(id)}`,
      body: values,
      token
    })

    if (response.error) return response

    return { error: false, message: response.message, data: mapApplication(response.data) }
  },

  async create(values: ApplicationValues, token: string): Promise<ApiServiceResponse<Application>> {
    const response = await request<ApplicationDto>({
      method: 'POST',
      path: '/application',
      body: values,
      token
    })

    if (response.error) return response

    return { error: false, message: response.message, data: mapApplication(response.data) }
  },

  requestIconUpload(
    id: string,
    values: PresignedUploadRequest,
    token: string,
    signal?: AbortSignal
  ): Promise<ApiServiceResponse<PresignedUploadResponse>> {
    return request<PresignedUploadResponse>({
      method: 'POST',
      path: `/application/${encodeURIComponent(id)}/icon/uploads`,
      body: values,
      token,
      signal
    })
  },

  completeIconUpload(id: string, uploadId: string, token: string, signal?: AbortSignal) {
    return request<Image>({
      method: 'POST',
      path: `/application/${encodeURIComponent(id)}/icon/uploads/${encodeURIComponent(uploadId)}/complete`,
      token,
      signal
    })
  },

  cancelIconUpload(id: string, token: string) {
    uploads.cancel(uploadKey(id, token))
  },

  deleteIcon(id: string, token: string) {
    uploads.cancel(uploadKey(id, token))
    return request({
      method: 'DELETE',
      path: `/application/${encodeURIComponent(id)}/icon`,
      token,
      empty: true
    })
  },

  uploadIcon(id: string, file: File, token: string, onProgress?: (progress: number) => void) {
    return uploads.run(uploadKey(id, token), (signal) =>
      upload(file, {
        initiate: (metadata, signal) =>
          ApplicationService.requestIconUpload(id, metadata, token, signal),
        complete: (uploadId, signal) =>
          ApplicationService.completeIconUpload(id, uploadId, token, signal),
        signal,
        onProgress
      })
    )
  },

  async get(id: string, token: string): Promise<ApiServiceResponse<Application>> {
    const response = await request<ApplicationDto>({
      path: `/application/${encodeURIComponent(id)}`,
      token
    })

    if (response.error) return response

    return { error: false, message: response.message, data: mapApplication(response.data) }
  },

  async getAll(token: string): Promise<ApiServiceResponse<Application[]>> {
    const response = await request<ApplicationDto[]>({ path: '/application/all', token })

    if (response.error) return response

    return { error: false, message: response.message, data: response.data.map(mapApplication) }
  },

  delete(id: string, token: string): Promise<ApiServiceResponse> {
    uploads.cancel(uploadKey(id, token))
    return request({
      method: 'DELETE',
      path: `/application/${encodeURIComponent(id)}`,
      token,
      empty: true
    })
  }
}

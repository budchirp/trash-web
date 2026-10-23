import { upload } from '@/lib/file'
import { request, type ApiServiceResponse } from '@/service/api'
import { mapApplication, type ApplicationDto } from '@/service/application/mapper'

import type { ApplicationValues } from '@/service/application/schema'
import type { PresignedUploadRequest, PresignedUploadResponse } from '@/types/api/upload'
import type { Application } from '@/types/api/application'

export const ApplicationService = {
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
    token: string
  ): Promise<ApiServiceResponse<PresignedUploadResponse>> {
    return request<PresignedUploadResponse>({
      method: 'POST',
      path: `/application/${encodeURIComponent(id)}/icon`,
      body: values,
      token
    })
  },

  uploadIcon(
    id: string,
    file: File,
    token: string,
    onProgress?: (progress: number) => void
  ): Promise<ApiServiceResponse<null>> {
    return upload(
      file,
      () =>
        ApplicationService.requestIconUpload(
          id,
          { content_type: file.type, content_length: file.size },
          token
        ),
      onProgress
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
    return request({
      method: 'DELETE',
      path: `/application/${encodeURIComponent(id)}`,
      token,
      empty: true
    })
  }
}

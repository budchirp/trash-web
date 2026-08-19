import { uploadFile } from '@/lib/file-upload'
import { apiRequest, type ApiServiceResponse } from '@/service/api'

import type { AuthenticatedHeaders } from '@/types/api'
import type { PresignedUploadRequest, PresignedUploadResponse } from '@/types/api/upload'
import { mapApplication, type ApplicationDto } from '@/service/application/mapper'
import type { ApplicationValues } from '@/service/application/schema'

import type { ServiceResponse } from '@trash-kit/core'
import type { Application } from '@/types/api/application'

export class ApplicationService {
  public static async create(
    values: ApplicationValues,
    headers: AuthenticatedHeaders
  ): Promise<ApiServiceResponse<Application>> {
    const response = await apiRequest<ApplicationDto>({
      method: 'POST',
      path: '/application',
      body: values,
      headers
    })
    if (response.error) return response

    return {
      error: false,
      message: response.message,
      data: mapApplication(response.data)
    }
  }

  public static async requestIconUpload(
    id: string,
    values: PresignedUploadRequest,
    headers: AuthenticatedHeaders
  ): Promise<ServiceResponse<PresignedUploadResponse>> {
    return await apiRequest<PresignedUploadResponse>({
      method: 'POST',
      path: `/application/${encodeURIComponent(id)}/icon`,
      body: values,
      headers
    })
  }

  public static async uploadIcon(
    id: string,
    file: File,
    headers: AuthenticatedHeaders,
    onProgress?: (progress: number) => void
  ): Promise<ServiceResponse<null>> {
    return await uploadFile(
      file,
      () =>
        ApplicationService.requestIconUpload(
          id,
          { content_type: file.type, content_length: file.size },
          headers
        ),
      onProgress
    )
  }

  public static async get(
    id: string,
    headers: AuthenticatedHeaders
  ): Promise<ServiceResponse<Application>> {
    const response = await apiRequest<ApplicationDto>({
      path: `/application/${encodeURIComponent(id)}`,
      headers
    })
    if (response.error) return response

    return {
      error: false,
      message: response.message,
      data: mapApplication(response.data)
    }
  }

  public static async getAll(
    headers: AuthenticatedHeaders
  ): Promise<ServiceResponse<Application[]>> {
    const response = await apiRequest<ApplicationDto[]>({ path: '/application/all', headers })
    if (response.error) return response

    return {
      error: false,
      message: response.message,
      data: response.data.map(mapApplication)
    }
  }

  public static async delete(id: string, headers: AuthenticatedHeaders): Promise<ServiceResponse> {
    return await apiRequest({
      method: 'DELETE',
      path: `/application/${encodeURIComponent(id)}`,
      headers,
      empty: true
    })
  }
}

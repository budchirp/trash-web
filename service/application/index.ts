import { apiRequest } from '@/service/api'

import type { AuthenticatedHeaders } from '@/types/api'
import { mapApplication, type ApplicationDto } from '@/service/application/mapper'

import type { ServiceResponse } from '@trash-kit/core'
import type { Application } from '@/types/api/application'

export class ApplicationService {
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

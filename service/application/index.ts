import { apiRequest } from '@/service/api'

import type { AuthenticatedHeaders } from '@/types/api'

import type { ServiceResponse } from '@trash-kit/core'
import type { Application } from '@/types/api/application'

export class ApplicationService {
  public static async get<T = Application>(
    id: string,
    headers: AuthenticatedHeaders
  ): Promise<ServiceResponse<T>> {
    return await apiRequest<T>({ path: `/application/${encodeURIComponent(id)}`, headers })
  }

  public static async getAll<T = Application[]>(
    headers: AuthenticatedHeaders
  ): Promise<ServiceResponse<T>> {
    return await apiRequest<T>({ path: '/application/all', headers })
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

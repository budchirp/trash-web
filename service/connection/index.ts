import { apiRequest } from '@/service/api'

import type { AuthenticatedHeaders } from '@/types/api'

import type { ServiceResponse } from '@trash-kit/core'
import type { Connection } from '@/types/api/connection'

export class ConnectionService {
  public static async connect<
    T = {
      token: string
    }
  >(
    applicationId: string,
    permissions: string[],
    headers: AuthenticatedHeaders
  ): Promise<ServiceResponse<T>> {
    return await apiRequest<T>({
      method: 'POST',
      path: '/connection/connect',
      body: { applicationId, permissions },
      headers
    })
  }

  public static async getAll<T = Connection[]>(
    headers: AuthenticatedHeaders
  ): Promise<ServiceResponse<T>> {
    return await apiRequest<T>({ path: '/connection/all', headers })
  }

  public static async delete(
    tokenId: string,
    headers: AuthenticatedHeaders
  ): Promise<ServiceResponse> {
    return await apiRequest({
      method: 'DELETE',
      path: `/connection/${encodeURIComponent(tokenId)}`,
      headers,
      empty: true
    })
  }
}

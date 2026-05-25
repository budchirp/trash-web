import { apiRequest } from '@/service/api'

import type { NewSessionValues } from '@/service/session/schemas'
import type { AuthenticatedHeaders, Headers } from '@/types/api'
import type { ServiceResponse } from '@trash-kit/core'
import type { Session } from '@/types/api/session'

export class SessionService {
  public static async create<T = { token: string }>(
    values: NewSessionValues,
    headers: Headers
  ): Promise<ServiceResponse<T>> {
    return await apiRequest<T>({ method: 'POST', path: '/session', body: values, headers })
  }

  public static async get(
    token: string | null,
    headers: AuthenticatedHeaders
  ): Promise<ServiceResponse> {
    return await apiRequest({
      path: token ? `/session/${encodeURIComponent(token)}` : '/session',
      headers,
      empty: true
    })
  }

  public static async getAll<T = Session[]>(
    headers: AuthenticatedHeaders
  ): Promise<ServiceResponse<T>> {
    return await apiRequest<T>({ path: '/session/all', headers })
  }

  public static async delete(
    token: string | null,
    headers: AuthenticatedHeaders
  ): Promise<ServiceResponse> {
    return await apiRequest({
      method: 'DELETE',
      path: token ? `/session/${encodeURIComponent(token)}` : '/session',
      headers,
      empty: true
    })
  }
}

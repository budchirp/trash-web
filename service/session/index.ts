import { request, type ApiServiceResponse } from '@/service/api'

import type { NewSessionValues } from '@/service/session/schemas'
import { mapSession, type SessionDto } from '@/service/session/mapper'
import type { Session } from '@/types/api/session'

type CreateSessionResponse = { token: string }

export const SessionService = {
  create(values: NewSessionValues): Promise<ApiServiceResponse<CreateSessionResponse>> {
    return request<CreateSessionResponse>({ method: 'POST', path: '/session', body: values })
  },

  async getAll(token: string): Promise<ApiServiceResponse<Session[]>> {
    const response = await request<SessionDto[]>({ path: '/session/all', token })
    if (response.error) return response

    return { error: false, message: response.message, data: response.data.map(mapSession) }
  },

  delete(id: string | null, token: string): Promise<ApiServiceResponse> {
    const path = id ? `/session/${encodeURIComponent(id)}` : '/session'
    return request({ method: 'DELETE', path, token, empty: true })
  }
}

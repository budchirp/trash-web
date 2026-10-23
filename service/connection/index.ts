import { request, type ApiServiceResponse } from '@/service/api'

import { mapConnection, type ConnectionDto } from '@/service/connection/mapper'

import type { Connection } from '@/types/api/connection'

export const ConnectionService = {
  connect(
    applicationId: string,
    permissions: string[],
    token: string
  ): Promise<ApiServiceResponse<{ token: string }>> {
    return request<{ token: string }>({
      method: 'POST',
      path: '/connection/connect',
      body: { applicationId, permissions },
      token
    })
  },

  async getAll(token: string): Promise<ApiServiceResponse<Connection[]>> {
    const response = await request<ConnectionDto[]>({ path: '/connection/all', token })
    if (response.error) return response

    return { error: false, message: response.message, data: response.data.map(mapConnection) }
  },

  delete(id: string, token: string): Promise<ApiServiceResponse> {
    return request({
      method: 'DELETE',
      path: `/connection/${encodeURIComponent(id)}`,
      token,
      empty: true
    })
  }
}

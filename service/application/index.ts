import { CONSTANTS } from '@/lib/constants'
import { Fetch } from '@trash-kit/core'

import type { AuthenticatedHeaders } from '@/types/api'

import type { ApiResponse, ServiceResponse } from '@trash-kit/core'
import type { Application } from '@/types/api/application'

export class ApplicationService {
  public static async getAll<T = Application[]>(
    headers: AuthenticatedHeaders
  ): Promise<ServiceResponse<T>> {
    try {
      const { json, response } = await Fetch.get<ApiResponse<T>>(
        `${CONSTANTS.API_URL}/application/all`,
        headers
      )

      if (response.ok && !json.error) {
        return {
          error: false,
          message: json.message,
          data: json.data
        }
      }

      return {
        error: true,
        message: json.message,
        status: response.status,
        data: null
      }
    } catch (error) {
      console.error(error)

      return {
        error: true,
        message: 'Internal server error',
        status: 500,
        data: null
      }
    }
  }

  public static async delete(id: string, headers: AuthenticatedHeaders): Promise<ServiceResponse> {
    try {
      const { json, response } = await Fetch.delete<ApiResponse<null>>(
        `${CONSTANTS.API_URL}/application/${id}`,
        headers
      )

      if (response.ok && !json.error) {
        return {
          error: false,
          message: json.message,
          data: null
        }
      }

      return {
        error: true,
        message: json.message,
        status: response.status,
        data: null
      }
    } catch (error) {
      console.error(error)

      return {
        error: true,
        message: 'Internal server error',
        status: 500,
        data: null
      }
    }
  }
}

import { CONSTANTS } from '@/lib/constants'
import { Fetch } from '@trash-kit/core'

import type { NewSessionValues } from '@/service/session/schemas'
import type { AuthenticatedHeaders, Headers } from '@/types/api'
import type { ApiResponse, ServiceResponse } from '@trash-kit/core'
import type { Session } from '@/types/api/session'

export class SessionService {
  public static async create<T = { token: string }>(
    values: NewSessionValues,
    headers: Headers
  ): Promise<ServiceResponse<T>> {
    try {
      const { json, response } = await Fetch.post<ApiResponse<T>>(
        `${CONSTANTS.API_URL}/session`,
        values,
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

  public static async get(
    token: string | null,
    headers: AuthenticatedHeaders
  ): Promise<ServiceResponse> {
    try {
      const { json, response } = token
        ? await Fetch.get<ApiResponse<null>>(`${CONSTANTS.API_URL}/session/${token}`, headers)
        : await Fetch.get<ApiResponse<null>>(`${CONSTANTS.API_URL}/session`, headers)

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

  public static async getAll<T = Session[]>(
    headers: AuthenticatedHeaders
  ): Promise<ServiceResponse<T>> {
    try {
      const { json, response } = await Fetch.get<ApiResponse<T>>(
        `${CONSTANTS.API_URL}/session/all`,
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

  public static async delete(
    token: string | null,
    headers: AuthenticatedHeaders
  ): Promise<ServiceResponse> {
    try {
      const { json, response } = token
        ? await Fetch.delete<ApiResponse<null>>(`${CONSTANTS.API_URL}/session/${token}`, headers)
        : await Fetch.delete<ApiResponse<null>>(`${CONSTANTS.API_URL}/session`, headers)

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

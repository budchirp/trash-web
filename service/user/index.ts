import { CONSTANTS } from '@/lib/constants'
import { Fetch } from '@trash-kit/core'

import type { NewUserValues } from '@/service/user/schema'
import type { AuthenticatedHeaders, Headers } from '@/types/api'
import type { User } from '@/types/api/user'

import type { ApiResponse, ServiceResponse } from '@trash-kit/core'

export class UserService {
  public static async create(values: NewUserValues, headers: Headers): Promise<ServiceResponse> {
    try {
      const { json, response } = await Fetch.post<ApiResponse<null>>(
        `${CONSTANTS.API_URL}/user`,
        values,
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

  public static async get<T = User>(headers: AuthenticatedHeaders): Promise<ServiceResponse<T>> {
    try {
      const { json, response } = await Fetch.get<ApiResponse<T>>(
        `${CONSTANTS.API_URL}/user`,
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
}

import { apiRequest } from '@/service/api'

import type { NewUserValues, ProfileValues } from '@/service/user/schema'
import type { AuthenticatedHeaders, Headers } from '@/types/api'
import type { Profile, User } from '@/types/api/user'

import type { ServiceResponse } from '@trash-kit/core'

export class UserService {
  public static async create(values: NewUserValues, headers: Headers): Promise<ServiceResponse> {
    return await apiRequest({ method: 'POST', path: '/user', body: values, headers, empty: true })
  }

  public static async get<T = User>(headers: AuthenticatedHeaders): Promise<ServiceResponse<T>> {
    return await apiRequest<T>({ path: '/user', headers })
  }

  public static async updateProfile<T = Profile>(
    values: ProfileValues,
    headers: AuthenticatedHeaders
  ): Promise<ServiceResponse<T>> {
    return await apiRequest<T>({ method: 'PATCH', path: '/user/profile', body: values, headers })
  }
}

import { request, type ApiServiceResponse } from '@/service/api'

import type { NewUserValues, ProfileValues } from '@/service/user/schema'
import type { Profile, PublicUser, User } from '@/types/api/user'

export const UserService = {
  create(values: NewUserValues): Promise<ApiServiceResponse> {
    return request({ method: 'POST', path: '/user', body: values, empty: true })
  },

  get(token: string): Promise<ApiServiceResponse<User>> {
    return request<User>({ path: '/user', token })
  },

  getByUsername(username: string, token: string): Promise<ApiServiceResponse<PublicUser>> {
    return request<PublicUser>({ path: `/user/${encodeURIComponent(username)}`, token })
  },

  updateProfile(
    values: Partial<ProfileValues>,
    token: string
  ): Promise<ApiServiceResponse<Profile>> {
    return request<Profile>({ method: 'PATCH', path: '/user/profile', body: values, token })
  }
}

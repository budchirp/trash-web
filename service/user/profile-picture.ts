import { upload } from '@/lib/file'
import { request, type ApiServiceResponse } from '@/service/api'
import { UserService } from '@/service/user'

import type { PresignedUploadRequest, PresignedUploadResponse } from '@/types/api/upload'
import type { User } from '@/types/api/user'

export const ProfilePictureService = {
  requestUpload(
    values: PresignedUploadRequest,
    token: string
  ): Promise<ApiServiceResponse<PresignedUploadResponse>> {
    return request<PresignedUploadResponse>({
      method: 'POST',
      path: '/user/profile/picture',
      body: values,
      token
    })
  },

  delete(token: string): Promise<ApiServiceResponse<null>> {
    return request<null>({
      method: 'DELETE',
      path: '/user/profile/picture',
      token,
      empty: true
    })
  },

  async upload(
    file: File,
    token: string,
    onProgress?: (progress: number) => void
  ): Promise<ApiServiceResponse<User>> {
    const result = await upload(
      file,
      () =>
        ProfilePictureService.requestUpload(
          { content_type: file.type, content_length: file.size },
          token
        ),
      onProgress
    )
    if (result.error) return result

    return UserService.get(token)
  }
}

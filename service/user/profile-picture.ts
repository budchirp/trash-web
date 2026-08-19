import { uploadFile } from '@/lib/file-upload'
import { apiRequest } from '@/service/api'
import { UserService } from '@/service/user'

import type { AuthenticatedHeaders } from '@/types/api'
import type { PresignedUploadRequest, PresignedUploadResponse } from '@/types/api/upload'
import type { ServiceResponse } from '@trash-kit/core'
import type { User } from '@/types/api/user'

export class ProfilePictureService {
  public static async requestUpload(
    values: PresignedUploadRequest,
    headers: AuthenticatedHeaders
  ): Promise<ServiceResponse<PresignedUploadResponse>> {
    return await apiRequest<PresignedUploadResponse>({
      method: 'POST',
      path: '/user/profile/picture',
      body: values,
      headers
    })
  }

  public static async delete(headers: AuthenticatedHeaders): Promise<ServiceResponse<null>> {
    return await apiRequest<null>({
      method: 'DELETE',
      path: '/user/profile/picture',
      headers,
      empty: true
    })
  }

  public static async upload(
    file: File,
    headers: AuthenticatedHeaders,
    onProgress?: (progress: number) => void
  ): Promise<ServiceResponse<User>> {
    const uploaded = await uploadFile(
      file,
      () =>
        ProfilePictureService.requestUpload(
          { content_type: file.type, content_length: file.size },
          headers
        ),
      onProgress
    )
    if (uploaded.error) return uploaded

    return await UserService.get<User>(headers)
  }
}

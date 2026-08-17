import { S3Helper } from '@/lib/s3-helper'
import { apiRequest } from '@/service/api'
import { UserService } from '@/service/user'

import type { AuthenticatedHeaders } from '@/types/api'
import type {
  ProfilePictureUploadRequest,
  ProfilePictureUploadResponse,
  User
} from '@/types/api/user'

import type { ServiceResponse } from '@trash-kit/core'

export class ProfilePictureService {
  public static async requestUpload(
    values: ProfilePictureUploadRequest,
    headers: AuthenticatedHeaders
  ): Promise<ServiceResponse<ProfilePictureUploadResponse>> {
    return await apiRequest<ProfilePictureUploadResponse>({
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
    const presigned = await ProfilePictureService.requestUpload(
      { content_type: file.type, content_length: file.size },
      headers
    )
    if (presigned.error) {
      return {
        error: true,
        message: presigned.message,
        status: presigned.status,
        data: null
      }
    }

    const upload = await S3Helper.upload(presigned.data.url, file, file.type, onProgress)
    if (upload.error) {
      return {
        error: true,
        message: upload.message,
        status: upload.status,
        data: null
      }
    }

    return await UserService.get<User>(headers)
  }
}

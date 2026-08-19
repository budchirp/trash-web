import { S3Helper } from '@/lib/s3-helper'

import type { ServiceResponse } from '@trash-kit/core'
import type { PresignedUploadResponse } from '@/types/api/upload'

export type CreateUpload = () => Promise<ServiceResponse<PresignedUploadResponse>>

export const uploadFile = async (
  file: File,
  createUpload: CreateUpload,
  onProgress?: (progress: number) => void
): Promise<ServiceResponse<null>> => {
  const presigned = await createUpload()
  if (presigned.error) return presigned

  let upload = await S3Helper.upload(presigned.data.url, file, file.type, onProgress)

  if (upload.error && upload.status === 403) {
    const refreshed = await createUpload()
    if (refreshed.error) return refreshed

    upload = await S3Helper.upload(refreshed.data.url, file, file.type, onProgress)
  }

  return upload
}

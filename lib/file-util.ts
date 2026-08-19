export type ProfilePictureValidationResult =
  | { valid: true }
  | { valid: false; error: 'invalid_type' | 'too_large' }

type AllowedImageType = (typeof FileUtil.ALLOWED_IMAGE_TYPES)[number]

export class FileUtil {
  static readonly ALLOWED_IMAGE_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp'
  ] as const
  static readonly MAX_IMAGE_SIZE = 5 * 1024 * 1024

  static validatePicture(file: File): ProfilePictureValidationResult {
    if (!FileUtil.ALLOWED_IMAGE_TYPES.includes(file.type as AllowedImageType)) {
      return {
        valid: false,
        error: 'invalid_type'
      }
    }

    if (file.size > FileUtil.MAX_IMAGE_SIZE) {
      return {
        valid: false,
        error: 'too_large'
      }
    }

    return { valid: true }
  }

  static formatSize(bytes: number): string {
    if (bytes >= FileUtil.MAX_IMAGE_SIZE) {
      return `${(bytes / FileUtil.MAX_IMAGE_SIZE).toFixed(1)} MB`
    }

    if (bytes >= 1024) {
      return `${Math.round(bytes / 1024)} KB`
    }

    return `${bytes} B`
  }
}

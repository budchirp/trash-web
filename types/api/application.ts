import type { Image } from '@/types/api/upload'

export type Application = {
  id: string

  name: string
  description: string

  icon: Image | null

  createdAt: string | null
}

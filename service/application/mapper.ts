import type { Application } from '@/types/api/application'

export type ApplicationDto = {
  id: string
  name: string
  description: string
  icon: string | null
  created_at: string | null
}

export const mapApplication = (application: ApplicationDto): Application => ({
  id: application.id,
  name: application.name,
  description: application.description,
  icon: application.icon,
  createdAt: application.created_at
})

import { mapApplication, type ApplicationDto } from '@/service/application/mapper'
import { mapToken, type TokenDto } from '@/service/session/mapper'

import type { Connection } from '@/types/api/connection'

export type ConnectionDto = {
  token: TokenDto
  application: ApplicationDto
  created_at: string | null
}

export const mapConnection = (connection: ConnectionDto): Connection => ({
  token: mapToken(connection.token),
  application: mapApplication(connection.application),
  createdAt: connection.created_at
})

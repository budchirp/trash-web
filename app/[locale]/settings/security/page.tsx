import type React from 'react'

import { ConnectionsSection } from '@/components/app/settings/security/connection/connections-section'
import { SessionsSection } from '@/components/app/settings/security/session/sessions-section'
import { ConnectionService } from '@/service/connection'
import { SessionService } from '@/service/session'
import { requireSession } from '@/lib/auth'

import { Column } from '@trash-kit/ui'

import { LINKS } from '@/lib/link'

const Page: React.FC = async (): Promise<React.ReactNode> => {
  const { token } = await requireSession(LINKS.settings.security)

  const sessions = await SessionService.getAll(token)
  const connections = await ConnectionService.getAll(token)

  return (
    <Column className='gap-4'>
      <SessionsSection
        initialSessions={sessions.error ? [] : sessions.data || []}
        initialError={sessions.error ? sessions.message : null}
        token={token}
      />

      <ConnectionsSection
        initialConnections={connections.error ? [] : connections.data || []}
        initialError={connections.error ? connections.message : null}
        token={token}
      />
    </Column>
  )
}

export default Page

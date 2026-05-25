import type React from 'react'

import { ConnectionsSection } from '@/components/app/settings/security/connection/connections-section'
import { SessionsSection } from '@/components/app/settings/security/session/sessions-section'
import { ConnectionService } from '@/service/connection'
import { SessionService } from '@/service/session'
import { _authtenticated } from '@/lib/auth'

import { Column } from '@trash-kit/ui'

import type { DynamicPageProps } from '@/types/app/page'

const Page: React.FC<DynamicPageProps> = async ({
  params
}: DynamicPageProps): Promise<React.ReactNode> => {
  const { locale } = await params
  const jwt = await _authtenticated(locale, `/${locale}/settings/security`)

  const sessions = await SessionService.getAll({ jwt, locale })
  if (sessions.error) throw new Error(sessions.message)

  const connections = await ConnectionService.getAll({ jwt, locale })
  if (connections.error) throw new Error(connections.message)

  return (
    <Column className='gap-4'>
      <SessionsSection initialSessions={sessions.data || []} jwt={jwt} />

      <ConnectionsSection initialConnections={connections.data || []} jwt={jwt} />
    </Column>
  )
}

export default Page

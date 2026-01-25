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
  const jwt = await _authtenticated()

  const { locale } = await params

  const { data: sessions } = await SessionService.getAll({ jwt, locale })
  const { data: connections } = await ConnectionService.getAll({ jwt, locale })

  return (
    <Column className='gap-4'>
      <SessionsSection initialSessions={sessions || []} jwt={jwt} />

      <ConnectionsSection initialConnections={connections || []} jwt={jwt} />
    </Column>
  )
}

export default Page

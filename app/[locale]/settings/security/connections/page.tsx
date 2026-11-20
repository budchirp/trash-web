import { ConnectionsSection } from '@/components/app/settings/security/connection/connections-section'
import { ConnectionService } from '@/service/connection'
import { requireSession } from '@/lib/auth'
import { LINKS } from '@/lib/link'

export default async function Page() {
  const { token } = await requireSession(LINKS.settings.connections)
  const response = await ConnectionService.getAll(token)

  return (
    <ConnectionsSection
      initialConnections={response.error ? [] : response.data}
      initialError={response.error ? response.message : null}
      token={token}
    />
  )
}

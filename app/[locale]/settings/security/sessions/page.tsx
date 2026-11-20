import { SessionsSection } from '@/components/app/settings/security/session/sessions-section'
import { SessionService } from '@/service/session'
import { requireSession } from '@/lib/auth'
import { LINKS } from '@/lib/link'

export default async function Page() {
  const { token } = await requireSession(LINKS.settings.sessions)
  const response = await SessionService.getAll(token)

  return (
    <SessionsSection
      initialSessions={response.error ? [] : response.data}
      initialError={response.error ? response.message : null}
      token={token}
    />
  )
}

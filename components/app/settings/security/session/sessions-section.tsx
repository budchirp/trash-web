'use client'

import type React from 'react'
import { useEffect, useState } from 'react'

import { SessionService } from '@/service/session'
import { handle } from '@/lib/handle'
import { Alert, Column, Section, Text, toast } from '@trash-kit/ui'
import { useTranslations } from 'next-intl'
import { SessionBox } from './session-box'
import jsonwebtoken from 'jsonwebtoken'
import { ConfirmationDialog } from '@/components/dialogs/confirmation-dialog'

import type { Session } from '@/types/api/session'

type DecodedToken = {
  id?: string
}

type SessionsSectionProps = {
  token: string

  initialSessions: Session[]
  initialError?: string | null
}

export const SessionsSection: React.FC<SessionsSectionProps> = ({
  token,
  initialSessions,
  initialError
}: SessionsSectionProps): React.ReactNode => {
  const [sessions, setSessions] = useState(initialSessions)
  const [error, setError] = useState(initialError ?? null)
  const [selected, setSelected] = useState<Session | null>(null)

  const decoded = jsonwebtoken.decode(token)
  const tokenId = decoded && typeof decoded === 'object' ? (decoded as DecodedToken).id : undefined

  const fetchSessions = async () => {
    const response = await SessionService.getAll(token)
    if (handle(response, setError)) return

    setError(null)
    setSessions(response.data)
  }

  useEffect(() => {
    if (sessions.length === 0) fetchSessions()
  }, [])

  const t = useTranslations('settings')

  return (
    <Section title={t('session.title')}>
      <Column className='gap-4'>
        {error && <Alert color='danger' description={error} />}

        {sessions?.map((session) => (
          <SessionBox
            key={session.token.id}
            session={session}
            tokenId={tokenId}
            onRevoke={(session) => {
              if (session.token.id !== tokenId) setSelected(session)
            }}
          />
        ))}

        {sessions.length === 0 && !error && <Text>{t('session.no_sessions')}</Text>}
        <ConfirmationDialog
          open={selected != null}
          onClose={() => setSelected(null)}
          title={t('security.revoke_session')}
          description={t('security.revoke_session_description')}
          confirmLabel={t('security.revoke')}
          onConfirm={async () => {
            if (!selected) return false
            const response = await SessionService.delete(selected.token.id, token)
            if (handle(response)) return false
            setSessions((previous) => previous.filter((s) => s.token.id !== selected.token.id))
            toast(t('security.revoked'))
            return true
          }}
        />
      </Column>
    </Section>
  )
}

'use client'

import type React from 'react'
import { useEffect, useState } from 'react'

import { SessionService } from '@/service/session'
import { handle } from '@/lib/handle-service'
import { ServiceError } from '@/components/service-error'
import { Column, Section, Text, toast } from '@trash-kit/ui'
import { useLocale, useTranslations } from 'next-intl'
import { SessionBox } from './session-box'
import jsonwebtoken from 'jsonwebtoken'

import type { Session } from '@/types/api/session'

type DecodedToken = {
  id?: string
}

type SessionsSectionProps = {
  jwt: string

  initialSessions: Session[]
  initialError?: string | null
}

export const SessionsSection: React.FC<SessionsSectionProps> = ({
  jwt,
  initialSessions,
  initialError
}: SessionsSectionProps): React.ReactNode => {
  const [sessions, setSessions] = useState(initialSessions)
  const [error, setError] = useState(initialError ?? null)

  const locale = useLocale()

  const decoded = jsonwebtoken.decode(jwt)
  const tokenId = decoded && typeof decoded === 'object' ? (decoded as DecodedToken).id : undefined

  const fetchSessions = async () => {
    const response = await SessionService.getAll({ jwt })
    if (handle(response, locale, setError)) return

    setError(null)
    setSessions(response.data)
  }

  useEffect(() => {
    if (sessions.length === 0) fetchSessions()
  }, [])

  const t = useTranslations('settings')

  return (
    <Section title={t('session.title')} description={t('session.description')}>
      <Column className='gap-4'>
        {error && <ServiceError message={error} />}

        {sessions?.map((session) => (
          <SessionBox
            key={session.token.id}
            session={session}
            tokenId={tokenId}
            onRevoke={async (session) => {
              if (session.token.id === tokenId) return

              const response = await SessionService.delete(session.token.id, { jwt })
              if (handle(response, locale)) return

              toast(t('security.revoked'))
              setSessions((previous) => previous.filter((s) => s.token.id !== session.token.id))
            }}
          />
        ))}

        {sessions.length === 0 && !error && <Text>{t('session.no_sessions')}</Text>}
      </Column>
    </Section>
  )
}

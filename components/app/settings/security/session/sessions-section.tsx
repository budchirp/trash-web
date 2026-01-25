'use client'

import type React from 'react'
import { useEffect, useState } from 'react'

import { SessionService } from '@/service/session'
import { Column, Section, toast } from '@trash-kit/ui'
import { useTranslations } from 'next-intl'
import { SessionBox } from './session-box'

import type { Session } from '@/types/api/session'

type SessionsSectionProps = {
  jwt: string

  initialSessions: Session[]
}

export const SessionsSection: React.FC<SessionsSectionProps> = ({
  jwt,
  initialSessions
}: SessionsSectionProps): React.ReactNode => {
  const [sessions, setSessions] = useState(initialSessions)

  const fetchSessions = async () => {
    const { data } = await SessionService.getAll({ jwt })
    if (!data) return

    setSessions(data)
  }

  useEffect(() => {
    if (sessions.length === 0) fetchSessions()
  }, [])

  const t = useTranslations('settings')

  return (
    <Section title={t('session.title')} description={t('session.description')}>
      <Column className='gap-4'>
        {sessions?.map((session, index) => (
          <SessionBox
            key={index}
            jwt={jwt}
            session={session}
            onRevoke={async (session) => {
              const { error } = await SessionService.delete(session.token.id, { jwt })
              if (!error) {
                toast(t('security.revoked'))

                setSessions((previous) => previous.filter((s) => s.token.id !== session.token.id))
              }
            }}
          />
        ))}
      </Column>
    </Section>
  )
}

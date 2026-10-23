'use client'

import type React from 'react'
import { useEffect, useState } from 'react'

import { ConnectionService } from '@/service/connection'
import { handle } from '@/lib/handle'
import { Alert, Box, BoxContent, Column, Section, Text, toast } from '@trash-kit/ui'
import { useTranslations } from 'next-intl'
import { ConnectionBox } from './connection-box'

import type { Connection } from '@/types/api/connection'

type ConnectionsSectionProps = {
  token: string

  initialConnections: Connection[]
  initialError?: string | null
}

export const ConnectionsSection: React.FC<ConnectionsSectionProps> = ({
  token,
  initialConnections,
  initialError
}: ConnectionsSectionProps): React.ReactNode => {
  const [connections, setConnections] = useState(initialConnections)
  const [error, setError] = useState(initialError ?? null)

  const fetchConnections = async () => {
    const response = await ConnectionService.getAll(token)
    if (handle(response, setError)) return

    setError(null)
    setConnections(response.data)
  }

  useEffect(() => {
    if (connections.length === 0) fetchConnections()
  }, [])

  const t = useTranslations('settings')

  return (
    <Section title={t('connection.title')}>
      <Column className='gap-4'>
        {error && <Alert color='danger' description={error} />}

        {connections?.map((connection) => (
          <ConnectionBox
            key={connection.token.id}
            connection={connection}
            onRevoke={async (connection) => {
              const response = await ConnectionService.delete(connection.token.id, token)
              if (handle(response)) return

              toast(t('security.revoked'))
              setConnections((previous) =>
                previous.filter((s) => s.token.id !== connection.token.id)
              )
            }}
          />
        ))}

        {connections.length === 0 && !error && (
          <Box color='secondary'>
            <BoxContent>
              <Text>{t('connection.no_connections')}</Text>
            </BoxContent>
          </Box>
        )}
      </Column>
    </Section>
  )
}

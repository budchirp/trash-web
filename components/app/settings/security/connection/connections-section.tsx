'use client'

import type React from 'react'
import { useEffect, useState } from 'react'

import { ConnectionService } from '@/service/connection'
import { handle } from '@/lib/handle-service'
import { ServiceError } from '@/components/service-error'
import { Box, BoxContent, Column, Section, Text, toast } from '@trash-kit/ui'
import { useLocale, useTranslations } from 'next-intl'
import { ConnectionBox } from './connection-box'

import type { Connection } from '@/types/api/connection'

type ConnectionsSectionProps = {
  jwt: string

  initialConnections: Connection[]
  initialError?: string | null
}

export const ConnectionsSection: React.FC<ConnectionsSectionProps> = ({
  jwt,
  initialConnections,
  initialError
}: ConnectionsSectionProps): React.ReactNode => {
  const [connections, setConnections] = useState(initialConnections)
  const [error, setError] = useState(initialError ?? null)
  const locale = useLocale()

  const fetchConnections = async () => {
    const response = await ConnectionService.getAll({ jwt })
    if (handle(response, locale, setError)) return

    setError(null)
    setConnections(response.data)
  }

  useEffect(() => {
    if (connections.length === 0) fetchConnections()
  }, [])

  const t = useTranslations('settings')

  return (
    <Section title={t('connection.title')} description={t('connection.description')}>
      <Column className='gap-4'>
        {error && <ServiceError message={error} />}

        {connections?.map((connection) => (
          <ConnectionBox
            key={connection.token.id}
            connection={connection}
            onRevoke={async (connection) => {
              const response = await ConnectionService.delete(connection.token.id, {
                jwt
              })
              if (handle(response, locale)) return

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

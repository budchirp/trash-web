'use client'

import type React from 'react'
import { useEffect, useState } from 'react'

import { ConnectionService } from '@/service/connection'
import { Box, BoxContent, Column, Section, Text, toast } from '@trash-kit/ui'
import { useTranslations } from 'next-intl'
import { ConnectionBox } from './connection-box'

import type { Connection } from '@/types/api/connection'

type ConnectionsSectionProps = {
  jwt: string

  initialConnections: Connection[]
}

export const ConnectionsSection: React.FC<ConnectionsSectionProps> = ({
  jwt,
  initialConnections
}: ConnectionsSectionProps): React.ReactNode => {
  const [connections, setConnections] = useState(initialConnections)

  const fetchConnections = async () => {
    const { error, message, data } = await ConnectionService.getAll({ jwt })
    if (error) {
      toast(message)
      return
    }

    setConnections(data)
  }

  useEffect(() => {
    if (connections.length === 0) fetchConnections()
  }, [])

  const t = useTranslations('settings')

  return (
    <Section title={t('connection.title')} description={t('connection.description')}>
      <Column className='gap-4'>
        {connections?.map((connection, index) => (
          <ConnectionBox
            key={index}
            connection={connection}
            onRevoke={async (connection) => {
              const { error, message } = await ConnectionService.delete(connection.token.id, {
                jwt
              })
              if (!error) {
                toast(t('security.revoked'))

                setConnections((previous) =>
                  previous.filter((s) => s.token.id !== connection.token.id)
                )
              } else {
                toast(message)
              }
            }}
          />
        ))}

        {connections.length === 0 && (
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

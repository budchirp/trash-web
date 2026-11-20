'use client'

import { useEffect, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'

import {
  Alert,
  Box,
  BoxContent,
  Button,
  Column,
  Divider,
  Section,
  Text,
  toast
} from '@trash-kit/ui'
import { ApplicationSummary } from '@/components/app/developers/applications/application'
import { ConfirmationDialog } from '@/components/dialogs/confirmation-dialog'
import { DetailsTable } from '@/components/ui/details-table'
import { format } from '@/lib/date'
import { handle } from '@/lib/handle'
import { ConnectionService } from '@/service/connection'
import { PermissionsSection } from '../permissions-section'

import type { Connection } from '@/types/api/connection'

type ConnectionsSectionProps = {
  token: string
  initialConnections: Connection[]
  initialError?: string | null
}

export const ConnectionsSection = ({
  token,
  initialConnections,
  initialError
}: ConnectionsSectionProps) => {
  const t = useTranslations('settings')
  const locale = useLocale()

  const [connections, setConnections] = useState(initialConnections)
  const [error, setError] = useState(initialError ?? null)
  const [selected, setSelected] = useState<Connection | null>(null)

  const fetchConnections = async () => {
    const response = await ConnectionService.getAll(token)

    if (handle(response, setError)) return

    setError(null)
    setConnections(response.data)
  }

  useEffect(() => {
    if (initialConnections.length === 0) void fetchConnections()
  }, [])

  const revoke = async () => {
    if (!selected) return false

    const response = await ConnectionService.delete(selected.token.id, token)

    if (handle(response)) return false

    setConnections((previous) =>
      previous.filter((connection) => connection.token.id !== selected.token.id)
    )
    toast(t('security.revoked'))

    return true
  }

  return (
    <Section title={t('connection.title')}>
      <Column className='gap-4'>
        {error && <Alert color='danger' description={error} />}

        {connections.map((connection) => (
          <Box key={connection.token.id} color='primary'>
            <BoxContent>
              <ApplicationSummary application={connection.application}>
                <Button onClick={() => setSelected(connection)}>{t('security.revoke')}</Button>
              </ApplicationSummary>
            </BoxContent>

            <Divider />

            <BoxContent>
              <DetailsTable
                variant='plain'
                rows={[
                  { label: t('security.created_at'), value: format(connection.createdAt, locale) },
                  {
                    label: t('security.expires_at'),
                    value: format(connection.token.expiresAt, locale)
                  }
                ]}
              />
            </BoxContent>

            <Divider />

            <BoxContent>
              <PermissionsSection permissions={connection.token.permissions} />
            </BoxContent>
          </Box>
        ))}

        {connections.length === 0 && !error && (
          <Box color='primary'>
            <BoxContent>
              <Text>{t('connection.no_connections')}</Text>
            </BoxContent>
          </Box>
        )}
      </Column>

      <ConfirmationDialog
        open={selected !== null}
        onClose={() => setSelected(null)}
        onConfirm={revoke}
        title={t('security.revoke_connection')}
        description={t('security.revoke_connection_description')}
        confirmLabel={t('security.revoke')}
      />
    </Section>
  )
}

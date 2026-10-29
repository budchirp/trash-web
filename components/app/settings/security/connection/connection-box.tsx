'use client'

import type React from 'react'

import { PermissionsSection } from '@/components/app/settings/security/permissions-section'
import { ApplicationSummary } from '@/components/app/developers/applications/summary'
import { useLocale, useTranslations } from 'next-intl'
import { format } from '@/lib/date'

import { Box, BoxContent, Button, Column, Divider, Heading, Row, Text } from '@trash-kit/ui'

import type { Connection } from '@/types/api/connection'

type ConnectionBoxProps = {
  connection: Connection
  onRevoke: (connection: Connection) => void
}

export const ConnectionBox: React.FC<ConnectionBoxProps> = ({
  connection,
  onRevoke
}: ConnectionBoxProps) => {
  const locale = useLocale()

  const t = useTranslations('settings')

  return (
    <Box color='secondary'>
      <BoxContent>
        <ApplicationSummary application={connection.application}>
          <Button onClick={() => onRevoke(connection)}>{t('security.revoke')}</Button>
        </ApplicationSummary>
      </BoxContent>

      <Divider />

      <BoxContent>
        <Column>
          <Row className='gap-1'>
            <Heading size='h4'>{t('security.created_at')}:</Heading>
            <Text>{format(connection.createdAt, locale)}</Text>
          </Row>

          <Row className='gap-1'>
            <Heading size='h4'>{t('security.expires_at')}:</Heading>
            <Text>{format(connection.token.expiresAt, locale)}</Text>
          </Row>
        </Column>
      </BoxContent>

      <Divider />

      <BoxContent>
        <PermissionsSection permissions={connection.token.permissions} />
      </BoxContent>
    </Box>
  )
}

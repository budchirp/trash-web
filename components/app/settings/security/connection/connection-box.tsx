'use client'

import type React from 'react'

import { PermissionsSection } from '@/components/app/settings/security/permissions-section'
import { ApplicationSection } from '@/components/app/authorize/application-section'
import { useLocale, useTranslations } from 'next-intl'
import { DateUtil } from '@/lib/date-util'

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
        <ApplicationSection application={connection.application}>
          <Button onClick={() => onRevoke(connection)}>{t('security.revoke')}</Button>
        </ApplicationSection>
      </BoxContent>

      <Divider />

      <BoxContent>
        <Column className='gap-1'>
          <Row className='gap-2'>
            <Heading size='h4'>{t('security.created_at')}:</Heading>
            <Text>{DateUtil.format(new Date(connection.createdAt), locale)}</Text>
          </Row>

          <Row className='gap-2'>
            <Heading size='h4'>{t('security.expires_at')}:</Heading>
            <Text>{DateUtil.format(new Date(connection.token.expiresAt), locale)}</Text>
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

'use client'

import type React from 'react'

import { PermissionsSection } from './permissions-section'
import { useLocale, useTranslations } from 'next-intl'
import { ConnectionService } from '@/service/connection'

import { Box, BoxContent, Button, Column, Divider, Heading, Row, Text, toast } from '@trash-kit/ui'

import type { Connection } from '@/types/api/connection'

type ConnectionBoxProps = {
  jwt: string
  connection: Connection
}

export const ConnectionBox: React.FC<ConnectionBoxProps> = ({
  jwt,
  connection
}: ConnectionBoxProps) => {
  const locale = useLocale()

  const t = useTranslations('settings')

  const revoke = async () => {
    const { error } = await ConnectionService.delete(connection.token.id, { jwt })
    if (!error) toast(t('security.revoked'))
  }

  return (
    <Box>
      <BoxContent>
        <Row className='gap-2 flex-col w-full md:flex-row items-start md:items-center'>
          <Column className='grow'>
            <Heading size='h3'>{connection.application.name}</Heading>
          </Column>

          <div className='shrink-0'>
            <Button onClick={revoke}>{t('security.revoke')}</Button>
          </div>
        </Row>
      </BoxContent>

      <Divider />

      <BoxContent>
        <Row className='gap-2'>
          <Heading size='h4'>{t('security.expires_at')}:</Heading>
          <Text>
            {new Date(connection.token.expiresAt).toLocaleString(locale, {
              weekday: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </Text>
        </Row>
      </BoxContent>

      <Divider />

      <BoxContent>
        <PermissionsSection permissions={connection.token.permissions} />
      </BoxContent>
    </Box>
  )
}

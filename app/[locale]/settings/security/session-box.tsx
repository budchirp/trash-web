'use client'

import type React from 'react'

import { Download, Globe, Laptop, Smartphone, Tablet } from 'lucide-react'
import { PermissionsSection } from './permissions-section'
import { useLocale, useTranslations } from 'next-intl'
import { SessionService } from '@/service/session'
import jsonwebtoken from 'jsonwebtoken'

import {
  Box,
  BoxContent,
  Button,
  Center,
  Column,
  Divider,
  Heading,
  Row,
  Text,
  toast
} from '@trash-kit/ui'

import type { Session } from '@/types/api/session'

type SessionBoxProps = {
  jwt: string
  session: Session
}

export const SessionBox: React.FC<SessionBoxProps> = ({ jwt, session }: SessionBoxProps) => {
  const locale = useLocale()

  const t = useTranslations('settings')

  const revoke = async () => {
    const { error } = await SessionService.delete(session.token.id, { jwt })
    if (!error) toast(t('security.revoked'))
  }

  const isCurrentSession = session.token.id === jsonwebtoken.decode(jwt)?.token

  return (
    <Box>
      <BoxContent>
        <Row className='gap-4 w-full'>
          <Center className='size-12 bg-surface-accent rounded-full border border-outline-accent aspect-square p-3'>
            {session.device.platform === 'MOBILE' && <Smartphone />}
            {session.device.platform === 'DESKTOP' && <Laptop />}
            {session.device.platform === 'TABLET' && <Tablet />}
          </Center>

          <Row className='gap-2 flex-col w-full md:flex-row items-start md:items-center'>
            <Column className='grow gap-1'>
              <Column className='gap-1 md:gap-0'>
                <Row className='md:gap-2 flex-col md:flex-row items-start md:items-center'>
                  <Heading size='h3'>{session.device.name}</Heading>
                  <Heading size='h4' className='text-tertiary'>
                    {session.device.os}
                  </Heading>
                </Row>

                <Row className='md:gap-4 flex-col md:flex-row items-start md:items-center'>
                  <Row className='gap-1'>
                    <Globe className='size-4' />
                    <Text className='text-tertiary'>{session.ip}</Text>
                  </Row>

                  <Row className='gap-1'>
                    <Download className='size-4' />
                    <Text className='text-tertiary'>{session.browser}</Text>
                  </Row>
                </Row>
              </Column>
            </Column>

            <div className='shrink-0'>
              {isCurrentSession ? (
                <Text className='text-tertiary'>{t('session.current_session')}</Text>
              ) : (
                <Button onClick={revoke}>{t('security.revoke')}</Button>
              )}
            </div>
          </Row>
        </Row>
      </BoxContent>

      <Divider />

      <BoxContent>
        <Row className='gap-2'>
          <Heading size='h4'>{t('security.expires_at')}:</Heading>
          <Text>
            {new Date(session.token.expiresAt).toLocaleString(locale, {
              weekday: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </Text>
        </Row>
      </BoxContent>

      <Divider />

      <BoxContent>
        <PermissionsSection permissions={session.token.permissions} />
      </BoxContent>
    </Box>
  )
}

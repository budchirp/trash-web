'use client'

import type React from 'react'

import { Download, Globe, Laptop, Smartphone, Tablet } from 'lucide-react'
import { PermissionsSection } from '../permissions-section'
import { useLocale, useTranslations } from 'next-intl'
import { IconBox } from '@/components/icon-box'
import { DateUtil } from '@/lib/date-util'
import jsonwebtoken from 'jsonwebtoken'

import {
  Box,
  BoxContent,
  Button,
  Column,
  Divider,
  Heading,
  Row,
  Section,
  Text
} from '@trash-kit/ui'

import type { Session } from '@/types/api/session'

type SessionBoxProps = {
  jwt: string
  session: Session
  onRevoke: (session: Session) => void
}

export const SessionBox: React.FC<SessionBoxProps> = ({
  jwt,
  session,
  onRevoke
}: SessionBoxProps) => {
  const locale = useLocale()

  const t = useTranslations('settings')

  return (
    <Box color='secondary'>
      <BoxContent>
        <Row className='gap-3 w-full'>
          <IconBox
            className='size-12'
            color='accent'
            icon={
              (session.device.platform === 'MOBILE' && <Smartphone />) ||
              (session.device.platform === 'DESKTOP' && <Laptop />) ||
              (session.device.platform === 'TABLET' && <Tablet />)
            }
          />

          <Row className='gap-2 w-full grow flex-col md:flex-row items-start md:items-center'>
            <Column className='grow gap-1'>
              <Column className='gap-1 md:gap-0'>
                <Heading size='h3'>{session.device.name}</Heading>

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
              {session.token.id === (jsonwebtoken.decode(jwt) as any).token ? (
                <Text className='text-tertiary'>{t('session.current_session')}</Text>
              ) : (
                <Button onClick={() => onRevoke(session)}>{t('security.revoke')}</Button>
              )}
            </div>
          </Row>
        </Row>
      </BoxContent>

      <Divider />

      <BoxContent>
        <Column className='gap-1'>
          <Row className='gap-2'>
            <Heading size='h4'>{t('security.created_at')}:</Heading>
            <Text>{DateUtil.format(new Date(session.createdAt), locale)}</Text>
          </Row>

          <Row className='gap-2'>
            <Heading size='h4'>{t('security.expires_at')}:</Heading>
            <Text>{DateUtil.format(new Date(session.token.expiresAt), locale)}</Text>
          </Row>
        </Column>
      </BoxContent>

      <Divider />

      <BoxContent>
        <PermissionsSection permissions={session.token.permissions} />
      </BoxContent>
    </Box>
  )
}

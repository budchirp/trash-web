'use client'

import { useEffect, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Download, Globe, Laptop, Smartphone, Tablet } from 'lucide-react'
import jsonwebtoken from 'jsonwebtoken'

import {
  Alert,
  Box,
  BoxContent,
  Button,
  Column,
  Divider,
  Heading,
  IconBox,
  Row,
  Section,
  Text,
  toast
} from '@trash-kit/ui'
import { ConfirmationDialog } from '@/components/dialogs/confirmation-dialog'
import { DetailsTable } from '@/components/ui/details-table'
import { format } from '@/lib/date'
import { handle } from '@/lib/handle'
import { SessionService } from '@/service/session'

import type { Session } from '@/types/api/session'

type SessionsSectionProps = {
  token: string
  initialSessions: Session[]
  initialError?: string | null
}

export const SessionsSection = ({ token, initialSessions, initialError }: SessionsSectionProps) => {
  const t = useTranslations('settings')
  const locale = useLocale()

  const [sessions, setSessions] = useState(initialSessions)
  const [error, setError] = useState(initialError ?? null)
  const [selected, setSelected] = useState<Session | null>(null)

  const decoded = jsonwebtoken.decode(token)
  const tokenId =
    decoded && typeof decoded === 'object' && typeof decoded.id === 'string'
      ? decoded.id
      : undefined

  const fetchSessions = async () => {
    const response = await SessionService.getAll(token)

    if (handle(response, setError)) return

    setError(null)
    setSessions(response.data)
  }

  useEffect(() => {
    if (initialSessions.length === 0) void fetchSessions()
  }, [])

  const revoke = async () => {
    if (!selected || selected.token.id === tokenId) return false

    const response = await SessionService.delete(selected.token.id, token)

    if (handle(response)) return false

    setSessions((previous) => previous.filter((session) => session.token.id !== selected.token.id))
    toast(t('security.revoked'))

    return true
  }

  return (
    <Section title={t('session.title')}>
      <Column className='gap-4'>
        {error && <Alert color='danger' description={error} />}

        {sessions.map((session) => {
          const DeviceIcon =
            session.device.platform === 'MOBILE'
              ? Smartphone
              : session.device.platform === 'TABLET'
                ? Tablet
                : Laptop

          const isCurrent = session.token.id === tokenId

          return (
            <Box key={session.token.id} color='primary'>
              <BoxContent>
                <Row className='w-full flex-wrap items-center gap-3'>
                  <IconBox color='secondary' size='lg' className='shrink-0 text-content-tertiary'>
                    <DeviceIcon />
                  </IconBox>

                  <Column className='min-w-0 flex-1 gap-1'>
                    <Heading size='h3' className='wrap-break-word'>
                      {session.device.name}
                    </Heading>

                    <Row className='flex-wrap gap-3 text-content-tertiary'>
                      <Row className='gap-1'>
                        <Globe className='size-4' />
                        <Text>{session.ip}</Text>
                      </Row>

                      <Row className='gap-1'>
                        <Download className='size-4' />
                        <Text>{session.browser}</Text>
                      </Row>
                    </Row>
                  </Column>

                  <div className='w-full shrink-0 sm:w-auto'>
                    {isCurrent ? (
                      <Text className='text-content-tertiary'>{t('session.current_session')}</Text>
                    ) : (
                      <Button onClick={() => setSelected(session)}>{t('security.revoke')}</Button>
                    )}
                  </div>
                </Row>
              </BoxContent>

              <Divider />

              <BoxContent>
                <DetailsTable
                  variant='plain'
                  rows={[
                    { label: t('security.created_at'), value: format(session.createdAt, locale) },
                    {
                      label: t('security.expires_at'),
                      value: format(session.token.expiresAt, locale)
                    }
                  ]}
                />
              </BoxContent>
            </Box>
          )
        })}

        {sessions.length === 0 && !error && <Text>{t('session.no_sessions')}</Text>}
      </Column>

      <ConfirmationDialog
        open={selected !== null}
        onClose={() => setSelected(null)}
        onConfirm={revoke}
        title={t('security.revoke_session')}
        description={t('security.revoke_session_description')}
        confirmLabel={t('security.revoke')}
      />
    </Section>
  )
}

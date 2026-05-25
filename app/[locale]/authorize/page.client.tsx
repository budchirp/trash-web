'use client'

import type React from 'react'
import { useState } from 'react'

import { PermissionsSection } from '@/components/app/settings/security/permissions-section'
import { ApplicationSection } from '@/components/app/authorize/application-section'
import { ConnectionService } from '@/service/connection'
import { useTranslations } from 'next-intl'

import { Button, Column, Container, Row, Section, toast, BoxContent, Box } from '@trash-kit/ui'

import type { Application } from '@/types/api/application'

type AuthorizeClientPageProps = {
  jwt: string

  callback: string
  application: Application
  permissions: string[]
}

export const AuthorizeClientPage: React.FC<AuthorizeClientPageProps> = ({
  jwt,
  callback,
  application,
  permissions
}): React.ReactNode => {
  const t = useTranslations('authorize')

  const [loading, setLoading] = useState(false)

  const authorize = async () => {
    if (loading) return

    setLoading(true)

    const { error, message, data } = await ConnectionService.connect(application.id, permissions, {
      jwt
    })

    if (error) {
      toast(message)

      setLoading(false)
    } else {
      const separator = callback.includes('?') ? '&' : '?'
      window.location.replace(`${callback}${separator}token=${encodeURIComponent(data.token)}`)
    }
  }

  return (
    <Container className='max-w-lg!'>
      <Section title={t('title')}>
        <Column className='gap-4'>
          <ApplicationSection application={application} />

          <Box color='secondary'>
            <BoxContent>
              <PermissionsSection permissions={permissions} />
            </BoxContent>
          </Box>

          <Row className='w-full justify-end'>
            <Button disabled={loading} loading={loading} onClick={authorize}>
              {loading ? t('authorizing') : t('authorize')}
            </Button>
          </Row>
        </Column>
      </Section>
    </Container>
  )
}

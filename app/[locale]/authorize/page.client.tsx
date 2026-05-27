'use client'

import type React from 'react'
import { useState } from 'react'

import { PermissionsSection } from '@/components/app/settings/security/permissions-section'
import { ApplicationSection } from '@/components/app/authorize/application-section'
import { AccountSection } from '@/components/app/authorize/account-section'
import { ConnectionService } from '@/service/connection'
import { useTranslations } from 'next-intl'

import { Button, Column, Container, Row, Section, toast, BoxContent, Box } from '@trash-kit/ui'

import type { Application } from '@/types/api/application'
import type { User } from '@/types/api/user'

type AuthorizeClientPageProps = {
  jwt: string
  user: User

  callback: string
  application: Application
  permissions: string[]
}

export const AuthorizeClientPage: React.FC<AuthorizeClientPageProps> = ({
  jwt,
  user,
  callback,
  application,
  permissions
}): React.ReactNode => {
  const t = useTranslations('auth.authorize')

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
      setLoading(false)

      const separator = callback.includes('?') ? '&' : '?'
      window.location.replace(`${callback}${separator}token=${encodeURIComponent(data.token)}`)
    }
  }

  return (
    <Container className='max-w-lg!'>
      <Section title={t('title')}>
        <Column className='gap-4'>
          <ApplicationSection application={application} />

          <PermissionsSection permissions={permissions} />

          <AccountSection
            user={user}
            action={
              <Button disabled={loading} loading={loading} onClick={authorize}>
                {loading ? t('authorizing') : t('authorize')}
              </Button>
            }
          />
        </Column>
      </Section>
    </Container>
  )
}

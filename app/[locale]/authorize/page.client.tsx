'use client'

import type React from 'react'
import { useState } from 'react'

import { PermissionsSection } from '@/components/app/settings/security/permissions-section'
import { ApplicationSummary } from '@/components/app/developers/applications/application'
import { AccountCard } from '@/components/app/settings/account/account-card'
import { currentPath, withRedirect } from '@/lib/redirect'
import { LINKS } from '@/lib/link'
import { ConnectionService } from '@/service/connection'
import { useTranslations } from 'next-intl'

import { Button, Column, Container, Row, Section, toast } from '@trash-kit/ui'

import type { Application } from '@/types/api/application'
import type { User } from '@/types/api/user'

type AuthorizeClientPageProps = {
  token: string
  user: User

  callback: string
  application: Application
  permissions: string[]
}

export const AuthorizeClientPage: React.FC<AuthorizeClientPageProps> = ({
  token,
  user,
  callback,
  application,
  permissions
}): React.ReactNode => {
  const t = useTranslations('auth.authorize')
  const t_common = useTranslations('common')
  const account = useTranslations('auth.account')

  const [loading, setLoading] = useState(false)

  const authorize = async () => {
    if (loading) return

    setLoading(true)

    const { error, message, data } = await ConnectionService.connect(
      application.id,
      permissions,
      token
    )

    if (error) {
      toast(t_common('error'), { description: message, color: 'danger' })

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
          <ApplicationSummary application={application} />

          <PermissionsSection permissions={permissions} />

          <Section subsection description={account('this_account')}>
            <Column className='gap-4'>
              <AccountCard user={user} />

              <Row className='w-full justify-end gap-2'>
                <Button
                  color='secondary'
                  onClick={() =>
                    window.location.replace(withRedirect(LINKS.auth.signIn, currentPath()))
                  }
                >
                  {account('use_another_account')}
                </Button>

                <Button disabled={loading} loading={loading} onClick={authorize}>
                  {loading ? t_common('loading') : t('authorize')}
                </Button>
              </Row>
            </Column>
          </Section>
        </Column>
      </Section>
    </Container>
  )
}

'use client'

import type React from 'react'

import { AccountCard } from '../settings/account/account-card'
import { useLocale, useTranslations } from 'next-intl'
import { getAuthPath, getCurrentRedirect } from '@/lib/redirects'

import { Button, Column, Row, Section } from '@trash-kit/ui'

import type { User } from '@/types/api/user'

type AccountSectionProps = {
  user: User
  action: React.ReactNode
}

export const AccountSection: React.FC<AccountSectionProps> = ({
  user,
  action
}: AccountSectionProps): React.ReactNode => {
  const locale = useLocale()

  const t = useTranslations('auth.account')

  return (
    <Section subsection description={t('this_account')}>
      <Column className='gap-4'>
        <AccountCard user={user} />

        <Row className='w-full gap-2 justify-end'>
          <Button
            color='primary'
            onClick={() => {
              window.location.replace(getAuthPath(locale, 'signin', getCurrentRedirect()))
            }}
          >
            {t('use_another_account')}
          </Button>

          {action}
        </Row>
      </Column>
    </Section>
  )
}

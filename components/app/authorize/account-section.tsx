'use client'

import type React from 'react'

import { AccountCard } from '../settings/account/account-card'
import { useLocale, useTranslations } from 'next-intl'

import { Button, Column, Row, Section } from '@trash-kit/ui'

import type { User } from '@/types/api/user'
import Link from 'next/link'

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
              const redirectTo = `${window.location.pathname}${window.location.search}`
              const params = new URLSearchParams({ redirectTo, from: 'authorize' })

              window.location.replace(`/${locale}/auth/signin?${params.toString()}`)
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

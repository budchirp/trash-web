'use client'

import type React from 'react'

import { AccountSession } from '@/lib/account-session'
import { useCookies } from 'next-client-cookies'
import { useLocale, useTranslations } from 'next-intl'

import { Button, Column, Row, Section } from '@trash-kit/ui'

import type { SavedAccount } from '@/types/app/account'
import { AccountCard } from './account-card'

type AccountSwitcherProps = {
  accounts: SavedAccount[]
  token: string
  redirectTo?: string | null
  showUseAnother?: boolean
  showUseCurrent?: boolean
}

export const AccountSwitcher: React.FC<AccountSwitcherProps> = ({
  accounts,
  token,
  redirectTo = null,
  showUseAnother = true
}: AccountSwitcherProps): React.ReactNode => {
  const locale = useLocale()
  const cookies = useCookies()

  const t = useTranslations('auth.account')

  const accountSession = new AccountSession(cookies)

  if (accounts.length === 0) return null

  const switchAccount = (token: string): void => {
    accountSession.set(token)
    accountSession.add(token)

    if (redirectTo) window.location.replace(redirectTo)
    else window.location.reload()
  }

  return (
    <Section title={t('title')} description={t('choose_account')}>
      <Column className='gap-4'>
        <Column className='gap-2'>
          {accounts.map((account) => {
            const isActive = account.token === token

            return (
              <AccountCard
                key={account.token}
                user={account.user}
                active={isActive}
                onClick={() => {
                  if (isActive) {
                    if (redirectTo) window.location.replace(redirectTo)
                    else window.location.reload()
                  } else {
                    switchAccount(account.token)
                  }
                }}
              />
            )
          })}
        </Column>

        <Row className='w-full gap-2 justify-end'>
          {showUseAnother && (
            <Button
              color='primary'
              onClick={() => {
                const redirectTo = `${window.location.pathname}${window.location.search}`
                window.location.replace(
                  `/${locale}/auth/signin?redirectTo=${encodeURIComponent(redirectTo)}`
                )
              }}
            >
              {t('use_another_account')}
            </Button>
          )}
        </Row>
      </Column>
    </Section>
  )
}

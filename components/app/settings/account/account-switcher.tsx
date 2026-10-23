'use client'

import type React from 'react'

import { save } from '@/lib/session'
import { useCookies } from 'next-client-cookies'
import { useTranslations } from 'next-intl'
import { currentPath, withRedirect } from '@/lib/redirect'
import { LINKS } from '@/lib/link'

import { Button, Column, Row, Section } from '@trash-kit/ui'

import type { SavedAccount } from '@/types/app/account'
import { AccountCard } from './account-card'

type AccountSwitcherProps = {
  accounts: SavedAccount[]
  token: string
  redirectTo?: string | null
  showUseAnother?: boolean
}

export const AccountSwitcher: React.FC<AccountSwitcherProps> = ({
  accounts,
  token,
  redirectTo = null,
  showUseAnother = true
}: AccountSwitcherProps): React.ReactNode => {
  const cookies = useCookies()

  const t = useTranslations('auth.account')

  if (accounts.length === 0) return null

  const switchAccount = (nextToken: string): void => {
    save(cookies, nextToken)

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
                window.location.replace(withRedirect(LINKS.auth.signIn, currentPath()))
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

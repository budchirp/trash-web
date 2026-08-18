'use client'

import type React from 'react'
import { Fragment, useEffect, useRef, useState } from 'react'

import { Check } from 'lucide-react'
import { Transition } from '@headlessui/react'
import { useCookies } from 'next-client-cookies'
import { useTranslations } from 'next-intl'

import { AccountSession } from '@/lib/account-session'
import { LINKS } from '@/lib/link'
import { getSignInPath } from '@/lib/redirects'
import { Link, usePathname } from '@/lib/i18n/routing'

import { Avatar } from '@/components/app/user/avatar'

import { Box, BoxContent, Button, cn, Column, Divider, Heading, Row, Text } from '@trash-kit/ui'

import type { SavedAccount } from '@/types/app/account'
import type { User } from '@/types/api/user'

const PANEL_WIDTH = 288
const PANEL_GAP = 8

const AccountSummary: React.FC<{ user: User }> = ({ user }) => (
  <Row className='min-w-0 items-start gap-3'>
    <Avatar user={user} className='size-12 shrink-0' />

    <Column className='min-w-0'>
      <Heading size='h3' className='truncate font-semibold'>
        {user.profile?.name?.trim() || user.username}
      </Heading>

      <Text className='truncate text-content-tertiary'>@{user.username}</Text>
    </Column>
  </Row>
)

const AccountInfo: React.FC<{ user: User; current: boolean }> = ({ user, current }) => (
  <Row className='min-w-0 items-center justify-between gap-3'>
    <Text className='truncate font-medium'>@{user.username}</Text>
    {current && <Check className='size-5 shrink-0' />}
  </Row>
)

const accountRow =
  'block w-full rounded-lg border-0 bg-transparent px-3 py-2 text-left hover:bg-surface-secondary'

type AccountSwitcherProps = {
  accounts: SavedAccount[]
  user: User
}

const AccountSwitcher: React.FC<AccountSwitcherProps> = ({ accounts, user }) => {
  const cookies = useCookies()
  const accountSession = new AccountSession(cookies)

  const switchAccount = (account: SavedAccount): void => {
    accountSession.set(account.token)
    accountSession.add(account.token)
    window.location.reload()
  }

  const orderedAccounts = [
    ...accounts.filter((account) => account.user.id === user.id),
    ...accounts.filter((account) => account.user.id !== user.id)
  ]

  return (
    <Box>
      {orderedAccounts.map((account, index) => {
        const isCurrent = account.user.id === user.id

        return (
          <Fragment key={account.token}>
            {index > 0 && <Divider className='w-full' />}

            {isCurrent ? (
              <Link href={LINKS.user.profile(account.user.username)} className={accountRow}>
                <AccountInfo user={account.user} current={isCurrent} />
              </Link>
            ) : (
              <button type='button' className={accountRow} onClick={() => switchAccount(account)}>
                <AccountInfo user={account.user} current={isCurrent} />
              </button>
            )}
          </Fragment>
        )
      })}

      <Divider className='w-full' />

      <BoxContent>
        <AddAccountButton />
      </BoxContent>
    </Box>
  )
}

const AddAccountButton: React.FC = (): React.ReactNode => {
  const t = useTranslations('auth')
  const pathname = usePathname()

  return (
    <Link href={getSignInPath(pathname)} className='block w-full'>
      <Button color='secondary' className='w-full justify-center'>
        {t('account.add_account')}
      </Button>
    </Link>
  )
}

type AccountBoxProps = {
  user: User
  accounts: SavedAccount[]
  menu?: boolean
}

type AccountPanel = {
  top: number
  left: number
  side: 'right' | 'left' | 'bottom'
}

const panelOrigin: Record<AccountPanel['side'], string> = {
  right: 'origin-left',
  left: 'origin-right',
  bottom: 'origin-top'
}

export const AccountBox: React.FC<AccountBoxProps> = ({ user, accounts, menu = false }) => {
  const [open, setOpen] = useState(false)
  const [panel, setPanel] = useState<AccountPanel | null>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  const openPanel = (): void => {
    const rect = triggerRef.current?.getBoundingClientRect()
    if (!rect) return

    if (menu) {
      const fitsRight = rect.right + PANEL_WIDTH + PANEL_GAP <= window.innerWidth

      setPanel({
        top: rect.top,
        left: fitsRight
          ? rect.right + PANEL_GAP
          : Math.max(PANEL_GAP, rect.left - PANEL_WIDTH - PANEL_GAP),
        side: fitsRight ? 'right' : 'left'
      })
    } else {
      setPanel({
        top: Math.min(rect.bottom + PANEL_GAP, window.innerHeight - PANEL_GAP),
        left: Math.max(PANEL_GAP, Math.min(rect.left, window.innerWidth - PANEL_WIDTH - PANEL_GAP)),
        side: 'bottom'
      })
    }

    setOpen(true)
  }

  const togglePanel = (): void => {
    if (open) {
      setOpen(false)
      return
    }

    openPanel()
  }

  useEffect(() => {
    if (!open) return

    const close = (): void => setOpen(false)

    window.addEventListener('scroll', close, { capture: true })
    window.addEventListener('resize', close)

    if (menu) {
      return () => {
        window.removeEventListener('scroll', close, { capture: true })
        window.removeEventListener('resize', close)
      }
    }

    const handlePointerDown = (event: PointerEvent): void => {
      const target = event.target as Node | null
      if (!target) return
      if (triggerRef.current?.contains(target)) return
      if (panelRef.current?.contains(target)) return

      setOpen(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)

    return () => {
      window.removeEventListener('scroll', close, { capture: true })
      window.removeEventListener('resize', close)
      document.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [menu, open])

  return (
    <div className='relative w-full'>
      <button
        ref={triggerRef}
        type='button'
        className='block w-full border-0 bg-transparent p-0 text-left'
        onClick={togglePanel}
      >
        <AccountSummary user={user} />
      </button>

      <Transition show={open}>
        <div
          ref={panelRef}
          className={cn(
            'fixed z-50 w-72',
            panel && panelOrigin[panel.side],
            'transition duration-150 ease-out',
            'data-closed:scale-95 data-closed:opacity-0'
          )}
          style={panel ? { top: panel.top, left: panel.left } : undefined}
        >
          <AccountSwitcher accounts={accounts} user={user} />
        </div>
      </Transition>
    </div>
  )
}

type AuthButtonsProps = {
  direction?: 'row' | 'column'
}

export const AuthButtons: React.FC<AuthButtonsProps> = ({ direction = 'row' }) => {
  const t = useTranslations('auth')
  const isColumn = direction === 'column'
  const Wrapper = isColumn ? Column : Row

  return (
    <Wrapper className='gap-2'>
      <Link href={LINKS.auth.signIn} className={cn(isColumn && 'w-full')}>
        <Button color='secondary' className='w-full md:w-fit'>
          {t('sign_in.title')}
        </Button>
      </Link>

      <Link href={LINKS.auth.signUp} className={cn(isColumn && 'w-full')}>
        <Button color='secondary' className='w-full md:w-fit'>
          {t('sign_up.title')}
        </Button>
      </Link>
    </Wrapper>
  )
}

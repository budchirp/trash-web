'use client'

import type React from 'react'
import { use, useEffect, useMemo, useState } from 'react'

import { Menu as MenuIcon, X } from 'lucide-react'
import { Menu, MenuButton, MenuItems, Transition } from '@headlessui/react'
import { useTranslations } from 'next-intl'

import { useLogout } from '@/lib/hooks/use-logout'
import { SelectableLinks } from '@/components/link'
import { UserContext } from '@/context/user'
import { getDesktopNavLinks, getDrawerNavLinks, getUserMenuLinks, type NavLink } from '@/lib/link'
import { usePathname } from '@/lib/i18n/routing'

import { Logo } from '@/components/logo'
import { Avatar } from '@/components/app/user/avatar'
import { AccountBox, AuthButtons } from '@/components/ui/account-switcher'

import { Box, BoxContent, Button, cn, Column, Container, Divider, Row } from '@trash-kit/ui'

import type { SavedAccount } from '@/types/app/account'
import type { User } from '@/types/api/user'

type UserMenuProps = {
  user: User
  accounts: SavedAccount[]
  onLogout: () => void
}

const UserMenu: React.FC<UserMenuProps> = ({ user, accounts, onLogout }) => {
  const t = useTranslations()
  const pathname = usePathname()

  return (
    <Menu key={pathname} as='div' className='relative'>
      <MenuButton
        as={Button}
        shape='circle'
        color='secondary'
        className='border-0 bg-transparent p-0'
      >
        <Avatar user={user} className='size-12' />
      </MenuButton>

      <MenuItems
        as={Box}
        transition
        anchor='bottom end'
        className={cn(
          'z-50 mt-4 min-w-60 w-fit origin-top-right',
          'transition duration-150 ease-out',
          'data-closed:scale-95 data-closed:opacity-0'
        )}
      >
        <BoxContent>
          <AccountBox user={user} accounts={accounts} menu />
        </BoxContent>

        <Divider className='w-full' />

        <BoxContent>
          <SelectableLinks box links={getUserMenuLinks(t, user)} />
        </BoxContent>

        <Divider className='w-full' />

        <BoxContent>
          <Button color='secondary' className='w-full justify-center' onClick={onLogout}>
            {t('auth.logout')}
          </Button>
        </BoxContent>
      </MenuItems>
    </Menu>
  )
}

type MobileDrawerProps = {
  user: User | null
  accounts: SavedAccount[]
  links: NavLink[]
  open: boolean
  onLogout: () => void
}

const MobileDrawer: React.FC<MobileDrawerProps> = ({ user, accounts, links, open, onLogout }) => {
  const t = useTranslations('auth')

  return (
    <Transition show={open}>
      <div
        id='mobile-navigation'
        className={cn(
          'fixed inset-x-0 top-16 bottom-0 z-20 overflow-y-auto',
          'border-b border-outline bg-surface-primary',
          'transition-[transform,opacity] duration-200 ease-out',
          'data-closed:-translate-y-2 data-closed:opacity-0'
        )}
      >
        <Column>
          {links.length > 0 && (
            <>
              <BoxContent>
                <SelectableLinks links={links} box />
              </BoxContent>

              <Divider className='w-full' />
            </>
          )}

          {user ? (
            <>
              <BoxContent>
                <AccountBox user={user} accounts={accounts} />
              </BoxContent>

              <Divider className='w-full' />

              <BoxContent>
                <Button color='secondary' className='w-full justify-center' onClick={onLogout}>
                  {t('logout')}
                </Button>
              </BoxContent>
            </>
          ) : (
            <Container>
              <AuthButtons direction='column' />
            </Container>
          )}
        </Column>
      </div>
    </Transition>
  )
}

type DesktopNavigationProps = {
  user: User | null
  accounts: SavedAccount[]
  links: NavLink[]
  onLogout: () => void
}

const DesktopNavigation: React.FC<DesktopNavigationProps> = ({
  user,
  accounts,
  links,
  onLogout
}) => {
  return (
    <Row className='hidden items-center gap-4 md:flex'>
      {links.length > 0 && (
        <>
          <SelectableLinks links={links} />

          <Divider className='h-8' thickness='thick' orientation='vertical' />
        </>
      )}

      {user ? <UserMenu user={user} accounts={accounts} onLogout={onLogout} /> : <AuthButtons />}
    </Row>
  )
}

type HeaderProps = {
  accounts: SavedAccount[]
}

export const Header: React.FC<HeaderProps> = ({ accounts }) => {
  const t = useTranslations()
  const { user } = use(UserContext)
  const logout = useLogout()
  const pathname = usePathname()

  const [open, setOpen] = useState(false)

  const isHome = pathname === '/'

  const desktopLinks = useMemo<NavLink[]>(
    () => getDesktopNavLinks(t, user, isHome),
    [t, user, isHome]
  )

  const drawerLinks = useMemo<NavLink[]>(
    () => getDrawerNavLinks(t, user, isHome),
    [t, user, isHome]
  )

  const showContent = user !== null || !isHome

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <>
      <header
        className={cn(
          'fixed top-0 z-30 h-16 w-full select-none',
          'border-b border-outline',
          'bg-surface-primary/50 backdrop-blur-sm'
        )}
      >
        <Container className='h-full'>
          <Row className='h-full items-center justify-between gap-2'>
            <Logo />

            {showContent && (
              <Row className='items-center gap-3'>
                <DesktopNavigation
                  user={user}
                  accounts={accounts}
                  links={desktopLinks}
                  onLogout={logout}
                />

                <Button
                  aria-label={open ? 'Close menu' : 'Open menu'}
                  aria-expanded={open}
                  aria-controls='mobile-navigation'
                  shape='circle'
                  color='primary'
                  className='md:hidden'
                  onClick={() => setOpen((value) => !value)}
                >
                  {open ? <X /> : <MenuIcon />}
                </Button>
              </Row>
            )}
          </Row>
        </Container>
      </header>

      {showContent && (
        <MobileDrawer
          open={open}
          user={user}
          accounts={accounts}
          links={drawerLinks}
          onLogout={logout}
        />
      )}

      <div className='h-16' />
    </>
  )
}

Header.displayName = 'Header'

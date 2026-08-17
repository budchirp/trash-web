'use client'

import type React from 'react'
import { use, useEffect, useMemo, useState } from 'react'

import { Menu as MenuIcon, X } from 'lucide-react'
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react'
import { useTranslations } from 'next-intl'

import { useLogout } from '@/lib/hooks/use-logout'
import { SelectableLink } from '@/components/link'
import { UserContext } from '@/context/user'
import { Link, usePathname } from '@/lib/i18n/routing'
import { Logo } from '@/components/logo'
import { Avatar } from '@/components/app/user/avatar'

import {
  cn,
  Button,
  Container,
  Row,
  Section,
  Divider,
  Column,
  Heading,
  Text,
  Box,
  BoxContent
} from '@trash-kit/ui'

import type { User } from '@/types/api/user'

type NavLink = {
  label: string
  url: string
}

type UserProfileInfoProps = {
  user: User
}

export const UserProfileInfo: React.FC<UserProfileInfoProps> = ({ user }) => (
  <Row className='min-w-0 gap-3'>
    <Avatar user={user} className='size-12 shrink-0' />

    <Column className='min-w-0'>
      {user.profile?.name?.trim() && (
        <Heading size='h3' className='truncate font-semibold'>
          {user.profile.name}
        </Heading>
      )}

      <Text className='truncate text-content-tertiary'>@{user.username}</Text>
    </Column>
  </Row>
)

type AuthButtonsProps = {
  direction?: 'row' | 'column'
}

export const AuthButtons: React.FC<AuthButtonsProps> = ({ direction = 'row' }) => {
  const t = useTranslations('auth')
  const isRow = direction === 'row'

  const Wrapper = isRow ? Row : Column

  return (
    <Wrapper className='gap-2'>
      <Link href='/auth/signin' className={cn(!isRow && 'w-full')}>
        <Button color='secondary' className='w-full md:w-fit'>
          {t('sign_in.title')}
        </Button>
      </Link>

      <Link href='/auth/signup' className={cn(!isRow && 'w-full')}>
        <Button color='secondary' className='w-full md:w-fit'>
          {t('sign_up.title')}
        </Button>
      </Link>
    </Wrapper>
  )
}

type NavLinksProps = {
  links: NavLink[]
  box?: boolean
}

export const NavLinks: React.FC<NavLinksProps> = ({ links, box = false }) => {
  if (!links.length) return null

  if (box) {
    return (
      <Column className='gap-2'>
        {links.map((link) => (
          <SelectableLink key={link.url} box label={link.label} url={link.url} />
        ))}
      </Column>
    )
  }

  return (
    <Row className='flex-row-reverse gap-2'>
      {links.map((link) => (
        <SelectableLink key={link.url} label={link.label} url={link.url} />
      ))}
    </Row>
  )
}

type UserMenuProps = {
  user: User
  onLogout: () => void
}

export const UserMenu: React.FC<UserMenuProps> = ({ user, onLogout }) => {
  const t = useTranslations('auth')

  return (
    <Menu as='div' className='relative'>
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
          <UserProfileInfo user={user} />
        </BoxContent>

        <Divider />

        <BoxContent>
          <MenuItem>
            <Button color='secondary' className='w-full justify-center' onClick={onLogout}>
              {t('logout')}
            </Button>
          </MenuItem>
        </BoxContent>
      </MenuItems>
    </Menu>
  )
}

type MobileDrawerProps = {
  user: User | null
  onLogout: () => void
  open: boolean
  links: NavLink[]
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({ open, user, links, onLogout }) => {
  const t = useTranslations('auth')

  return (
    <Transition show={open}>
      <div
        id='mobile-navigation'
        className={cn(
          'fixed inset-x-0 top-16 bottom-0 z-20 overflow-y-auto',
          'bg-surface-primary border-b border-outline',
          'transition-[transform,opacity] duration-200 ease-out',
          'data-closed:-translate-y-2 data-closed:opacity-0'
        )}
      >
        <Section>
          <Column className='gap-4'>
            {links.length > 0 && (
              <>
                <Container>
                  <NavLinks links={links} box />
                </Container>

                <Divider />
              </>
            )}

            {user && (
              <>
                <Container>
                  <UserProfileInfo user={user} />
                </Container>

                <Divider />
              </>
            )}

            <Container>
              {user ? (
                <Button color='secondary' className='w-full justify-center' onClick={onLogout}>
                  {t('logout')}
                </Button>
              ) : (
                <AuthButtons direction='column' />
              )}
            </Container>
          </Column>
        </Section>
      </div>
    </Transition>
  )
}

type DesktopNavigationProps = {
  user: User | null
  links: NavLink[]
  onLogout: () => void
}

const DesktopNavigation: React.FC<DesktopNavigationProps> = ({ user, links, onLogout }) => (
  <Row className='hidden items-center gap-4 md:flex'>
    {links.length > 0 && (
      <>
        <NavLinks links={links} />

        <Divider className='h-8' thickness='thick' orientation='vertical' />
      </>
    )}

    {user ? <UserMenu user={user} onLogout={onLogout} /> : <AuthButtons />}
  </Row>
)

export const Header: React.FC = (): React.ReactNode => {
  const t = useTranslations()
  const { user } = use(UserContext)
  const logout = useLogout()
  const pathname = usePathname()

  const [open, setOpen] = useState(false)

  const isHome = pathname === '/'

  const links = useMemo<NavLink[]>(() => {
    if (user) {
      return [
        {
          label: t('dashboard.title'),
          url: '/dashboard'
        },
        {
          label: t('settings.title'),
          url: '/settings'
        }
      ]
    }

    if (!isHome) {
      return [
        {
          label: t('common.home'),
          url: '/'
        }
      ]
    }

    return []
  }, [user, isHome, t])

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
                <DesktopNavigation user={user} links={links} onLogout={logout} />

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

      {showContent && <MobileDrawer open={open} user={user} links={links} onLogout={logout} />}

      <div className='h-16' />
    </>
  )
}
Header.displayName = 'Header'

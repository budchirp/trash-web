'use client'

import type React from 'react'
import { useState, use } from 'react'

import { Dialog, DialogPanel, Transition } from '@headlessui/react'
import { Menu as MenuIcon, X } from 'lucide-react'
import { useLogout } from '@/lib/hooks/use-logout'
import { useTranslations } from 'next-intl'
import { Link } from '@/lib/i18n/routing'
import { Logo } from '@/components/logo'

import { cn, Button, Container, Row, Section, Divider, Column } from '@trash-kit/ui'
import { UserContext } from '@/context/user'
import { SelectableLink } from '../link'

export const Header: React.FC = (): React.ReactNode => {
  const t = useTranslations()

  const { user } = use(UserContext)
  const logout = useLogout()

  const links: {
    [key in 'true' | 'false']: {
      label: string
      url: string
    }[]
  } = {
    true: [
      {
        label: t('dashboard.title'),
        url: '/dashboard'
      },
      {
        label: t('settings.title'),
        url: '/settings'
      }
    ],
    false: []
  }

  const [open, setOpen] = useState(false)

  const buttons = user ? (
    <Button color='primary' className='w-full md:w-fit' onClick={() => logout()}>
      {t('auth.logout')}
    </Button>
  ) : (
    <>
      <Link href='/auth/signin'>
        <Button color='primary' className='w-full md:w-fit'>
          {t('auth.sign_in.title')}
        </Button>
      </Link>

      <Link href='/auth/signup'>
        <Button color='primary' className='w-full md:w-fit'>
          {t('auth.sign_up.title')}
        </Button>
      </Link>
    </>
  )

  return (
    <>
      <header className='bg-surface-primary/50 border-b border-outline select-none fixed top-0 z-20 h-16 w-full backdrop-blur-sm'>
        <Container className='h-full'>
          <Row className='h-full justify-between gap-2'>
            <Logo />

            <Row className='gap-3'>
              <Row className='hidden md:flex gap-4'>
                {links.false.length > 0 && (
                  <>
                    <Row className='flex-row-reverse gap-2'>
                      {links[user ? 'true' : 'false'].map((link, index) => (
                        <SelectableLink label={link.label} url={link.url} key={index} />
                      ))}
                    </Row>

                    <Divider className='h-8' thickness='thick' orientation='vertical' />
                  </>
                )}

                <Row className='gap-2'>{buttons}</Row>
              </Row>

              <Button
                className='md:hidden'
                aria-label={open ? 'Close menu' : 'Open menu'}
                shape='circle'
                color='primary'
                onClick={() => setOpen((value) => !value)}
              >
                {open ? <X /> : <MenuIcon />}
              </Button>
            </Row>
          </Row>
        </Container>
      </header>

      <Transition show={open}>
        <div
          className={cn(
            'fixed inset-x-0 top-16 bottom-0 z-10',
            'overflow-y-auto',
            'bg-surface-primary',
            'transition-all duration-300 ease-out',
            'data-closed:-translate-y-2 data-closed:opacity-0 data-closed:ease-in'
          )}
        >
          <Section>
            <Column className='gap-4'>
              <Container>
                <Column className='gap-2'>
                  {links[user ? 'true' : 'false'].map((link, index) => (
                    <SelectableLink box label={link.label} url={link.url} key={index} />
                  ))}
                </Column>
              </Container>

              <Divider />

              <Container>
                <Column className='gap-2'>{buttons}</Column>
              </Container>
            </Column>
          </Section>
        </div>
      </Transition>

      <div className='h-16' />
    </>
  )
}

Header.displayName = 'Header'

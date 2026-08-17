'use client'

import { Button, Column, Divider, Section } from '@trash-kit/ui'
import type React from 'react'
import { SettingsLinksSection } from './links-section'
import { Avatar } from '../user/avatar'
import { useLogout } from '@/lib/hooks/use-logout'
import { useTranslations } from 'next-intl'

export const SidebarSection: React.FC = (): React.ReactNode => {
  const logout = useLogout()

  const t = useTranslations()

  return (
    <Column className='gap-4'>
      <Section divider={false} title={<Avatar showUsername={true} className='size-24' />}>
        <SettingsLinksSection />
      </Section>

      <Divider thickness='thick' />

      <Button className='w-full' onClick={() => logout()}>
        {t('auth.logout')}
      </Button>
    </Column>
  )
}

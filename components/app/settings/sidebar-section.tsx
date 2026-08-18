'use client'

import { Column, Section } from '@trash-kit/ui'
import type React from 'react'
import { SettingsLinksSection } from './links-section'
import { Avatar } from '../user/avatar'

export const SidebarSection: React.FC = (): React.ReactNode => {
  return (
    <Column className='gap-4'>
      <Section divider={false} title={<Avatar showUsername={true} className='size-24' />}>
        <SettingsLinksSection />
      </Section>
    </Column>
  )
}

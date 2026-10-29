'use client'

import type React from 'react'

import { SettingsLinksSection } from './links-section'
import { Avatar } from '../user/avatar'

import { Column, Section } from '@trash-kit/ui'

type SidebarSectionProps = {
  token: string
}

export const SidebarSection: React.FC<SidebarSectionProps> = ({
  token
}: SidebarSectionProps): React.ReactNode => {
  return (
    <Column className='gap-4'>
      <Section divider={false} title={<Avatar showUsername token={token} className='size-24' />}>
        <SettingsLinksSection />
      </Section>
    </Column>
  )
}

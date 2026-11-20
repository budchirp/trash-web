'use client'

import type React from 'react'

import { SelectableLinks } from '@/components/link'
import { Column } from '@trash-kit/ui'
import { getSecurityLinks, getSettingsLinks } from '@/lib/link'
import { useTranslations } from 'next-intl'

export const SettingsLinksSection: React.FC = (): React.ReactNode => {
  const t = useTranslations()

  return (
    <Column className='w-full gap-2'>
      <SelectableLinks box links={getSettingsLinks(t)} />
      <Column className='w-full border-l border-outline pl-4'>
        <SelectableLinks box links={getSecurityLinks(t)} />
      </Column>
    </Column>
  )
}

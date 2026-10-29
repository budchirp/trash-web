'use client'

import type React from 'react'

import { SelectableLinks } from '@/components/link'
import { getDevelopersLinks } from '@/lib/link'
import { useTranslations } from 'next-intl'

import { Section } from '@trash-kit/ui'

export const DevelopersSidebarSection: React.FC = (): React.ReactNode => {
  const t = useTranslations()

  return (
    <Section divider={false} title={t('developers.title')}>
      <SelectableLinks box links={getDevelopersLinks(t)} />
    </Section>
  )
}

'use client'

import type React from 'react'

import { SelectableLinks } from '@/components/link'
import { getSettingsLinks } from '@/lib/link'
import { useTranslations } from 'next-intl'

export const SettingsLinksSection: React.FC = (): React.ReactNode => {
  const t = useTranslations()

  return <SelectableLinks box links={getSettingsLinks(t)} />
}

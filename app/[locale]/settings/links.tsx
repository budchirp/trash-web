'use client'

import type React from 'react'

import { SelectableLink } from '@/components/link'
import { useTranslations } from 'next-intl'

import { Column } from '@trash-kit/ui'

export const Links: React.FC = (): React.ReactNode => {
  const t = useTranslations('settings')

  const settings: { url: string; label: any }[] = [
    {
      url: '/settings/account',
      label: t('account.title')
    },
    {
      url: '/settings/security',
      label: t('security.title')
    }
  ]

  return (
    <Column>
      {settings.map((setting, index) => (
        <SelectableLink label={setting.label} url={setting.url} key={index} />
      ))}
    </Column>
  )
}

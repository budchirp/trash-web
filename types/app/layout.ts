import type React from 'react'

import type { Locale } from 'next-intl'

export type LayoutProps = {
  children: React.ReactNode
}

export type DynamicLayoutProps = {
  params: Promise<{
    locale: Locale
    [key: string]: string
  }>
} & LayoutProps

import { getRequestConfig } from 'next-intl/server'
import { routing } from '@/lib/i18n/routing'
import { locale } from 'next/root-params'
import { hasLocale } from 'next-intl'

import en from '@/messages/en.json'

const messagesByLocale = { en } as const

export default getRequestConfig(async ({ locale: requested }) => {
  const value = requested ?? (await locale().catch(() => null))
  const localeValue = hasLocale(routing.locales, value) ? value : routing.defaultLocale

  return {
    locale: localeValue,
    messages: messagesByLocale[localeValue]
  }
})

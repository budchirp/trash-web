import { getRequestConfig } from 'next-intl/server'
import { hasLocale } from 'next-intl'
import { routing } from '@/lib/i18n/routing'
import enMessages from '@/messages/en.json'

const messagesByLocale: Record<string, any> = {
  en: enMessages
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale

  return {
    locale,
    messages: messagesByLocale[locale] ?? enMessages
  }
})


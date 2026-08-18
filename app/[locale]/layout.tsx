import type React from 'react'

import { UserContextProvider } from '@/context/user'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { Header } from '@/components/ui/header'
import { Footer } from '@/components/ui/footer'
import { routing } from '@/lib/i18n/routing'
import { CONSTANTS } from '@/lib/constants'
import { getCurrentSession } from '@/lib/auth'
import { AccountSession } from '@/lib/account-session'
import { getCookies } from 'next-client-cookies/server'
import { notFound } from 'next/navigation'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import enMessages from '@/messages/en.json'

import type { Metadata } from 'next'
import type { DynamicLayoutProps } from '@/types/app/layout'

const Layout: React.FC<DynamicLayoutProps> = async ({
  children,
  params
}: DynamicLayoutProps): Promise<React.ReactNode> => {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale || 'en')) {
    notFound()
  }

  setRequestLocale(locale as any)

  const messages = (await getMessages().catch(() => enMessages)) || enMessages
  const session = await getCurrentSession(locale)
  const accounts = session
    ? await new AccountSession(await getCookies()).getAllAccounts(locale, {
        token: session.jwt,
        user: session.user
      })
    : []

  return (
    <NextIntlClientProvider messages={messages}>
      <UserContextProvider initialUser={session?.user ?? null}>
        <Header accounts={accounts} />

        <main id='main' className='min-h-screen_'>
          {children}
        </main>

        <Footer />
      </UserContextProvider>
    </NextIntlClientProvider>
  )
}

export const metadata: Metadata = {
  title: CONSTANTS.APP_NAME
}

export const generateStaticParams = async (): Promise<{ locale: string }[]> => {
  return routing.locales.map((locale) => ({ locale }))
}

export default Layout

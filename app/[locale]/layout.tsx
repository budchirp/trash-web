import type React from 'react'

import { CookiesProvider, getCookies } from 'next-client-cookies/server'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { UserContextProvider } from '@/context/user'
import { getSession } from '@/lib/auth'
import { list } from '@/lib/session'
import { Google_Sans } from 'next/font/google'
import { getMessages } from 'next-intl/server'
import { Header } from '@/components/ui/header'
import { Footer } from '@/components/ui/footer'
import { routing } from '@/lib/i18n/routing'
import { CONSTANTS } from '@/lib/constants'
import { locale } from 'next/root-params'
import { notFound } from 'next/navigation'

import { cn, Container, ToastProvider } from '@trash-kit/ui'

import type { Metadata } from 'next'
import type { LayoutProps } from '@/types/app/layout'

import '@/app/globals.css'

import en from '@/messages/en.json'

const main = Google_Sans({
  subsets: ['latin'],
  variable: '--font-main'
})

const Layout: React.FC<LayoutProps> = async ({
  children
}: LayoutProps): Promise<React.ReactNode> => {
  const currentLocale = await locale()
  if (!hasLocale(routing.locales, currentLocale || 'en')) {
    notFound()
  }

  const messages = (await getMessages().catch(() => en)) || en
  const session = await getSession()
  const accounts = session ? await list(await getCookies(), session) : []

  return (
    <html lang={currentLocale}>
      <body className={cn('size-full relative', main.variable)}>
        <div className='absolute z-0 inset-0 overflow-hidden'>
          <Container className='absolute inset-0'>
            <div className='absolute top-[10%] left-[15%] size-96 opacity-25 bg-accent-500 rounded-full blur-[128px]' />
            <div className='absolute top-[35%] right-[20%] size-96 opacity-25 bg-accent-600 rounded-full blur-[128px]' />
            <div className='absolute top-[50%] left-[25%] size-96 opacity-25 bg-accent-800 rounded-full blur-[128px]' />
            <div className='absolute top-[75%] right-[10%] size-96 opacity-25 bg-accent-700 rounded-full blur-[128px]' />
          </Container>
        </div>

        <CookiesProvider>
          <ToastProvider />

          <div className='relative z-10 size-full'>
            <NextIntlClientProvider messages={messages}>
              <UserContextProvider initialUser={session?.user ?? null}>
                <Header accounts={accounts} />

                <main id='main' className='min-h-screen'>
                  {children}
                </main>

                <Footer />
              </UserContextProvider>
            </NextIntlClientProvider>
          </div>
        </CookiesProvider>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  title: CONSTANTS.APP_NAME,
  description: CONSTANTS.APP_NAME
}

export const generateStaticParams = async (): Promise<{ locale: string }[]> => {
  return routing.locales.map((l) => ({ locale: l }))
}

export default Layout

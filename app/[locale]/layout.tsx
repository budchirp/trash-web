import type React from 'react'

import { UserContextProvider } from '@/context/user'
import { setRequestLocale } from 'next-intl/server'
import { Header } from '@/components/ui/header'
import { Footer } from '@/components/ui/footer'
import { ServiceErrorScreen } from '@/components/service-error-screen'
import { routing } from '@/lib/i18n/routing'
import { CONSTANTS } from '@/lib/constants'
import { getCurrentSession } from '@/lib/auth'
import { notFound } from 'next/navigation'
import { hasLocale } from 'next-intl'

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

  const sessionResult = await getCurrentSession(locale)
  if (sessionResult.error) {
    return <ServiceErrorScreen response={sessionResult.error} />
  }

  return (
    <UserContextProvider initialUser={sessionResult.session?.user ?? null}>
      <Header />

      <main id='main' className='min-h-screen_'>
        {children}
      </main>

      <Footer />
    </UserContextProvider>
  )
}

export const metadata: Metadata = {
  title: CONSTANTS.APP_NAME
}

export const generateStaticParams = async (): Promise<{ locale: string }[]> => {
  return routing.locales.map((locale) => ({ locale }))
}

export default Layout

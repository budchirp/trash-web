import type React from 'react'

import { CenteredPage } from '@/components/vertical-page'
import { getCookies } from 'next-client-cookies/server'
import { setRequestLocale } from 'next-intl/server'
import { Header } from '@/components/ui/header'
import { Footer } from '@/components/ui/footer'
import { AuthProvider } from '@trash-kit/auth'
import { routing } from '@/lib/i18n/routing'
import { CONSTANTS } from '@/lib/constants'
import { notFound } from 'next/navigation'
import { hasLocale } from 'next-intl'
import { trash } from '@/lib/trash'

import type { Metadata } from 'next'
import type { DynamicLayoutProps } from '@/types/layout'

const Layout: React.FC<DynamicLayoutProps> = async ({
  children,
  params
}: DynamicLayoutProps): Promise<React.ReactNode> => {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  setRequestLocale(locale)

  const cookies = await getCookies()
  const token = cookies.get(CONSTANTS.COOKIES.TOKEN)

  return (
    <AuthProvider
      trash={trash}
      token={token}
      locale={locale}
      ErrorComponent={({ error }) => (
        <CenteredPage title={error.status.toString()} items={error.message.split(' ')} />
      )}
    >
      <Header />

      <main id='main' className='min-h-screen_'>
        {children}
      </main>

      <Footer />
    </AuthProvider>
  )
}

export const metadata: Metadata = {
  title: CONSTANTS.APP_NAME
}

export const generateStaticParams = async (): Promise<{ locale: string }[]> => {
  return routing.locales.map((locale) => ({ locale }))
}

export default Layout

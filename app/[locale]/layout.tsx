import type React from 'react'

import { CenteredPage } from '@/components/vertical-page'
import { getCookies } from 'next-client-cookies/server'
import { UserContextProvider } from '@/context/user'
import { setRequestLocale } from 'next-intl/server'
import { Header } from '@/components/ui/header'
import { Footer } from '@/components/ui/footer'
import { routing } from '@/lib/i18n/routing'
import { UserService } from '@/service/user'
import { CONSTANTS } from '@/lib/constants'
import { notFound } from 'next/navigation'
import { hasLocale } from 'next-intl'

import type { Metadata } from 'next'
import type { DynamicLayoutProps } from '@/types/app/layout'
import type { User } from '@/types/api/user'

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
  const jwt = cookies.get(CONSTANTS.COOKIES.TOKEN)

  let user: User | null = null

  if (jwt) {
    const response = await UserService.get({ jwt })
    if (response.error) {
      return <CenteredPage title={response.status.toString()} items={response.message.split(' ')} />
    }

    user = response.data
  }

  return (
    <UserContextProvider initialUser={user}>
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

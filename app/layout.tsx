import type React from 'react'

import { CookiesProvider } from 'next-client-cookies/server'
import { NextIntlClientProvider } from 'next-intl'
import { Google_Sans } from 'next/font/google'

import { cn, Container, ToastProvider } from '@trash-kit/ui'

import type { Metadata } from 'next'
import type { LayoutProps } from '@/types/app/layout'

import '@/app/globals.css'

const googleSans = Google_Sans({
  subsets: ['latin'],
  variable: '--font-main'
})

const Layout: React.FC<LayoutProps> = ({ children }: LayoutProps): React.ReactNode => {
  return (
    <html lang='en'>
      <body className={cn('size-full relative', googleSans.variable)}>
        <CookiesProvider>
          <ToastProvider />

          <div className='relative z-10 size-full'>
            <NextIntlClientProvider>{children}</NextIntlClientProvider>
          </div>
        </CookiesProvider>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  title: 'Trash Core',
  description: 'Trash Core'
}

export default Layout

import type { Locale } from 'next-intl'

export type DynamicPageProps = {
  params: Promise<{
    [key: string]: string
    locale: Locale
  }>
  searchParams: Promise<{ [key: string]: string | null | undefined }>
}

import type { Locale } from 'next-intl'

type Params = {
  [key: string]: string
}

type SearchParams = {
  [key: string]: string | undefined
}

export type DynamicPageProps = {
  params: Promise<
    Params & {
      locale: Locale
    }
  >
  searchParams: Promise<SearchParams>
}

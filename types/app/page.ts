export type Params = {
  [key: string]: string
}

export type SearchParams = {
  [key: string]: string | undefined
}

export type DynamicPageProps = {
  params: Promise<
    Params
  >
  searchParams: Promise<SearchParams>
}

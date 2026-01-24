export type Headers = {
  locale?: string
}

export type AuthenticatedHeaders = Headers & {
  jwt: string
}

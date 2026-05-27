export const CONSTANTS = {
  APP_NAME: 'Trash',

  API_URL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080',

  COOKIES: {
    TOKEN: 'token',
    TOKENS: 'tokens',
    TOKEN_DURATION: 30 // days
  }
}

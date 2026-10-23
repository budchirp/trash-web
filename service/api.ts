import { CONSTANTS } from '@/lib/constants'
import { routing } from '@/lib/i18n/routing'

export type ApiServiceResponse<T = null> =
  | { error: false; message: string; data: T }
  | {
      error: true
      message: string
      status: number
      code: string | null
      details: Record<string, string> | null
      data: null
    }

type ApiRequestOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE'
  path: string
  token?: string
  body?: object | FormData
  empty?: boolean
}

export const request = async <T = null>({
  method = 'GET',
  path,
  token,
  body,
  empty = false
}: ApiRequestOptions): Promise<ApiServiceResponse<T>> => {
  try {
    const response = await fetch(`${CONSTANTS.API_URL}${path}`, {
      method,
      headers: {
        ...(body && !(body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        'Accept-Language': routing.defaultLocale
      },
      body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
      cache: 'no-store'
    })

    const json = (await response.json().catch(() => null)) as {
      error?: boolean
      code?: string
      message?: string
      data?: T
    } | null

    if (response.ok && !json?.error) {
      if (!empty && json?.data === undefined) {
        return {
          error: true,
          message: json?.message || 'Missing response data',
          status: response.status,
          code: json?.code ?? null,
          details: null,
          data: null
        }
      }

      return {
        error: false,
        message: json?.message || '',
        data: empty ? (null as T) : (json?.data as T)
      }
    }

    const data = json?.data
    const details =
      json?.code === 'validation_failed' &&
      typeof data === 'object' &&
      data !== null &&
      !Array.isArray(data) &&
      Object.values(data).every((value) => typeof value === 'string')
        ? (data as Record<string, string>)
        : null

    return {
      error: true,
      message: json?.message || 'Request failed',
      status: response.status,
      code: json?.code ?? null,
      details,
      data: null
    }
  } catch {
    return {
      error: true,
      message: "We couldn't reach the server. Check your connection and try again.",
      status: 500,
      code: null,
      details: null,
      data: null
    }
  }
}

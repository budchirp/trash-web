import { CONSTANTS } from '@/lib/constants'

import type { Headers } from '@/types/api'

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

type ApiResponse<T> = {
  error?: boolean
  code?: string
  message?: string
  data?: T
}

type RequestHeaders = Headers & {
  jwt?: string
}

type ApiRequestOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE'
  path: string
  headers?: RequestHeaders
  body?: object | FormData
  empty?: boolean
}

const requestHeaders = (headers?: RequestHeaders, body?: object | FormData): HeadersInit => ({
  ...(body && !(body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}),
  ...(headers?.jwt ? { Authorization: `Bearer ${headers.jwt}` } : {}),
  ...(headers?.locale ? { 'Accept-Language': headers.locale } : {})
})

const parseResponse = async <T>(response: Response): Promise<ApiResponse<T> | null> => {
  const text = await response.text()
  if (!text) return null

  return JSON.parse(text) as ApiResponse<T>
}

const parseErrorDetails = (data: unknown): Record<string, string> | null => {
  if (typeof data !== 'object' || data === null || Array.isArray(data)) return null

  const details: Record<string, string> = {}
  for (const [key, value] of Object.entries(data)) {
    if (typeof value !== 'string') return null

    details[key] = value
  }

  return details
}

const parseErrorResponse = <T>(json: ApiResponse<T> | null, status: number) => ({
  error: true as const,
  message: json?.message || 'Request failed',
  status,
  code: json?.code ?? null,
  details: json?.code === 'validation_failed' ? parseErrorDetails(json?.data) : null,
  data: null
})

export const apiRequest = async <T = null>({
  method = 'GET',
  path,
  headers,
  body,
  empty = false
}: ApiRequestOptions): Promise<ApiServiceResponse<T>> => {
  try {
    const response = await fetch(`${CONSTANTS.API_URL}${path}`, {
      method,
      headers: requestHeaders(headers, body),
      body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
      cache: 'no-store'
    })

    const json = await parseResponse<T>(response)

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

    return parseErrorResponse(json, response.status)
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

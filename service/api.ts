import { CONSTANTS } from '@/lib/constants'

import type { Headers } from '@/types/api'
import type { ServiceResponse } from '@trash-kit/core'

type ApiResponse<T> = {
  error?: boolean
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

export const apiRequest = async <T = null>({
  method = 'GET',
  path,
  headers,
  body,
  empty = false
}: ApiRequestOptions): Promise<ServiceResponse<T>> => {
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
          data: null
        }
      }

      return {
        error: false,
        message: json?.message || '',
        data: empty ? (null as T) : (json?.data as T)
      }
    }

    return {
      error: true,
      message: json?.message || response.statusText || 'Request failed',
      status: response.status,
      data: null
    }
  } catch {
    return {
      error: true,
      message: "We couldn't reach the server. Check your connection and try again.",
      status: 500,
      data: null
    }
  }
}

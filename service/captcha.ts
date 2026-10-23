import type { ApiServiceResponse } from '@/service/api'

export type CaptchaAction = 'signup' | 'signin'

export const CaptchaService = {
  async verify(token: string, action: CaptchaAction): Promise<ApiServiceResponse<null>> {
    try {
      const response = await fetch('/api/captcha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, action }),
        cache: 'no-store'
      })

      const result = (await response.json().catch(() => null)) as {
        error?: boolean
        message?: string
      } | null

      if (!response.ok || result?.error) {
        return {
          error: true,
          message: result?.message || 'Captcha verification failed',
          status: response.status,
          code: null,
          details: null,
          data: null
        }
      }

      return { error: false, message: result?.message || '', data: null }
    } catch {
      return {
        error: true,
        message: "We couldn't verify the captcha. Check your connection and try again.",
        status: 500,
        code: null,
        details: null,
        data: null
      }
    }
  }
}

export type CaptchaAction = 'signup' | 'signin'

type CaptchaResponse = {
  error: boolean
  message: string
  status?: number
}

export class CaptchaService {
  public static async verify(token: string, action: CaptchaAction): Promise<CaptchaResponse> {
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
          status: response.status
        }
      }

      return { error: false, message: result?.message || '' }
    } catch {
      return {
        error: true,
        message: "We couldn't verify the captcha. Check your connection and try again.",
        status: 500
      }
    }
  }
}

import { NextResponse } from 'next/server'
import z from 'zod'

const captchaRequestSchema = z.object({
  token: z.string().min(1).max(2048),
  action: z.enum(['signup', 'signin'])
})

type TurnstileVerificationResponse = {
  success?: boolean
  action?: string
}

const getClientIp = (request: Request): string | undefined => {
  const forwardedFor = request.headers.get('x-forwarded-for')
  return forwardedFor?.split(',')[0]?.trim() || undefined
}

export const POST = async (request: Request): Promise<NextResponse> => {
  let body: unknown

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: true, message: 'Invalid captcha request' }, { status: 400 })
  }

  const parsed = captchaRequestSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: true, message: 'Invalid captcha request' }, { status: 400 })
  }

  const secret = process.env.TURNSTILE_SECRET

  if (!secret) {
    return NextResponse.json(
      { error: true, message: 'Captcha verification failed' },
      { status: 403 }
    )
  }

  const verificationBody = new URLSearchParams({
    secret,
    response: parsed.data.token
  })
  const clientIp = getClientIp(request)
  if (clientIp) verificationBody.set('remoteip', clientIp)

  let verification: TurnstileVerificationResponse

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: verificationBody,
      signal: AbortSignal.timeout(10_000),
      cache: 'no-store'
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: true, message: 'Captcha verification failed' },
        { status: 403 }
      )
    }

    verification = (await response.json()) as TurnstileVerificationResponse
  } catch {
    return NextResponse.json(
      { error: true, message: 'Captcha verification failed' },
      { status: 403 }
    )
  }

  if (verification.success !== true || verification.action !== parsed.data.action) {
    return NextResponse.json(
      { error: true, message: 'Captcha verification failed' },
      { status: 403 }
    )
  }

  return NextResponse.json({ error: false, message: '' })
}

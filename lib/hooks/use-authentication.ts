'use client'

import { useRef } from 'react'
import { useCookies } from 'next-client-cookies'
import { useTranslations } from 'next-intl'
import { toast } from '@trash-kit/ui'
import { CaptchaService } from '@/service/captcha'
import { SessionService } from '@/service/session'
import { UserService } from '@/service/user'
import { save } from '@/lib/session'
import { withRedirect } from '@/lib/redirect'
import { LINKS } from '@/lib/link'
import type { TurnstileWidgetRef } from '@/components/turnstile'

export const useAuthentication = (redirectTo: string | null) => {
  const cookies = useCookies()
  const t = useTranslations('common')
  const turnstileRef = useRef<TurnstileWidgetRef>(null)

  const reportError = (message: string) => {
    turnstileRef.current?.reset()
    toast(t('error'), { description: message, color: 'danger' })
  }

  const verifyCaptcha = async (value: string, action: 'signin' | 'signup') => {
    const response = await CaptchaService.verify(value, action)
    if (response.error) reportError(response.message)
    return !response.error
  }

  const signIn = async (values: { email: string; password: string }) => {
    const response = await SessionService.create(values)
    if (response.error) {
      reportError(response.message)
      return false
    }
    const token = response.data.token
    const user = await UserService.get(token)
    if (user.error) {
      reportError(user.message)
      await SessionService.delete(null, token).catch(() => null)
      return false
    }
    save(cookies, token)
    window.location.replace(
      user.data.profile?.name?.trim()
        ? (redirectTo ?? LINKS.dashboard)
        : withRedirect(LINKS.onboarding, redirectTo)
    )
    return true
  }

  return { turnstileRef, reportError, verifyCaptcha, signIn }
}

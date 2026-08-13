'use client'

import type React from 'react'
import { forwardRef, useImperativeHandle, useRef } from 'react'
import { Turnstile, type BoundTurnstileObject } from 'react-turnstile'

import { CONSTANTS } from '@/lib/constants'

export type TurnstileWidgetRef = {
  reset: () => void
}

type TurnstileWidgetProps = {
  action: string
  onToken: (token: string) => void
  onExpired: () => void
}

export const TurnstileWidget = forwardRef<TurnstileWidgetRef, TurnstileWidgetProps>(
  ({ action, onToken, onExpired }: TurnstileWidgetProps, ref): React.ReactNode => {
    const boundTurnstileRef = useRef<BoundTurnstileObject | null>(null)

    useImperativeHandle(
      ref,
      () => ({
        reset: () => {
          boundTurnstileRef.current?.reset()
          onExpired()
        }
      }),
      [onExpired]
    )

    if (!CONSTANTS.TURNSTILE_SITEKEY) return null

    return (
      <Turnstile
        sitekey={CONSTANTS.TURNSTILE_SITEKEY}
        action={action}
        refreshExpired='manual'
        onVerify={(token, boundTurnstile) => {
          boundTurnstileRef.current = boundTurnstile
          onToken(token)
        }}
        onExpire={onExpired}
        onError={onExpired}
      />
    )
  }
)

TurnstileWidget.displayName = 'TurnstileWidget'

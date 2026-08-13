'use client'

import type React from 'react'

import { signInSchema, type SignInValues } from '@/service/session/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLocale, useTranslations } from 'use-intl'
import { SessionService } from '@/service/session'
import { useCookies } from 'next-client-cookies'
import { useForm } from 'react-hook-form'
import { Link } from '@/lib/i18n/routing'
import { UserService } from '@/service/user'
import { AccountSession } from '@/lib/account-session'
import { CaptchaService } from '@/service/captcha'
import { TurnstileWidget, type TurnstileWidgetRef } from '@/components/turnstile'

import {
  Button,
  Column,
  Container,
  Field,
  Heading,
  Input,
  Label,
  Row,
  Section,
  toast
} from '@trash-kit/ui'

import { AccountSwitcher } from '@/components/app/settings/account/account-switcher'

import type { SavedAccount } from '@/types/app/account'
import { useRef } from 'react'

type SignInClientPageProps = {
  redirectTo: string | null
  accounts: SavedAccount[]
  token: string | null
}

export const SignInClientPage: React.FC<SignInClientPageProps> = ({
  redirectTo,
  accounts,
  token
}: SignInClientPageProps): React.ReactNode => {
  const locale = useLocale()
  const cookies = useCookies()

  const t = useTranslations('auth')
  const t_common = useTranslations('common')

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema)
  })

  const session = new AccountSession(cookies)
  const turnstileRef = useRef<TurnstileWidgetRef>(null)

  const onSubmit = async (values: SignInValues) => {
    const captcha = await CaptchaService.verify(values.captcha, 'signin')
    turnstileRef.current?.reset()

    if (captcha.error) {
      toast(captcha.message || t_common('captcha_failed'))
      return
    }

    const payload = {
      email: values.email,
      password: values.password
    }

    const response = await SessionService.create(payload, { locale })
    if (response.error) {
      toast(response.message)
      return
    }

    const jwt = response.data.token

    const user = await UserService.get({ jwt, locale })
    if (user.error) {
      toast(user.message)
      return
    }

    session.set(jwt)
    session.add(jwt)

    if (!user.data?.profile?.name?.trim()) {
      const query = redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''
      window.location.replace(`/${locale}/onboarding${query}`)
      return
    }

    window.location.replace(redirectTo ?? `/${locale}/dashboard`)
  }

  return (
    <Container className='max-w-lg!'>
      {token && accounts.length > 0 && (
        <AccountSwitcher
          accounts={accounts}
          token={token}
          redirectTo={redirectTo}
          showUseAnother={false}
        />
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Section
          title={t('sign_in.title')}
          description={
            <Link
              href={
                redirectTo
                  ? `/auth/signup?redirectTo=${encodeURIComponent(redirectTo)}`
                  : '/auth/signup'
              }
            >
              <Heading className='text-content-tertiary' size='h4'>
                {t('sign_in.sign_up_link')}
              </Heading>
            </Link>
          }
        >
          <Column className='gap-4'>
            <Column className='gap-2'>
              <Field name='email' error={errors.email?.message}>
                <Label>{t('form.email')}:</Label>

                <Input
                  placeholder={t_common('enter_field', { field: t('form.email') })}
                  type='email'
                  {...register('email')}
                />
              </Field>

              <Field name='password' error={errors.password?.message}>
                <Label>{t('form.password')}:</Label>

                <Input
                  placeholder={t_common('enter_field', { field: t('form.password') })}
                  type='password'
                  {...register('password')}
                />
              </Field>
            </Column>

            <Field name='captcha' error={errors.captcha?.message}>
              <input type='hidden' {...register('captcha')} />
              <TurnstileWidget
                ref={turnstileRef}
                action='signin'
                onToken={(value) => setValue('captcha', value, { shouldValidate: true })}
                onExpired={() => setValue('captcha', '', { shouldValidate: false })}
              />
            </Field>

            <Row className='w-full justify-end'>
              <Button disabled={isSubmitting} type='submit' loading={isSubmitting}>
                {isSubmitting ? t_common('loading') : t('sign_in.title')}
              </Button>
            </Row>
          </Column>
        </Section>
      </form>
    </Container>
  )
}

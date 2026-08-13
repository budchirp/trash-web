'use client'

import type React from 'react'

import { signUpSchema, type SignUpValues } from '@/service/user/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLocale, useTranslations } from 'use-intl'
import { UserService } from '@/service/user'
import { useForm } from 'react-hook-form'
import { SessionService } from '@/service/session'
import { useCookies } from 'next-client-cookies'
import { Link } from '@/lib/i18n/routing'
import { AccountSession } from '@/lib/account-session'
import { CaptchaService } from '@/service/captcha'
import { TurnstileWidget, type TurnstileWidgetRef } from '@/components/turnstile'
import { getRedirectQuery, getSignInPath } from '@/lib/redirects'
import { handle } from '@/lib/handle-service'
import { useRef } from 'react'

import {
  Button,
  Checkbox,
  Column,
  Container,
  Field,
  Heading,
  Input,
  Label,
  Row,
  Section,
  Text
} from '@trash-kit/ui'

type SignUpClientPageProps = {
  redirectTo: string | null
}

export const SignUpClientPage: React.FC<SignUpClientPageProps> = ({
  redirectTo
}: SignUpClientPageProps): React.ReactNode => {
  const locale = useLocale()

  const t = useTranslations('auth')
  const t_common = useTranslations('common')

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema)
  })

  const cookies = useCookies()
  const session = new AccountSession(cookies)
  const turnstileRef = useRef<TurnstileWidgetRef>(null)

  const onSubmit = async (values: SignUpValues) => {
    const captcha = await CaptchaService.verify(values.captcha, 'signup')
    if (handle(captcha)) {
      turnstileRef.current?.reset()
      return
    }

    const payload = {
      email: values.email,
      username: values.username,
      password: values.password
    }

    const user = await UserService.create(payload, { locale })
    if (handle(user)) {
      turnstileRef.current?.reset()
      return
    }

    const response = await SessionService.create(
      { email: values.email, password: values.password },
      { locale }
    )

    if (handle(response)) {
      turnstileRef.current?.reset()
      return
    }

    session.set(response.data.token)
    session.add(response.data.token)

    window.location.replace(`/${locale}/onboarding${getRedirectQuery(redirectTo)}`)
  }

  return (
    <Container className='max-w-lg!'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Section
          title={t('sign_up.title')}
          description={
            <Link href={getSignInPath(redirectTo)}>
              <Heading className='text-content-tertiary' size='h4'>
                {t('sign_up.sign_in_link')}
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

              <Field name='username' error={errors.username?.message}>
                <Label>{t('form.username')}:</Label>

                <Input
                  placeholder={t_common('enter_field', { field: t('form.username') })}
                  type='text'
                  {...register('username')}
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

            <Field name='accept_terms' error={errors.accept_terms?.message}>
              <Checkbox {...register('accept_terms')}>
                <Text>
                  {t.rich('sign_up.accept_terms', {
                    terms: () => (
                      <Link href='/help/legal/terms-of-service'>{t('sign_up.terms')}</Link>
                    ),
                    privacy: () => (
                      <Link href='/help/legal/privacy-policy'>{t('sign_up.privacy')}</Link>
                    )
                  })}
                </Text>
              </Checkbox>
            </Field>

            <Field name='captcha' error={errors.captcha?.message}>
              <input type='hidden' {...register('captcha')} />
              <TurnstileWidget
                ref={turnstileRef}
                action='signup'
                onToken={(value) => setValue('captcha', value, { shouldValidate: true })}
                onExpired={() => setValue('captcha', '', { shouldValidate: false })}
              />
            </Field>

            <Row className='w-full justify-end'>
              <Button disabled={isSubmitting} type='submit' loading={isSubmitting}>
                {isSubmitting ? t_common('loading') : t('sign_up.title')}
              </Button>
            </Row>
          </Column>
        </Section>
      </form>
    </Container>
  )
}

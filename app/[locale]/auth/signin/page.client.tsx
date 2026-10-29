'use client'

import type React from 'react'

import { signInSchema, type SignInValues } from '@/service/session/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { Link } from '@/lib/i18n/navigation'
import { TurnstileWidget } from '@/components/turnstile'
import { useAuthentication } from '@/lib/hooks/use-authentication'
import { CredentialsFields } from '@/components/app/auth/credentials-fields'
import { withRedirect } from '@/lib/redirect'
import { LINKS } from '@/lib/link'

import {
  Button,
  Column,
  Container,
  Field,
  Heading,
  Row,
  Section
} from '@trash-kit/ui'

import { AccountSwitcher } from '@/components/app/settings/account/account-switcher'

import type { SavedAccount } from '@/types/app/account'

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
  const { turnstileRef, verifyCaptcha, signIn } = useAuthentication(redirectTo)

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

  const onSubmit = async (values: SignInValues) => {
    if (!(await verifyCaptcha(values.captcha, 'signin'))) return
    await signIn({ email: values.email, password: values.password })
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
            <Link href={withRedirect(LINKS.auth.signUp, redirectTo)}>
              <Heading className='text-content-tertiary' size='h4'>
                {t('sign_in.sign_up_link')}
              </Heading>
            </Link>
          }
        >
          <Column className='gap-4'>
            <CredentialsFields
              disabled={isSubmitting}
              fields={[
                { name: 'email', registration: register('email'), error: errors.email?.message },
                { name: 'password', registration: register('password'), error: errors.password?.message }
              ]}
            />

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

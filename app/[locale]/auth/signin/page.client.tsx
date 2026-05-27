'use client'

import type React from 'react'

import { newSessionSchema, type NewSessionValues } from '@/service/session/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLocale, useTranslations } from 'use-intl'
import { SessionService } from '@/service/session'
import { useCookies } from 'next-client-cookies'
import { useForm } from 'react-hook-form'
import { Link } from '@/lib/i18n/routing'
import { UserService } from '@/service/user'
import { AccountSession } from '@/lib/account-session'

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

  const t = useTranslations('auth')
  const t_common = useTranslations('common')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<NewSessionValues>({
    resolver: zodResolver(newSessionSchema)
  })

  const cookies = useCookies()
  const accountSession = new AccountSession(cookies)

  const onSubmit = async (values: NewSessionValues) => {
    const session = await SessionService.create(values, { locale })
    if (session.error) {
      toast(session.message)
      return
    }

    const jwt = session.data.token

    const user = await UserService.get({ jwt, locale })
    if (user.error) {
      toast(user.message)
      return
    }

    accountSession.set(jwt)
    accountSession.add(jwt)

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
              <Heading className='text-tertiary' size='h4'>
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

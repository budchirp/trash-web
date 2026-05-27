'use client'

import type React from 'react'

import { newUserSchema, type NewUserValues } from '@/service/user/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLocale, useTranslations } from 'use-intl'
import { UserService } from '@/service/user'
import { useForm } from 'react-hook-form'
import { SessionService } from '@/service/session'
import { useCookies } from 'next-client-cookies'
import { Link } from '@/lib/i18n/routing'
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
    formState: { errors, isSubmitting }
  } = useForm<NewUserValues>({
    resolver: zodResolver(newUserSchema)
  })

  const cookies = useCookies()
  const accountSession = new AccountSession(cookies)

  const onSubmit = async (values: NewUserValues) => {
    const user = await UserService.create(values, { locale })
    if (user.error) {
      toast(user.message)
      return
    }

    const session = await SessionService.create(
      { email: values.email, password: values.password },
      { locale }
    )

    if (session.error) {
      toast(session.message)
      return
    }

    accountSession.set(session.data.token)
    accountSession.add(session.data.token)

    const query = redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''
    window.location.replace(`/${locale}/onboarding${query}`)
  }

  const signInHref = redirectTo
    ? `/auth/signin?redirectTo=${encodeURIComponent(redirectTo)}`
    : '/auth/signin'

  return (
    <Container className='max-w-lg!'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Section
          title={t('sign_up.title')}
          description={
            <Link href={signInHref}>
              <Heading className='text-tertiary' size='h4'>
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

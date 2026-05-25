'use client'

import type React from 'react'
import { useState } from 'react'

import { newSessionSchema, type NewSessionValues } from '@/service/session/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLocale, useTranslations } from 'use-intl'
import { SessionService } from '@/service/session'
import { useCookies } from 'next-client-cookies'
import { CONSTANTS } from '@/lib/constants'
import { useForm } from 'react-hook-form'
import { Link } from '@/lib/i18n/routing'
import { UserService } from '@/service/user'

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

import type { User } from '@/types/api/user'

type SignInClientPageProps = {
  redirectTo: string | null
  currentUser: User | null
}

export const SignInClientPage: React.FC<SignInClientPageProps> = ({
  redirectTo,
  currentUser
}: SignInClientPageProps): React.ReactNode => {
  const locale = useLocale()

  const t = useTranslations('auth')
  const t_common = useTranslations('common')

  const [useAnotherAccount, setUseAnotherAccount] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<NewSessionValues>({
    resolver: zodResolver(newSessionSchema)
  })

  const cookies = useCookies()

  const onSubmit = async (values: NewSessionValues) => {
    const session = await SessionService.create(values, { locale })
    if (session.error) {
      toast(session.message)
      return
    }

    cookies.set(CONSTANTS.COOKIES.TOKEN, session.data.token, {
      path: '/',
      sameSite: 'lax',
      expires: CONSTANTS.COOKIES.TOKEN_DURATION
    })

    const user = await UserService.get({ jwt: session.data.token, locale })
    if (user.error) {
      toast(user.message)
      return
    }

    if (!user.data?.profile?.name?.trim()) {
      const query = redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''
      window.location.replace(`/${locale}/onboarding${query}`)
      return
    }

    window.location.replace(redirectTo ?? `/${locale}/dashboard`)
  }

  const signUpHref = redirectTo
    ? `/auth/signup?redirectTo=${encodeURIComponent(redirectTo)}`
    : '/auth/signup'

  const continueWithCurrentUser = () => {
    if (!redirectTo || !currentUser) return

    if (!currentUser.profile?.name?.trim()) {
      window.location.replace(`/${locale}/onboarding?redirectTo=${encodeURIComponent(redirectTo)}`)
      return
    }

    window.location.replace(redirectTo)
  }

  if (redirectTo && currentUser && !useAnotherAccount) {
    return (
      <Container className='max-w-lg!'>
        <Section
          title={t('sign_in.choose_account')}
          description={
            <Link href={signUpHref}>
              <Heading className='text-tertiary' size='h4'>
                {t('sign_in.sign_up_link')}
              </Heading>
            </Link>
          }
        >
          <Column className='gap-4'>
            <Column className='gap-1'>
              <Heading size='h3'>{currentUser.profile?.name || currentUser.username}</Heading>
              <Heading className='text-tertiary' size='h4'>
                {currentUser.email}
              </Heading>
            </Column>

            <Row className='w-full justify-end gap-2'>
              <Button onClick={continueWithCurrentUser}>{t('sign_in.continue')}</Button>

              <Button
                onClick={() => {
                  cookies.remove(CONSTANTS.COOKIES.TOKEN, { path: '/' })
                  setUseAnotherAccount(true)
                }}
              >
                {t('sign_in.use_another')}
              </Button>
            </Row>
          </Column>
        </Section>
      </Container>
    )
  }

  return (
    <Container className='max-w-lg!'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Section
          title={t('sign_in.title')}
          description={
            <Link href={signUpHref}>
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

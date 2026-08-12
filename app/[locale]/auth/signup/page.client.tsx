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
  Text,
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
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema)
  })

  const cookies = useCookies()
  const session = new AccountSession(cookies)

  const onSubmit = async (values: SignUpValues) => {
    const payload = {
      email: values.email,
      username: values.username,
      password: values.password
    }

    const user = await UserService.create(payload, { locale })
    if (user.error) {
      toast(user.message)
      return
    }

    const response = await SessionService.create(
      { email: values.email, password: values.password },
      { locale }
    )

    if (response.error) {
      toast(response.message)
      return
    }

    session.set(response.data.token)
    session.add(response.data.token)

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

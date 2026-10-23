'use client'

import type React from 'react'

import { signUpSchema, type SignUpValues } from '@/service/user/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { UserService } from '@/service/user'
import { useForm } from 'react-hook-form'
import { SessionService } from '@/service/session'
import { useCookies } from 'next-client-cookies'
import { Link, useRouter } from '@/lib/i18n/navigation'
import { save } from '@/lib/session'
import { CaptchaService } from '@/service/captcha'
import { TurnstileWidget, type TurnstileWidgetRef } from '@/components/turnstile'
import { withRedirect } from '@/lib/redirect'
import { LINKS } from '@/lib/link'
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
  Text,
  toast
} from '@trash-kit/ui'

type SignUpClientPageProps = {
  redirectTo: string | null
}

export const SignUpClientPage: React.FC<SignUpClientPageProps> = ({
  redirectTo
}: SignUpClientPageProps): React.ReactNode => {
  const t = useTranslations('auth')
  const t_common = useTranslations('common')
  const router = useRouter()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema)
  })

  const cookies = useCookies()
  const turnstileRef = useRef<TurnstileWidgetRef>(null)

  const onSubmit = async (values: SignUpValues) => {
    const captcha = await CaptchaService.verify(values.captcha, 'signup')
    if (captcha.error) {
      turnstileRef.current?.reset()
      toast(t_common('error'), { description: captcha.message, color: 'danger' })
      return
    }

    const user = await UserService.create({
      email: values.email,
      username: values.username,
      password: values.password
    })
    if (user.error) {
      turnstileRef.current?.reset()
      toast(t_common('error'), { description: user.message, color: 'danger' })
      return
    }

    const response = await SessionService.create({ email: values.email, password: values.password })
    if (response.error) {
      turnstileRef.current?.reset()
      toast(t_common('error'), { description: response.message, color: 'danger' })
      router.replace(withRedirect(LINKS.auth.signIn, redirectTo))
      return
    }

    save(cookies, response.data.token)

    window.location.replace(withRedirect(LINKS.onboarding, redirectTo))
  }

  return (
    <Container className='max-w-lg!'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Section
          title={t('sign_up.title')}
          description={
            <Link href={withRedirect(LINKS.auth.signIn, redirectTo)}>
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
                    terms: () => <Link href={LINKS.help.terms}>{t('sign_up.terms')}</Link>,
                    privacy: () => <Link href={LINKS.help.privacy}>{t('sign_up.privacy')}</Link>
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

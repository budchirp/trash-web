'use client'

import type React from 'react'

import { signUpSchema, type SignUpValues } from '@/service/user/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { UserService } from '@/service/user'
import { useForm } from 'react-hook-form'
import { Link, useRouter } from '@/lib/i18n/navigation'
import { TurnstileWidget } from '@/components/turnstile'
import { useAuthentication } from '@/lib/hooks/use-authentication'
import { CredentialsFields } from '@/components/app/auth/credentials-fields'
import { withRedirect } from '@/lib/redirect'
import { LINKS } from '@/lib/link'

import {
  Button,
  Checkbox,
  Column,
  Container,
  Field,
  Heading,
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

  const { turnstileRef, verifyCaptcha, reportError, signIn } = useAuthentication(redirectTo)

  const onSubmit = async (values: SignUpValues) => {
    if (!(await verifyCaptcha(values.captcha, 'signup'))) return

    const user = await UserService.create({
      email: values.email,
      username: values.username,
      password: values.password
    })
    if (user.error) {
      reportError(user.message)
      return
    }

    if (!(await signIn({ email: values.email, password: values.password }))) {
      router.replace(withRedirect(LINKS.auth.signIn, redirectTo))
    }
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
            <CredentialsFields
              disabled={isSubmitting}
              fields={[
                { name: 'email', registration: register('email'), error: errors.email?.message },
                { name: 'username', registration: register('username'), error: errors.username?.message },
                { name: 'password', registration: register('password'), error: errors.password?.message }
              ]}
            />

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

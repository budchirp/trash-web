'use client'

import type React from 'react'

import { newSessionSchema, type NewSessionValues } from '@/service/session/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLocale, useTranslations } from 'use-intl'
import { SessionService } from '@/service/session'
import { useCookies } from 'next-client-cookies'
import { CONSTANTS } from '@/lib/constants'
import { useForm } from 'react-hook-form'
import { Link } from '@/lib/i18n/routing'

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

export const SignInClientPage: React.FC = (): React.ReactNode => {
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

  const onSubmit = async (values: NewSessionValues) => {
    const { error, message, data } = await SessionService.create(values, { locale })
    if (error) {
      toast(message)
    } else {
      cookies.set(CONSTANTS.COOKIES.TOKEN, data.token, {
        expires: CONSTANTS.COOKIES.TOKEN_DURATION
      })

      window.location.replace('/')
    }
  }

  return (
    <Container className='max-w-lg!'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Section
          title={t('sign_in.title')}
          description={
            <Link href='/auth/signup'>
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
                  type='text'
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
              <Button type='submit' loading={isSubmitting}>
                {isSubmitting ? t_common('loading') : t('sign_in.title')}
              </Button>
            </Row>
          </Column>
        </Section>
      </form>
    </Container>
  )
}

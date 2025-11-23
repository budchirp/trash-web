'use client'

import type React from 'react'

import { type NewSessionValues, newSessionSchema, SessionService } from '@trash-kit/auth'

import { zodResolver } from '@hookform/resolvers/zod'
import { useLocale, useTranslations } from 'use-intl'
import { useCookies } from 'next-client-cookies'
import { CONSTANTS } from '@/lib/constants'
import { useForm } from 'react-hook-form'
import { Link } from '@/lib/i18n/routing'
import { trash } from '@/lib/trash'

import { Button, Column, Container, Field, Heading, Input, Section, toast } from '@trash-kit/ui'

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
    const { error, message, data: token } = await SessionService.create(trash, values, { locale })
    if (error) {
      toast(message)
    } else {
      cookies.set(CONSTANTS.COOKIES.TOKEN, token)
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
          <Column className='gap-2'>
            <Field label={`${t('form.username')}:`} error={errors.username?.message}>
              <Input
                placeholder={t_common('enter_field', { field: t('form.username') })}
                type='text'
                {...register('username')}
              />
            </Field>

            <Field label={`${t('form.password')}:`} error={errors.password?.message}>
              <Input
                placeholder={t_common('enter_field', { field: t('form.password') })}
                type='password'
                {...register('password')}
              />
            </Field>
          </Column>

          <Button type='submit' loading={isSubmitting}>
            {isSubmitting ? t_common('loading') : t('sign_in.title')}
          </Button>
        </Section>
      </form>
    </Container>
  )
}

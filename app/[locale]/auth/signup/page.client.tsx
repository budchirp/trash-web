'use client'

import type React from 'react'

import { newUserSchema, type NewUserValues } from '@/service/user/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLocale, useTranslations } from 'use-intl'
import { UserService } from '@/service/user'
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

export const SignUpClientPage: React.FC = (): React.ReactNode => {
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

  const onSubmit = async (values: NewUserValues) => {
    const { error, message } = await UserService.create(values, { locale })
    if (error) {
      toast(message)
    } else {
      window.location.replace('/auth/signin')
    }
  }

  return (
    <Container className='max-w-lg!'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Section
          title='Sign up'
          description={
            <Link href='/auth/signin'>
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
                <Label>{t('sign_up.form.username')}:</Label>

                <Input
                  placeholder={t_common('enter_field', { field: t('sign_up.form.username') })}
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
              <Button type='submit' loading={isSubmitting}>
                {isSubmitting ? t_common('loading') : t('sign_up.title')}
              </Button>
            </Row>
          </Column>
        </Section>
      </form>
    </Container>
  )
}

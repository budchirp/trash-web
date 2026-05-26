import type React from 'react'

import { getTranslations } from 'next-intl/server'
import { Link } from '@/lib/i18n/routing'
import { _public } from '@/lib/auth'
import {
  AppWindow,
  ArrowRight,
  Blocks,
  CheckCircle2,
  Database,
  KeyRound,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  UserRound,
  Workflow
} from 'lucide-react'

import { Box, BoxContent, Button, Column, Container, Heading, Row, Text } from '@trash-kit/ui'

import type { DynamicPageProps } from '@/types/app/page'

const Page: React.FC<DynamicPageProps> = async ({
  params
}: DynamicPageProps): Promise<React.ReactNode> => {
  const { locale } = await params
  await _public(locale)

  const t = await getTranslations({
    locale
  })

  const stats = [
    {
      value: t('home.stats.profile.value'),
      label: t('home.stats.profile.label'),
      description: t('home.stats.profile.description')
    },
    {
      value: t('home.stats.apps.value'),
      label: t('home.stats.apps.label'),
      description: t('home.stats.apps.description')
    },
    {
      value: t('home.stats.permissions.value'),
      label: t('home.stats.permissions.label'),
      description: t('home.stats.permissions.description')
    },
    {
      value: t('home.stats.sessions.value'),
      label: t('home.stats.sessions.label'),
      description: t('home.stats.sessions.description')
    }
  ]

  const features = [
    {
      icon: <UserRound className='size-5' />,
      title: t('home.features.profile.title'),
      description: t('home.features.profile.description')
    },
    {
      icon: <ShieldCheck className='size-5' />,
      title: t('home.features.permissions.title'),
      description: t('home.features.permissions.description')
    },
    {
      icon: <KeyRound className='size-5' />,
      title: t('home.features.sessions.title'),
      description: t('home.features.sessions.description')
    },
    {
      icon: <Blocks className='size-5' />,
      title: t('home.features.connections.title'),
      description: t('home.features.connections.description')
    }
  ]

  const previewPermissions = [
    {
      label: t('permissions.user:read'),
      detail: t('home.preview.permissions.account'),
      status: t('home.preview.allowed')
    },
    {
      label: t('permissions.profile:update'),
      detail: t('home.preview.permissions.profile'),
      status: t('home.preview.review')
    },
    {
      label: t('permissions.session:read'),
      detail: t('home.preview.permissions.sessions'),
      status: t('home.preview.allowed')
    }
  ]

  const dataGroups = [
    {
      icon: <Database className='size-5' />,
      title: t('home.data.profile.title'),
      items: [
        t('home.data.profile.name'),
        t('home.data.profile.gender'),
        t('home.data.profile.picture')
      ]
    },
    {
      icon: <LockKeyhole className='size-5' />,
      title: t('home.data.security.title'),
      items: [
        t('home.data.security.sessions'),
        t('home.data.security.connections'),
        t('home.data.security.permissions')
      ]
    },
    {
      icon: <Workflow className='size-5' />,
      title: t('home.data.apps.title'),
      items: [t('home.data.apps.authorize'), t('home.data.apps.scopes'), t('home.data.apps.tokens')]
    }
  ]

  const flow = [
    {
      step: '01',
      title: t('home.flow.create.title'),
      description: t('home.flow.create.description')
    },
    {
      step: '02',
      title: t('home.flow.review.title'),
      description: t('home.flow.review.description')
    },
    {
      step: '03',
      title: t('home.flow.control.title'),
      description: t('home.flow.control.description')
    }
  ]

  return (
    <main>
      <section className='min-h-screen_ py-8 md:py-12'>
        <Container>
          <Column className='gap-8 md:gap-12'>
            <div className='grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]'>
              <Column className='gap-5'>
                <Row className='w-fit gap-2 rounded-full border border-outline bg-surface-secondary px-4 py-2'>
                  <Sparkles className='size-4 text-accent' />
                  <Text className='text-tertiary'>{t('home.eyebrow')}</Text>
                </Row>

                <Column className='gap-3'>
                  <Heading className='max-w-4xl text-5xl leading-none md:text-7xl' size='h1'>
                    {t('home.title')}
                  </Heading>
                  <Text className='max-w-2xl text-tertiary text-xl md:text-2xl'>
                    {t('home.description')}
                  </Text>
                </Column>

                <Row className='flex-col gap-3 sm:flex-row'>
                  <Link href='/auth/signup'>
                    <Button>
                      <Row className='gap-2'>
                        {t('home.primary_cta')}
                        <ArrowRight className='size-4' />
                      </Row>
                    </Button>
                  </Link>

                  <Link href='/auth/signin'>
                    <Button>{t('home.secondary_cta')}</Button>
                  </Link>
                </Row>
              </Column>

              <Box className='overflow-hidden bg-surface-secondary'>
                <BoxContent padding='md'>
                  <Column className='gap-4'>
                    <Row className='justify-between gap-4'>
                      <Column className='gap-1'>
                        <Text className='text-tertiary'>{t('home.preview.badge')}</Text>
                        <Heading size='h3'>{t('home.preview.title')}</Heading>
                        <Text className='text-tertiary'>{t('home.preview.description')}</Text>
                      </Column>

                      <div className='rounded-2xl border border-outline bg-surface-primary p-3'>
                        <AppWindow className='size-5 text-tertiary' />
                      </div>
                    </Row>

                    <Column className='gap-2'>
                      {previewPermissions.map((permission) => (
                        <Row
                          className='items-start justify-between gap-4 rounded-2xl border border-outline bg-surface-primary p-3'
                          key={permission.label}
                        >
                          <Column className='gap-1'>
                            <Text>{permission.label}</Text>
                            <Text className='text-tertiary'>{permission.detail}</Text>
                          </Column>
                          <Text className='text-tertiary'>{permission.status}</Text>
                        </Row>
                      ))}
                    </Column>

                    <Row className='justify-between border-outline border-t pt-4'>
                      <Text>{t('home.preview.connection')}</Text>
                      <CheckCircle2 className='size-5 text-accent' />
                    </Row>
                  </Column>
                </BoxContent>
              </Box>
            </div>

            <div className='grid border-outline border-y py-5 md:grid-cols-2 xl:grid-cols-4'>
              {stats.map((stat) => (
                <Column
                  className='gap-2 py-4 md:border-outline md:border-r md:px-5 md:last:border-r-0'
                  key={stat.label}
                >
                  <Heading size='h2'>{stat.value}</Heading>
                  <Column className='gap-1'>
                    <Text>{stat.label}</Text>
                    <Text className='text-tertiary'>{stat.description}</Text>
                  </Column>
                </Column>
              ))}
            </div>
          </Column>
        </Container>
      </section>

      <section className='border-outline border-t py-8 md:py-10'>
        <Container>
          <Column className='gap-5'>
            <Column className='gap-2'>
              <Text className='text-tertiary'>{t('home.features_eyebrow')}</Text>
              <Heading size='h2'>{t('home.features_title')}</Heading>
              <Text className='max-w-2xl text-tertiary text-lg'>
                {t('home.features_description')}
              </Text>
            </Column>

            <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-4'>
              {features.map((feature) => (
                <Box className='bg-surface-secondary' key={feature.title}>
                  <BoxContent>
                    <Column className='gap-3'>
                      <div className='w-fit rounded-2xl border border-outline bg-surface-primary p-3 text-tertiary'>
                        {feature.icon}
                      </div>
                      <Column className='gap-2'>
                        <Heading size='h3'>{feature.title}</Heading>
                        <Text className='text-tertiary'>{feature.description}</Text>
                      </Column>
                    </Column>
                  </BoxContent>
                </Box>
              ))}
            </div>
          </Column>
        </Container>
      </section>

      <section className='border-outline border-t py-8 md:py-10'>
        <Container>
          <div className='grid gap-8 lg:grid-cols-[0.8fr_1.2fr]'>
            <Column className='gap-2'>
              <Text className='text-tertiary'>{t('home.data_eyebrow')}</Text>
              <Heading size='h2'>{t('home.data_title')}</Heading>
              <Text className='text-tertiary text-lg'>{t('home.data_description')}</Text>
            </Column>

            <div className='grid gap-5 md:grid-cols-3'>
              {dataGroups.map((group) => (
                <Column className='gap-3' key={group.title}>
                  <Row className='gap-2 border-outline border-b pb-3'>
                    <span className='text-tertiary'>{group.icon}</span>
                    <Heading size='h3'>{group.title}</Heading>
                  </Row>

                  <Column className='gap-2'>
                    {group.items.map((item) => (
                      <Row className='gap-2' key={item}>
                        <CheckCircle2 className='size-4 text-tertiary' />
                        <Text className='text-tertiary'>{item}</Text>
                      </Row>
                    ))}
                  </Column>
                </Column>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className='border-outline border-t py-8 md:py-10'>
        <Container>
          <Column className='gap-5'>
            <Column className='gap-2'>
              <Text className='text-tertiary'>{t('home.flow_eyebrow')}</Text>
              <Heading size='h2'>{t('home.flow_title')}</Heading>
              <Text className='max-w-2xl text-tertiary text-lg'>{t('home.flow_description')}</Text>
            </Column>

            <div className='grid gap-5 md:grid-cols-3'>
              {flow.map((item) => (
                <Column className='gap-3 border-outline border-t pt-5' key={item.step}>
                  <Text className='text-tertiary'>{item.step}</Text>
                  <Column className='gap-2'>
                    <Heading size='h3'>{item.title}</Heading>
                    <Text className='text-tertiary'>{item.description}</Text>
                  </Column>
                </Column>
              ))}
            </div>
          </Column>
        </Container>
      </section>

      <section className='py-8 md:py-10'>
        <Container>
          <Box className='bg-surface-secondary'>
            <BoxContent padding='md'>
              <div className='grid items-center gap-6 md:grid-cols-[1fr_auto]'>
                <Column className='gap-2'>
                  <Heading size='h2'>{t('home.cta.title')}</Heading>
                  <Text className='max-w-2xl text-tertiary text-lg'>
                    {t('home.cta.description')}
                  </Text>
                </Column>

                <Row className='gap-3'>
                  <Link href='/auth/signup'>
                    <Button>{t('home.primary_cta')}</Button>
                  </Link>
                  <Link href='/auth/signin'>
                    <Button>{t('home.secondary_cta')}</Button>
                  </Link>
                </Row>
              </div>
            </BoxContent>
          </Box>
        </Container>
      </section>
    </main>
  )
}

export default Page

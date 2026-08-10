import type React from 'react'

import { getTranslations } from 'next-intl/server'
import { Link } from '@/lib/i18n/routing'
import { _public } from '@/lib/auth'
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Database,
  KeyRound,
  LockKeyhole,
  ShieldCheck,
  UserRound
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

  const principles = [
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
    }
  ]

  const responsibilities = [
    {
      number: '01',
      title: t('home.flow.create.title'),
      description: t('home.flow.create.description')
    },
    {
      number: '02',
      title: t('home.flow.review.title'),
      description: t('home.flow.review.description')
    },
    {
      number: '03',
      title: t('home.flow.control.title'),
      description: t('home.flow.control.description')
    }
  ]

  const data = [
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
    }
  ]

  return (
    <main className='overflow-hidden'>
      <section className='border-outline border-b'>
        <Container>
          <div className='grid min-h-[80vh] items-center gap-12 py-16 md:py-24 lg:grid-cols-[1.1fr_0.9fr]'>
            <Column className='gap-8'>
              <Column className='gap-5'>
                <Text className='text-content-tertiary'>{t('home.eyebrow')}</Text>

                <Heading
                  className='max-w-5xl text-5xl leading-[0.95] md:text-7xl lg:text-8xl'
                  size='h1'
                >
                  {t('home.title')}
                </Heading>

                <Text className='max-w-2xl text-content-tertiary text-xl md:text-2xl'>
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

            <Column className='relative'>
              <Box className='bg-surface-secondary'>
                <BoxContent padding='md'>
                  <Column className='gap-6'>
                    <Row className='items-center justify-between'>
                      <Column className='gap-1'>
                        <Text className='text-content-tertiary'>{t('home.preview.badge')}</Text>
                        <Heading size='h3'>{t('home.preview.title')}</Heading>
                      </Column>

                      <CheckCircle2 className='size-6 text-accent' />
                    </Row>

                    <Column className='gap-3'>
                      <Row className='items-center justify-between border-outline border-b pb-3'>
                        <Column className='gap-1'>
                          <Text>{t('permissions.user:read')}</Text>
                          <Text className='text-content-tertiary'>
                            {t('home.preview.permissions.account')}
                          </Text>
                        </Column>

                        <Text className='text-content-tertiary'>{t('home.preview.allowed')}</Text>
                      </Row>

                      <Row className='items-center justify-between border-outline border-b pb-3'>
                        <Column className='gap-1'>
                          <Text>{t('permissions.profile:update')}</Text>
                          <Text className='text-content-tertiary'>
                            {t('home.preview.permissions.profile')}
                          </Text>
                        </Column>

                        <Text className='text-content-tertiary'>{t('home.preview.review')}</Text>
                      </Row>

                      <Row className='items-center justify-between'>
                        <Column className='gap-1'>
                          <Text>{t('permissions.session:read')}</Text>
                          <Text className='text-content-tertiary'>
                            {t('home.preview.permissions.sessions')}
                          </Text>
                        </Column>

                        <Text className='text-content-tertiary'>{t('home.preview.allowed')}</Text>
                      </Row>
                    </Column>

                    <Row className='items-center gap-3 rounded-2xl border border-outline bg-surface-primary p-4'>
                      <div className='rounded-xl border border-outline p-2'>
                        <ShieldCheck className='size-5 text-content-tertiary' />
                      </div>

                      <Column className='gap-1'>
                        <Text>{t('home.preview.connection')}</Text>
                        <Text className='text-content-tertiary'>
                          {t('home.preview.description')}
                        </Text>
                      </Column>
                    </Row>
                  </Column>
                </BoxContent>
              </Box>
            </Column>
          </div>
        </Container>
      </section>

      <section className='py-20 md:py-28'>
        <Container>
          <div className='grid gap-12 lg:grid-cols-[0.7fr_1.3fr]'>
            <Column className='gap-4'>
              <Text className='text-content-tertiary'>{t('home.features_eyebrow')}</Text>

              <Heading className='max-w-xl text-4xl md:text-5xl' size='h2'>
                {t('home.features_title')}
              </Heading>

              <Text className='max-w-xl text-content-tertiary text-lg'>
                {t('home.features_description')}
              </Text>
            </Column>

            <div className='grid gap-px border border-outline bg-outline md:grid-cols-3'>
              {principles.map((principle) => (
                <Box className='rounded-none bg-surface-primary' key={principle.title}>
                  <BoxContent>
                    <Column className='min-h-64 justify-between gap-8'>
                      <div className='w-fit rounded-xl border border-outline p-3 text-content-tertiary'>
                        {principle.icon}
                      </div>

                      <Column className='gap-2'>
                        <Heading size='h3'>{principle.title}</Heading>
                        <Text className='text-content-tertiary'>{principle.description}</Text>
                      </Column>
                    </Column>
                  </BoxContent>
                </Box>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className='border-outline border-y bg-surface-secondary py-20 md:py-28'>
        <Container>
          <div className='grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20'>
            <Column className='gap-5'>
              <Text className='text-content-tertiary'>{t('home.data_eyebrow')}</Text>

              <Heading className='max-w-xl text-4xl md:text-5xl' size='h2'>
                {t('home.data_title')}
              </Heading>

              <Text className='max-w-xl text-content-tertiary text-lg'>
                {t('home.data_description')}
              </Text>
            </Column>

            <Column className='gap-8'>
              {data.map((group) => (
                <Column className='gap-4' key={group.title}>
                  <Row className='items-center gap-3'>
                    <div className='rounded-xl border border-outline bg-surface-primary p-2 text-content-tertiary'>
                      {group.icon}
                    </div>

                    <Heading size='h3'>{group.title}</Heading>
                  </Row>

                  <Column className='gap-2 pl-12'>
                    {group.items.map((item) => (
                      <Row className='items-center gap-2' key={item}>
                        <CheckCircle2 className='size-4 text-content-tertiary' />
                        <Text className='text-content-tertiary'>{item}</Text>
                      </Row>
                    ))}
                  </Column>
                </Column>
              ))}
            </Column>
          </div>
        </Container>
      </section>

      <section className='py-20 md:py-28'>
        <Container>
          <Column className='gap-12'>
            <div className='grid gap-5 lg:grid-cols-[1fr_1fr]'>
              <Column className='gap-4'>
                <Text className='text-content-tertiary'>{t('home.flow_eyebrow')}</Text>

                <Heading className='max-w-xl text-4xl md:text-5xl' size='h2'>
                  {t('home.flow_title')}
                </Heading>
              </Column>

              <Text className='max-w-xl self-end text-content-tertiary text-lg'>
                {t('home.flow_description')}
              </Text>
            </div>

            <div className='grid gap-8 border-outline border-t pt-8 md:grid-cols-3'>
              {responsibilities.map((item) => (
                <Column className='gap-6' key={item.number}>
                  <Text className='text-content-tertiary'>{item.number}</Text>

                  <Column className='gap-2'>
                    <Heading size='h3'>{item.title}</Heading>
                    <Text className='text-content-tertiary'>{item.description}</Text>
                  </Column>

                  <ChevronRight className='size-5 text-content-tertiary' />
                </Column>
              ))}
            </div>
          </Column>
        </Container>
      </section>

      <section className='pb-20 md:pb-28'>
        <Container>
          <Box className='bg-surface-secondary'>
            <BoxContent padding='md'>
              <div className='grid gap-8 md:grid-cols-[1fr_auto] md:items-end'>
                <Column className='gap-3'>
                  <Heading className='max-w-2xl text-4xl md:text-5xl' size='h2'>
                    {t('home.cta.title')}
                  </Heading>

                  <Text className='max-w-2xl text-content-tertiary text-lg'>
                    {t('home.cta.description')}
                  </Text>
                </Column>

                <Link href='/auth/signup'>
                  <Button>
                    <Row className='gap-2'>
                      {t('home.primary_cta')}
                      <ArrowRight className='size-4' />
                    </Row>
                  </Button>
                </Link>
              </div>
            </BoxContent>
          </Box>
        </Container>
      </section>
    </main>
  )
}

export default Page

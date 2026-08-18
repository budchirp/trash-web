import type React from 'react'

import { getTranslations } from 'next-intl/server'
import { Link } from '@/lib/i18n/routing'
import { LINKS } from '@/lib/link'
import { _public } from '@/lib/auth'

import { ArrowRight, CheckCircle2, Database, KeyRound, ShieldCheck, UserRound } from 'lucide-react'

import {
  Box,
  BoxContent,
  Section,
  Button,
  Column,
  Container,
  Heading,
  Row,
  Text,
  Divider,
  Tag,
  Grid
} from '@trash-kit/ui'

import type { DynamicPageProps } from '@/types/app/page'

type Translate = Awaited<ReturnType<typeof getTranslations>>

const Part: React.FC<{
  children: React.ReactNode
  eyebrow?: string
  title?: string
  description?: string
}> = ({ children, eyebrow, title, description }) => (
  <Column className='gap-8'>
    {(eyebrow || title || description) && (
      <Column className='max-w-2xl gap-4'>
        {eyebrow && <Tag>{eyebrow}</Tag>}

        <Column className='gap-2'>
          {title && (
            <Heading size='h1' className='tracking-tight sm:text-4xl md:text-5xl'>
              {title}
            </Heading>
          )}

          {description && <Text className='text-lg text-content-tertiary'>{description}</Text>}
        </Column>
      </Column>
    )}

    {children}
  </Column>
)

const IconBox: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Box className='w-fit shrink-0 rounded-xl'>
    <BoxContent padding='sm' className='text-content-tertiary *:size-6'>
      {children}
    </BoxContent>
  </Box>
)

const PermissionRow: React.FC<{
  label: string
  description: string
  status: string
}> = ({ label, description, status }) => (
  <Row className='items-center justify-between gap-4 border-outline border-b py-2 last:border-0'>
    <Column>
      <Heading size='h5'>{label}</Heading>
      <Text className='text-sm text-content-tertiary'>{description}</Text>
    </Column>

    <Text className='shrink-0 text-sm text-content-tertiary'>{status}</Text>
  </Row>
)

const PermissionPreview: React.FC<{ t: Translate }> = ({ t }) => (
  <Box color='secondary'>
    <BoxContent padding='md'>
      <Row className='items-center justify-between gap-4'>
        <Column>
          <Text className='text-content-tertiary'>{t('home.preview.badge')}</Text>
          <Heading size='h3'>{t('home.preview.title')}</Heading>
        </Column>

        <CheckCircle2 className='size-6 shrink-0 text-accent' />
      </Row>
    </BoxContent>

    <Divider />

    <BoxContent>
      <PermissionRow
        label={t('permissions.user:read')}
        description={t('home.preview.permissions.account')}
        status={t('home.preview.allowed')}
      />

      <PermissionRow
        label={t('permissions.profile:update')}
        description={t('home.preview.permissions.profile')}
        status={t('home.preview.review')}
      />

      <PermissionRow
        label={t('permissions.session:read')}
        description={t('home.preview.permissions.sessions')}
        status={t('home.preview.allowed')}
      />
    </BoxContent>

    <Divider />

    <BoxContent padding='md'>
      <Box className='rounded-2xl'>
        <BoxContent>
          <Row className='gap-3'>
            <IconBox>
              <ShieldCheck />
            </IconBox>

            <Column className='min-w-0'>
              <Text>{t('home.preview.connection')}</Text>

              <Text className='text-sm text-content-tertiary'>{t('home.preview.description')}</Text>
            </Column>
          </Row>
        </BoxContent>
      </Box>
    </BoxContent>
  </Box>
)

const Hero: React.FC<{ t: Translate }> = ({ t }) => (
  <Section className='min-h-screen_'>
    <Container>
      <div className='grid min-h-[72vh] items-center gap-12 py-16 md:py-24 lg:grid-cols-[1.1fr_0.9fr]'>
        <Column className='gap-8'>
          <Column className='gap-5'>
            <Tag>{t('home.eyebrow')}</Tag>

            <Heading
              size='h1'
              className='text-5xl leading-[0.9] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl'
            >
              {t('home.title')}
            </Heading>

            <Heading size='h4' className='text-lg text-content-tertiary sm:text-xl md:text-2xl'>
              {t('home.description')}
            </Heading>
          </Column>

          <Row className='flex-col items-start md:items-center gap-3 sm:flex-row'>
            <Link href={LINKS.auth.signUp}>
              <Button className='gap-2'>
                {t('home.primary_cta')}
                <ArrowRight className='size-4' />
              </Button>
            </Link>

            <Link href={LINKS.auth.signIn}>
              <Button>{t('home.secondary_cta')}</Button>
            </Link>
          </Row>
        </Column>

        <PermissionPreview t={t} />
      </div>
    </Container>
  </Section>
)

const Features: React.FC<{ t: Translate }> = ({ t }) => {
  const features = [
    [UserRound, t('home.features.profile.title'), t('home.features.profile.description')],
    [ShieldCheck, t('home.features.permissions.title'), t('home.features.permissions.description')],
    [KeyRound, t('home.features.sessions.title'), t('home.features.sessions.description')]
  ] as const

  return (
    <Section className='py-16'>
      <Container>
        <Part
          eyebrow={t('home.features_eyebrow')}
          title={t('home.features_title')}
          description={t('home.features_description')}
        >
          <Grid className='gap-4 md:grid-cols-3'>
            {features.map(([Icon, title, description]) => (
              <Box key={title} color='secondary'>
                <BoxContent padding='md'>
                  <Column className='gap-4'>
                    <IconBox>
                      <Icon />
                    </IconBox>

                    <Column>
                      <Heading size='h3'>{title}</Heading>
                      <Text className='text-content-tertiary'>{description}</Text>
                    </Column>
                  </Column>
                </BoxContent>
              </Box>
            ))}
          </Grid>
        </Part>
      </Container>
    </Section>
  )
}

const DataSection: React.FC<{ t: Translate }> = ({ t }) => {
  const groups = [
    [
      Database,
      t('home.data.profile.title'),
      [t('home.data.profile.name'), t('home.data.profile.gender'), t('home.data.profile.picture')]
    ],
    [
      ShieldCheck,
      t('home.data.security.title'),
      [
        t('home.data.security.sessions'),
        t('home.data.security.connections'),
        t('home.data.security.permissions')
      ]
    ]
  ] as const

  return (
    <Section className='py-16 bg-surface-secondary'>
      <Container>
        <Part
          eyebrow={t('home.data_eyebrow')}
          title={t('home.data_title')}
          description={t('home.data_description')}
        >
          <Row className='flex-col md:flex-row gap-8 justify-between'>
            {groups.map(([Icon, title, items]) => (
              <Column key={title} className='gap-4'>
                <Row className='items-start gap-3'>
                  <IconBox>
                    <Icon />
                  </IconBox>

                  <Column className='gap-2'>
                    <Heading size='h3'>{title}</Heading>

                    <Column className='gap-2'>
                      {items.map((item) => (
                        <Row key={item} className='items-center gap-2'>
                          <CheckCircle2 className='size-4 shrink-0 text-content-tertiary' />
                          <Text className='text-content-tertiary'>{item}</Text>
                        </Row>
                      ))}
                    </Column>
                  </Column>
                </Row>
              </Column>
            ))}
          </Row>
        </Part>
      </Container>
    </Section>
  )
}

const Cta: React.FC<{ t: Translate }> = ({ t }) => (
  <Section className='py-16'>
    <Container>
      <Part>
        <Box color='secondary' className='rounded-4xl'>
          <BoxContent className='px-12 py-12'>
            <Column className='gap-8'>
              <Column className='gap-2'>
                <Heading size='h1' className='tracking-tight'>
                  {t('home.cta.title')}
                </Heading>

                <Heading size='h4' className='text-lg text-content-tertiary'>
                  {t('home.cta.description')}
                </Heading>
              </Column>

              <Link href={LINKS.auth.signUp}>
                <Button>
                  <Row className='gap-2'>
                    {t('home.primary_cta')}
                    <ArrowRight className='size-4' />
                  </Row>
                </Button>
              </Link>
            </Column>
          </BoxContent>
        </Box>
      </Part>
    </Container>
  </Section>
)

const Page: React.FC<DynamicPageProps> = async ({ params }) => {
  const { locale } = await params

  await _public(locale)

  const t = await getTranslations({ locale })

  return (
    <Column>
      <Hero t={t} />

      <Divider />

      <Features t={t} />

      <Divider />

      <DataSection t={t} />

      <Divider />

      <Cta t={t} />
    </Column>
  )
}

export default Page

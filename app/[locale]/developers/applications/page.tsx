import type React from 'react'

import { getTranslations } from 'next-intl/server'
import { redirect } from 'next/navigation'

import { ApplicationIcon } from '@/components/app/developers/application-icon'
import { ServiceError } from '@/components/service-error'
import { _authenticate } from '@/lib/auth'
import { DateUtil } from '@/lib/date-util'
import { Link } from '@/lib/i18n/routing'
import { LINKS } from '@/lib/link'
import { getSignInPath } from '@/lib/redirects'
import { ApplicationService } from '@/service/application'

import {
  Box,
  BoxContent,
  Button,
  Column,
  Container,
  Grid,
  Heading,
  Row,
  Section,
  Text
} from '@trash-kit/ui'

import type { DynamicPageProps } from '@/types/app/page'

const Page: React.FC<DynamicPageProps> = async ({
  params
}: DynamicPageProps): Promise<React.ReactNode> => {
  const { locale } = await params
  const { jwt, user } = await _authenticate(locale, `/${locale}/developers/applications`)

  if (!user.profile?.dev) redirect(`/${locale}/developers`)

  const t = await getTranslations({ namespace: 'developers.applications', locale })
  const t_common = await getTranslations({ namespace: 'common', locale })

  const applications = await ApplicationService.getAll({ jwt, locale })
  if ((applications as any).status === 401) {
    redirect(getSignInPath(`/${locale}/developers/applications`))
  }

  return (
    <Section>
      <Container>
        <Section
          title={
            <Row className='justify-between gap-2'>
              <Heading size='h1'>{t('title')}</Heading>

              <Link href={LINKS.developers.newApplication}>
                <Button>{t_common('new')}</Button>
              </Link>
            </Row>
          }
        >
          {applications.error ? (
            <ServiceError message={applications.message} />
          ) : (
            <Grid className='gap-4'>
              {applications.data.length === 0 ? (
                <Text className='text-content-tertiary'>{t('empty')}</Text>
              ) : (
                applications.data.map((application) => (
                  <Box clickable key={application.id}>
                    <BoxContent>
                      <Row className='w-full gap-4'>
                        <ApplicationIcon application={application} />

                        <Column className='grow'>
                          <Heading size='h3'>{application.name}</Heading>
                          <Text className='text-content-tertiary'>{application.description}</Text>
                        </Column>
                      </Row>
                    </BoxContent>
                  </Box>
                ))
              )}
            </Grid>
          )}
        </Section>
      </Container>
    </Section>
  )
}

export default Page

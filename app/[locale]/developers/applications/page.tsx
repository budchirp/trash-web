import type React from 'react'

import { ApplicationIcon } from '@/components/app/developers/application-icon'
import { requireSession } from '@/lib/auth'
import { Link, redirect } from '@/lib/i18n/navigation'
import { getLocale, getTranslations } from 'next-intl/server'
import { withRedirect } from '@/lib/redirect'
import { ApplicationService } from '@/service/application'
import { LINKS } from '@/lib/link'

import {
  Alert,
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

const Page: React.FC = async (): Promise<React.ReactNode> => {
  const { token, user } = await requireSession(LINKS.developers.applications)

  if (!user.profile?.dev) {
    redirect({ href: LINKS.developers.root, locale: await getLocale() })
  }

  const t = await getTranslations('developers.applications')
  const t_common = await getTranslations('common')

  const applications = await ApplicationService.getAll(token)
  if (applications.error && applications.status === 401) {
    redirect({
      href: withRedirect(LINKS.auth.signIn, LINKS.developers.applications),
      locale: await getLocale()
    })
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
            <Alert color='danger' description={applications.message} />
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

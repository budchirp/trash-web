import type React from 'react'

import { ApplicationSummary } from '@/components/app/developers/applications/summary'
import { ApplicationActions } from '@/components/app/developers/applications/actions'
import { getDeveloperApplication } from '@/lib/developer-application'
import { format } from '@/lib/date'
import { Link } from '@/lib/i18n/navigation'
import { LINKS } from '@/lib/link'
import { getLocale, getTranslations } from 'next-intl/server'

import {
  Alert,
  Box,
  BoxContent,
  Button,
  Divider,
  Heading,
  Row,
  Section,
  Text
} from '@trash-kit/ui'

import type { DynamicPageProps } from '@/types/app/page'

const Page: React.FC<DynamicPageProps> = async ({
  params
}: DynamicPageProps): Promise<React.ReactNode> => {
  const { id } = await params

  const locale = await getLocale()
  const { token, application } = await getDeveloperApplication(id, LINKS.developers.application(id))

  const t = await getTranslations('developers.applications')
  const t_common = await getTranslations('common')

  return (
    <Section
      title={
        <Row className='justify-between gap-2'>
          <Heading size='h1'>{t('detail_title')}</Heading>

          <Link href={LINKS.developers.applications}>
            <Button color='secondary'>{t_common('back')}</Button>
          </Link>
        </Row>
      }
    >
      {application.error ? (
        <Alert color='danger' description={application.message} />
      ) : (
        <Box color='secondary'>
          <BoxContent>
            <ApplicationSummary application={application.data} />
            <ApplicationActions application={application.data} token={token} />
          </BoxContent>

          <Divider />

          <BoxContent>
            <Row className='gap-1'>
              <Heading size='h4'>{t('created_at')}:</Heading>
              <Text>{format(application.data.createdAt, locale)}</Text>
            </Row>
          </BoxContent>
        </Box>
      )}
    </Section>
  )
}

export default Page

import { getLocale, getTranslations } from 'next-intl/server'
import { Alert, Column, Heading, Row, Section, Text } from '@trash-kit/ui'
import { getDeveloperApplication } from '@/lib/developer-application'
import { format } from '@/lib/date'
import { ApplicationActions } from '@/components/app/developers/applications/application-actions'
import { LINKS } from '@/lib/link'
import type { DynamicPageProps } from '@/types/app/page'

export default async function Page({ params }: DynamicPageProps) {
  const { id } = await params
  const { token, application } = await getDeveloperApplication(id, LINKS.developers.application(id))
  const t = await getTranslations('developers.applications')
  const locale = await getLocale()

  if (application.error) {
    return (
      <Section title={t('detail_title')}>
        <Alert color='danger' description={application.message} />
      </Section>
    )
  }

  return (
    <Section
      title={
        <Row className='w-full items-start justify-between gap-4'>
          <Heading size='h1' className='min-w-0 break-words'>
            {application.data.name}
          </Heading>
          <div className='shrink-0'>
            <ApplicationActions application={application.data} token={token} />
          </div>
        </Row>
      }
      description={
        <Text className='whitespace-pre-wrap break-words text-content-tertiary'>
          {application.data.description}
        </Text>
      }
    >
      <Column className='gap-4'>
        <Column className='gap-1'>
          <Heading size='h4'>{t('application_id')}</Heading>
          <Text className='break-all font-mono text-sm text-content-tertiary'>
            {application.data.id}
          </Text>
        </Column>
        <Row className='flex-wrap gap-2'>
          <Heading size='h4'>{t('created_at')}:</Heading>
          <Text>{format(application.data.createdAt, locale)}</Text>
        </Row>
      </Column>
    </Section>
  )
}

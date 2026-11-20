import { getTranslations } from 'next-intl/server'

import { Alert, Section } from '@trash-kit/ui'
import { ApplicationView } from '@/components/app/developers/applications/application-view'
import { getDeveloperApplication } from '@/lib/developer-application'
import { LINKS } from '@/lib/link'

import type { DynamicPageProps } from '@/types/app/page'

export default async function Page({ params }: DynamicPageProps) {
  const { id } = await params
  const { token, application } = await getDeveloperApplication(id, LINKS.developers.application(id))
  const t = await getTranslations('developers.applications')

  if (application.error) {
    return (
      <Section title={t('detail_title')}>
        <Alert color='danger' description={application.message} />
      </Section>
    )
  }

  return <ApplicationView key={application.data.id} application={application.data} token={token} />
}

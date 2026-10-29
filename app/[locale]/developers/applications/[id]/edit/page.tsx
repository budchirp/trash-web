import { getTranslations } from 'next-intl/server'
import { Alert, Section } from '@trash-kit/ui'
import { ApplicationForm } from '@/components/app/developers/applications/form'
import { getDeveloperApplication } from '@/lib/developer-application'
import { LINKS } from '@/lib/link'
import type { DynamicPageProps } from '@/types/app/page'

export default async function Page({ params }: DynamicPageProps) {
  const { id } = await params
  const { token, application } = await getDeveloperApplication(id, LINKS.developers.editApplication(id))
  const t = await getTranslations('developers.applications')
  return (
    <Section title={t('edit_title')}>
      {application.error ? (
        <Alert color='danger' description={application.message} />
      ) : (
        <ApplicationForm token={token} application={application.data} />
      )}
    </Section>
  )
}

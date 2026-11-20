import { getTranslations } from 'next-intl/server'
import { Section } from '@trash-kit/ui'
import { ApplicationForm } from '@/components/app/developers/applications/application-form'
import { requireDeveloper } from '@/lib/auth'
import { LINKS } from '@/lib/link'

export default async function Page() {
  const { token } = await requireDeveloper(LINKS.developers.newApplication)
  const t = await getTranslations('developers.applications.new')

  return (
    <Section title={t('title')}>
      <ApplicationForm token={token} />
    </Section>
  )
}

import type React from 'react'

import { ApplicationList } from '@/components/app/developers/applications/list'
import { EnrollmentCard } from '@/components/app/developers/enrollment-card'
import { requireSession } from '@/lib/auth'
import { Link, redirect } from '@/lib/i18n/navigation'
import { LINKS } from '@/lib/link'
import { withRedirect } from '@/lib/redirect'
import { ApplicationService } from '@/service/application'
import { getLocale, getTranslations } from 'next-intl/server'

import { Alert, Button, Heading, Row, Section } from '@trash-kit/ui'

const Page: React.FC = async (): Promise<React.ReactNode> => {
  const { token, user } = await requireSession(LINKS.developers.applications)

  const t = await getTranslations('developers.applications')
  const t_common = await getTranslations('common')

  if (!user.profile?.dev) {
    return (
      <Section title={t('title')}>
        <EnrollmentCard token={token} />
      </Section>
    )
  }

  const applications = await ApplicationService.getAll(token)
  if (applications.error && applications.status === 401) {
    redirect({
      href: withRedirect(LINKS.auth.signIn, LINKS.developers.applications),
      locale: await getLocale()
    })
  }

  return (
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
        <ApplicationList applications={applications.data} empty={t('empty')} />
      )}
    </Section>
  )
}

export default Page

import { getLocale, getTranslations } from 'next-intl/server'
import { Alert, Box, BoxContent, Column, Heading, Section, Text } from '@trash-kit/ui'
import { EnrollmentCard } from '@/components/app/developers/enrollment-card'
import { requireSession } from '@/lib/auth'
import { LINKS } from '@/lib/link'
import { redirect } from '@/lib/i18n/navigation'
import { withRedirect } from '@/lib/redirect'
import { ApplicationService } from '@/service/application'

export default async function Page() {
  const { token, user } = await requireSession(LINKS.developers.overview)
  const t = await getTranslations('developers.overview')
  const applications = user.profile?.dev ? await ApplicationService.getAll(token) : null
  if (applications?.error && applications.status === 401) {
    redirect({
      href: withRedirect(LINKS.auth.signIn, LINKS.developers.overview),
      locale: await getLocale()
    })
  }

  return (
    <Section title={t('title')}>
      <Column className='gap-4'>
        <Box color='secondary'>
          <BoxContent>
            <Heading size='h3'>{user.profile?.name?.trim() || user.username}</Heading>
            <Text>@{user.username}</Text>
            <Text className='text-content-tertiary'>{user.email}</Text>
            {!applications?.error && (
              <Text>{t('application_count', { count: applications?.data.length ?? 0 })}</Text>
            )}
          </BoxContent>
        </Box>
        {applications?.error && <Alert color='danger' description={applications.message} />}
        {!user.profile?.dev && <EnrollmentCard token={token} />}
      </Column>
    </Section>
  )
}

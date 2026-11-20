import type { ReactNode } from 'react'
import { Boxes } from 'lucide-react'
import { Box, BoxContent, Column, Grid, Heading, Row, Text, cn } from '@trash-kit/ui'
import { Link } from '@/lib/i18n/navigation'
import { LINKS } from '@/lib/link'
import type { Application } from '@/types/api/application'

type ApplicationPreview = Pick<Application, 'icon' | 'name' | 'description'>

export const ApplicationImage = ({
  application,
  large = false
}: {
  application: Pick<Application, 'icon' | 'name'>
  large?: boolean
}) => (
  <div
    className={cn(
      'flex shrink-0 items-center justify-center overflow-hidden border border-outline bg-surface-primary',
      large ? 'size-16 rounded-2xl' : 'size-12 rounded-full'
    )}
  >
    {application.icon ? (
      <img src={application.icon.url} alt={application.name} className='size-full object-cover' />
    ) : (
      <Boxes
        aria-hidden='true'
        className={cn('text-content-tertiary', large ? 'size-7' : 'size-6')}
      />
    )}
  </div>
)

export const ApplicationSummary = ({
  application,
  children
}: {
  application: ApplicationPreview
  children?: ReactNode
}) => (
  <Row className='w-full min-w-0 flex-wrap items-center gap-3'>
    <ApplicationImage application={application} />
    <Column className='min-w-0 flex-1 gap-0'>
      <Heading size='h3' className='break-words'>
        {application.name}
      </Heading>
      <Text className='break-words text-content-tertiary'>{application.description}</Text>
    </Column>
    {children && <div className='w-full shrink-0 sm:w-auto'>{children}</div>}
  </Row>
)

export const ApplicationCard = ({
  application,
  actions,
  children
}: {
  application: ApplicationPreview
  actions?: ReactNode
  children?: ReactNode
}) => (
  <Box color='secondary'>
    <BoxContent>
      <ApplicationSummary application={application}>{actions}</ApplicationSummary>
    </BoxContent>
    {children}
  </Box>
)

export const ApplicationList = ({
  applications,
  empty
}: {
  applications: Application[]
  empty: string
}) => {
  if (applications.length === 0) {
    return (
      <Box color='secondary'>
        <BoxContent className='py-12'>
          <Column className='items-center gap-4 text-center'>
            <Boxes className='size-10 text-content-tertiary' />
            <Text className='text-content-tertiary'>{empty}</Text>
          </Column>
        </BoxContent>
      </Box>
    )
  }

  return (
    <Grid className='grid-cols-1 gap-4 xl:grid-cols-2'>
      {applications.map((application) => (
        <Link href={LINKS.developers.application(application.id)} key={application.id}>
          <Box clickable className='h-full'>
            <BoxContent>
              <ApplicationSummary application={application} />
            </BoxContent>
          </Box>
        </Link>
      ))}
    </Grid>
  )
}

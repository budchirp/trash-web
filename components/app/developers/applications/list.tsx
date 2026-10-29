import type React from 'react'

import { ApplicationSummary } from './summary'
import { Link } from '@/lib/i18n/navigation'
import { LINKS } from '@/lib/link'

import { Box, BoxContent, Grid, Text } from '@trash-kit/ui'

import type { Application } from '@/types/api/application'

type ApplicationListProps = {
  applications: Application[]

  empty: string
}

export const ApplicationList: React.FC<ApplicationListProps> = ({
  applications,
  empty
}: ApplicationListProps): React.ReactNode => {
  if (applications.length === 0) {
    return <Text className='text-content-tertiary'>{empty}</Text>
  }

  return (
    <Grid className='gap-4'>
      {applications.map((application) => (
        <Link href={LINKS.developers.application(application.id)} key={application.id}>
          <Box clickable>
            <BoxContent>
              <ApplicationSummary application={application} />
            </BoxContent>
          </Box>
        </Link>
      ))}
    </Grid>
  )
}

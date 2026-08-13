import type React from 'react'

import { Box, BoxContent, Text } from '@trash-kit/ui'

type ServiceErrorProps = {
  message: string
}

export const ServiceError: React.FC<ServiceErrorProps> = ({
  message
}: ServiceErrorProps): React.ReactNode => (
  <Box color='secondary'>
    <BoxContent>
      <Text>{message}</Text>
    </BoxContent>
  </Box>
)

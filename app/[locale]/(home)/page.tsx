import type React from 'react'

import { getCookies } from 'next-client-cookies/server'
import { authenticatedRoute } from '@/lib/auth'
import { CONSTANTS } from '@/lib/constants'

import { Box, BoxContent, Column, Container, Section, Text } from '@trash-kit/ui'

const Page: React.FC = async (): Promise<React.ReactNode> => {
  const cookies = await getCookies()
  const token = cookies.get(CONSTANTS.COOKIES.TOKEN)

  const user = await authenticatedRoute(token)

  return (
    <Column padding='md'>
      <Container>
        <Section title='User'>
          <Box>
            <BoxContent>
              <Text>{JSON.stringify(user)}</Text>
            </BoxContent>
          </Box>
        </Section>
      </Container>
    </Column>
  )
}

export default Page

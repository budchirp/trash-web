import type React from 'react'

import type { getTranslations } from 'next-intl/server'

import { Box, BoxContent, Column, Container, Heading, Section, Tag, Text } from '@trash-kit/ui'

type Translate = Awaited<ReturnType<typeof getTranslations>>

type LegalSection = {
  title: string
  body: string
}

type LegalPageProps = {
  t: Translate
  scope: 'legal.terms' | 'legal.privacy'
}

export const LegalPage: React.FC<LegalPageProps> = ({
  t,
  scope
}: LegalPageProps): React.ReactNode => {
  const sections = t.raw(`${scope}.sections`) as LegalSection[]

  return (
    <Section className='py-16'>
      <Container className='max-w-3xl'>
        <Column className='gap-10'>
          <Column className='gap-4'>
            <Tag>{t(`${scope}.last_updated`)}</Tag>

            <Column className='gap-2'>
              <Heading size='h1'>{t(`${scope}.title`)}</Heading>
              <Text className='text-lg text-content-tertiary'>{t(`${scope}.description`)}</Text>
            </Column>
          </Column>

          <Column className='gap-4'>
            {sections.map((section) => (
              <Box key={section.title}>
                <BoxContent>
                  <Column className='gap-2'>
                    <Heading size='h3'>{section.title}</Heading>
                    <Text className='text-content-tertiary'>{section.body}</Text>
                  </Column>
                </BoxContent>
              </Box>
            ))}
          </Column>
        </Column>
      </Container>
    </Section>
  )
}

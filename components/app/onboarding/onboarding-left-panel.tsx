'use client'

import type React from 'react'

import { Box, BoxContent, Center, Column, Container, Heading, Row, Text, cn } from '@trash-kit/ui'

type OnboardingStepSummary = {
  id: string
  label: string
}

type OnboardingLeftPanelProps = {
  title: string
  description: string
  steps: OnboardingStepSummary[]
  activeStep: number
}

export const OnboardingLeftPanel: React.FC<OnboardingLeftPanelProps> = ({
  title,
  description,
  steps,
  activeStep
}: OnboardingLeftPanelProps): React.ReactNode => {
  return (
    <section className='flex items-center size-full py-8 lg:px-4 bg-surface-primary border-outline border-b lg:border-r lg:border-b-0'>
      <Container className='flex justify-center lg:justify-end'>
        <Column className='gap-4 max-w-sm'>
          <Column className='gap-2'>
            <Heading size='h1'>{title}</Heading>
            <Heading size='h4' className='text-tertiary'>{description}</Heading>
          </Column>

          <Column className='hidden gap-2 lg:flex'>
            {steps.map((step, index) => (
              <Box
                className={cn(
                  'transition-none flex flex-row gap-2',
                  activeStep === index && 'border-accent-700/50 bg-accent-500/10'
                )}
                key={step.id}
              >
                <Center className={cn("aspect-square border-r p-2 ", activeStep === index ? "border-accent-700/50" : "border-outline")}>
                  <Text className={activeStep === index ? 'font-bold text-primary' : 'text-tertiary'}>{String(index + 1).padStart(2, '0')}</Text>
                </Center>

                <BoxContent padding="none" className='flex-row items-center h-full py-2'>
                  <Text className={activeStep === index ? 'font-bold text-primary' : 'text-tertiary'}>
                    {step.label}
                  </Text>
                </BoxContent>
              </Box>
            ))}
          </Column>
        </Column>
      </Container>
    </section>
  )
}

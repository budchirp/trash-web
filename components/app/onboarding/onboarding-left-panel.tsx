'use client'

import type React from 'react'

import {
  Box,
  BoxContent,
  Button,
  Center,
  Column,
  Container,
  Heading,
  Text,
  cn
} from '@trash-kit/ui'
import { ArrowLeft } from 'lucide-react'
import { useTranslations } from 'next-intl'

type StepRenderProps = {
  next: () => void
  back: () => void
  isLast: boolean
}

export type OnboardingStep = {
  id: string
  title: string
  description?: string
  render: (props: StepRenderProps) => React.ReactNode
}

type OnboardingLeftPanelProps = {
  steps: OnboardingStep[]
  active: number
  onBack?: () => void
}

export const OnboardingLeftPanel: React.FC<OnboardingLeftPanelProps> = ({
  steps,
  active,
  onBack
}: OnboardingLeftPanelProps): React.ReactNode => {
  const t = useTranslations('common')

  const step = steps[active]!

  return (
    <section className='flex items-center size-full py-8 lg:px-4 bg-surface-primary border-outline border-b lg:border-r lg:border-b-0'>
      <Container className='flex justify-center lg:justify-end'>
        <Column className='gap-4 max-w-sm w-full'>
          {onBack && (
            <Button type='button' color='secondary' className='w-fit' onClick={onBack}>
              <ArrowLeft className='size-4' />
              {t('back')}
            </Button>
          )}

          <Column className='gap-2'>
            <Heading size='h1'>{step.title}</Heading>
            <Heading size='h4' className='text-content-tertiary'>
              {step.description}
            </Heading>
          </Column>

          {steps.length > 1 && (
            <Column className='hidden gap-2 lg:flex'>
              {steps.map((step, index) => (
                <Box
                  className={cn(
                    'transition-none flex flex-row gap-2',
                    active === index && 'border-accent-700/50 bg-accent-500/10'
                  )}
                  key={step.id}
                >
                  <Center
                    className={cn(
                      'aspect-square border-r p-2',
                      active === index ? 'border-accent-700/50' : 'border-outline'
                    )}
                  >
                    <Text
                      className={
                        active === index
                          ? 'font-bold text-content-primary'
                          : 'text-content-tertiary'
                      }
                    >
                      {String(index + 1).padStart(2, '0')}
                    </Text>
                  </Center>

                  <BoxContent padding='none' className='flex-row items-center h-full py-2'>
                    <Text
                      className={
                        active === index
                          ? 'font-bold text-content-primary'
                          : 'text-content-tertiary'
                      }
                    >
                      {step.title}
                    </Text>
                  </BoxContent>
                </Box>
              ))}
            </Column>
          )}
        </Column>
      </Container>
    </section>
  )
}

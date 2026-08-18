'use client'

import type React from 'react'
import { useState } from 'react'

import { Avatar } from '@/components/app/user/avatar'
import {
  OnboardingLeftPanel,
  type OnboardingStep
} from '@/components/app/onboarding/onboarding-left-panel'
import { OnboardingRightPanel } from '@/components/app/onboarding/onboarding-right-panel'
import { ProfileForm } from '@/components/app/user/profile/profile-form'
import { useLogout } from '@/lib/hooks/use-logout'
import { LINKS } from '@/lib/link'
import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'

import { Column } from '@trash-kit/ui'

type OnboardingClientPageProps = {
  jwt: string
  redirectTo: string | null
}

export const OnboardingClientPage = ({
  jwt,
  redirectTo
}: OnboardingClientPageProps): React.ReactNode => {
  const locale = useLocale()
  const router = useRouter()
  const logout = useLogout()

  const t = useTranslations('profile')
  const tCommon = useTranslations('common')

  const [step, setStep] = useState(0)

  const handleFinish = () => {
    window.location.replace(redirectTo ?? `/${locale}${LINKS.dashboard}`)
  }

  const next = () => {
    if (step < steps.length - 1) {
      setStep((current) => current + 1)
    } else {
      handleFinish()
    }
  }

  const back = () => {
    setStep((current) => Math.max(current - 1, 0))
  }

  const handleBack = () => {
    if (step > 0) {
      back()
    } else if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back()
    } else {
      void logout()
    }
  }

  const steps: OnboardingStep[] = [
    {
      id: 'profile',
      title: t('setup_title'),
      description: t('setup_description'),
      render: ({ isLast, next }) => (
        <Column className='gap-8 items-center w-full'>
          <Avatar jwt={jwt} className='size-32 md:size-40' />

          <div className='w-full'>
            <ProfileForm
              jwt={jwt}
              submitLabel={isLast ? tCommon('submit') : tCommon('next')}
              onSuccess={() => {
                next()
              }}
            />
          </div>
        </Column>
      )
    }
  ]

  const activeStep = steps[step] ?? steps[0]
  const isLastStep = step === steps.length - 1

  return (
    <div className='relative isolate grid h-screen_ grid-rows-[auto_1fr] lg:grid-cols-2 lg:grid-rows-1'>
      <OnboardingLeftPanel steps={steps} active={step} onBack={handleBack} />

      <OnboardingRightPanel>
        {activeStep.render({ next, back, isLast: isLastStep })}
      </OnboardingRightPanel>
    </div>
  )
}

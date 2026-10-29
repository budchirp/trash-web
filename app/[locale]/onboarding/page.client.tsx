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
import { LogoutDialog } from '@/components/dialogs/logout-dialog'
import { LINKS } from '@/lib/link'
import { useRouter } from '@/lib/i18n/navigation'
import { useTranslations } from 'next-intl'

import { Column } from '@trash-kit/ui'

type OnboardingClientPageProps = {
  token: string
  redirectTo: string | null
}

export const OnboardingClientPage = ({
  token,
  redirectTo
}: OnboardingClientPageProps): React.ReactNode => {
  const router = useRouter()
  const [confirmLogout, setConfirmLogout] = useState(false)

  const t = useTranslations('profile')
  const tCommon = useTranslations('common')

  const [step, setStep] = useState(0)

  const handleFinish = () => {
    window.location.replace(redirectTo ?? LINKS.dashboard)
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
      setConfirmLogout(true)
    }
  }

  const steps: OnboardingStep[] = [
    {
      id: 'profile',
      title: t('setup_title'),
      description: t('setup_description'),
      render: ({ isLast, next }) => (
        <Column className='gap-8 items-center w-full'>
          <Avatar token={token} className='size-32 md:size-40' />

          <div className='w-full'>
            <ProfileForm
              token={token}
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
    <div className='relative isolate grid h-screen grid-rows-[auto_1fr] lg:grid-cols-2 lg:grid-rows-1'>
      <OnboardingLeftPanel steps={steps} active={step} onBack={handleBack} />

      <OnboardingRightPanel>
        {activeStep.render({ next, back, isLast: isLastStep })}
      </OnboardingRightPanel>
      <LogoutDialog open={confirmLogout} onClose={() => setConfirmLogout(false)} />
    </div>
  )
}

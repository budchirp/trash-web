'use client'

import type React from 'react'
import { useEffect, useState } from 'react'

import { profileSchema, type ProfileInputValues, type ProfileValues } from '@/service/user/schema'
import { OnboardingRightPanel } from '@/components/app/onboarding/onboarding-right-panel'
import { OnboardingLeftPanel } from '@/components/app/onboarding/onboarding-left-panel'
import { IdentityStep } from '@/components/app/onboarding/steps/identity-step'
import { PictureStep } from '@/components/app/onboarding/steps/picture-step'
import { zodResolver } from '@hookform/resolvers/zod'
import { UserService } from '@/service/user'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { toast } from '@trash-kit/ui'

import type { User } from '@/types/api/user'

type OnboardingClientPageProps = {
  jwt: string
  locale: string
  user: User
  redirectTo: string | null
}

type StepField = 'name' | 'gender' | 'picture'

type StepRenderProps = {
  next: () => void
  back: () => void
}

type OnboardingStep = {
  id: string
  label: string
  fields?: StepField[]
  render: (props: StepRenderProps) => React.ReactNode
}

export const OnboardingClientPage: React.FC<OnboardingClientPageProps> = ({
  jwt,
  locale,
  user,
  redirectTo
}: OnboardingClientPageProps): React.ReactNode => {
  const t = useTranslations('profile')

  const [step, setStep] = useState(0)

  const [file, setFile] = useState<File | null>(null)
  const [picture, setPicture] = useState<string | null>(user.profile?.picture || null)

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors, isSubmitting }
  } = useForm<ProfileInputValues, unknown, ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.profile?.name ?? '',
      gender: user.profile?.gender ?? '',
      picture: user.profile?.picture ?? ''
    }
  })

  useEffect(() => {
    if (!file || !file.type.startsWith('image/')) {
      setPicture(null)
      return
    }

    const url = URL.createObjectURL(file)
    setPicture(url)

    return () => URL.revokeObjectURL(url)
  }, [file])

  const submitProfile = async (values: ProfileValues) => {
    const profile = await UserService.updateProfile(values, { jwt, locale })
    if (profile.error) {
      toast(profile.message)
      return
    }

    window.location.replace(redirectTo ?? `/${locale}/dashboard`)
  }

  const steps: OnboardingStep[] = [
    {
      id: 'identity',
      label: t('identity_step'),
      fields: ['name', 'gender'],
      render: ({ next }) => (
        <IdentityStep
          onNext={next}
          register={register}
          errors={errors}
        />
      )
    },
    {
      id: 'picture',
      label: t('picture_step'),
      render: ({ back }) => (
        <PictureStep
          onBack={back}
          src={picture}
          alt={file?.name ?? user.profile?.name ?? user.username}
          file={file}
          isSubmitting={isSubmitting}
          onFileChange={setFile}
        />
      )
    }
  ]

  const activeStep = steps[step] ?? steps[0]
  const isLastStep = step === steps.length - 1

  const next = async () => {
    const valid = activeStep.fields ? await trigger(activeStep.fields) : true
    if (valid) setStep((current) => Math.min(current + 1, steps.length - 1))
  }

  const back = () => setStep((current) => Math.max(current - 1, 0))

  return (
    <form
      className='h-screen_ w-full'
      onSubmit={
        isLastStep
          ? handleSubmit(submitProfile)
          : (event) => {
              event.preventDefault()
              void next()
            }
      }
    >
      <div className='relative isolate grid h-full grid-rows-[25fr_75fr] lg:grid-cols-2 lg:grid-rows-1'>
        <OnboardingLeftPanel
          title={t('setup_title')}
          description={t('setup_description')}
          steps={steps}
          activeStep={step}
        />

        <OnboardingRightPanel>
          {activeStep.render({ next: next, back: back })}
        </OnboardingRightPanel>
      </div>
    </form>
  )
}

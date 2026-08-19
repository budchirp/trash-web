'use client'

import type React from 'react'
import { useState } from 'react'

import { FileUtil } from '@/lib/file-util'
import { handle } from '@/lib/handle-service'
import { useObjectUrl } from '@/lib/hooks/use-object-url'
import { LINKS } from '@/lib/link'
import { ApplicationService } from '@/service/application'
import { applicationSchema, type ApplicationValues } from '@/service/application/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Check, Loader2, Trash2 } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'

import {
  Button,
  Column,
  DragAndDropFileField,
  Field,
  Input,
  Label,
  Row,
  Text,
  cn,
  toast
} from '@trash-kit/ui'

type ApplicationFormProps = {
  jwt: string
}

type SubmitStep = 'idle' | 'creating' | 'uploading'

const NAME_MAX_LENGTH = 100
const DESCRIPTION_MAX_LENGTH = 500
const REDIRECT_DELAY = 1500

type StepItemProps = {
  label: string
  active?: boolean
  done?: boolean
}

const StepItem: React.FC<StepItemProps> = ({
  label,
  active = false,
  done = false
}: StepItemProps): React.ReactNode => (
  <Row className='gap-2'>
    {done ? (
      <Check className='size-4 text-content-tertiary' />
    ) : active ? (
      <Loader2 className='size-4 animate-spin' />
    ) : (
      <span aria-hidden='true' className='size-4 rounded-full border-2 border-outline' />
    )}
    <Text className={cn('text-sm', !active && !done && 'text-content-tertiary')}>{label}</Text>
  </Row>
)

export const ApplicationForm: React.FC<ApplicationFormProps> = ({
  jwt
}: ApplicationFormProps): React.ReactNode => {
  const locale = useLocale()

  const t = useTranslations('developers.applications.new')
  const t_common = useTranslations('common')

  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<ApplicationValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: { name: '', description: '' }
  })

  const name = watch('name')
  const description = watch('description')

  const [iconFile, setIconFile] = useState<File | null>(null)
  const [iconError, setIconError] = useState<string | null>(null)
  const { url: iconPreview, setFile: setIconPreview } = useObjectUrl()

  const [step, setStep] = useState<SubmitStep>('idle')
  const [progress, setProgress] = useState<number | null>(null)
  const [isRedirecting, setIsRedirecting] = useState(false)

  const isPending = isSubmitting || isRedirecting

  const redirectToApplications = () => {
    window.location.replace(`/${locale}${LINKS.developers.applications}`)
  }

  const selectIcon = (file: File | null) => {
    setIconError(null)

    if (!file) {
      setIconFile(null)
      setIconPreview(null)
      return
    }

    const validation = FileUtil.validatePicture(file)
    if (!validation.valid) {
      setIconError(
        validation.error === 'too_large' ? t('errors.too_large') : t('errors.invalid_type')
      )
      return
    }

    setIconFile(file)
    setIconPreview(file)
  }

  const removeIcon = () => {
    setIconFile(null)
    setIconPreview(null)
    setIconError(null)
  }

  const onSubmit = async (values: ApplicationValues) => {
    setStep('creating')

    const created = await ApplicationService.create(values, { jwt, locale })

    if (created.error) {
      setStep('idle')

      if (created.code === 'developer_program_required') {
        window.location.replace(`/${locale}${LINKS.developers.root}`)
        return
      }

      if (created.details) {
        let mapped = false
        for (const [field, message] of Object.entries(created.details)) {
          if (field === 'name' || field === 'description') {
            setError(field, { message })
            mapped = true
          }
        }
        if (mapped) return
      }

      handle(created)
      return
    }

    if (iconFile) {
      setStep('uploading')
      setProgress(0)

      const uploaded = await ApplicationService.uploadIcon(
        created.data.id,
        iconFile,
        { jwt, locale },
        setProgress
      )

      setProgress(null)

      if (uploaded.error) {
        toast(`${t('icon_failed')} ${uploaded.message}`)
        setStep('idle')
        setIsRedirecting(true)
        setTimeout(redirectToApplications, REDIRECT_DELAY)
        return
      }
    }

    redirectToApplications()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Column className='gap-4'>
        <Column className='gap-2'>
          <Field name='name' error={errors.name?.message}>
            <Row className='w-full justify-between'>
              <Label>{t('name')}:</Label>
              <Text className='text-sm tabular-nums text-content-tertiary'>
                {name.length}/{NAME_MAX_LENGTH}
              </Text>
            </Row>
            <Input
              maxLength={NAME_MAX_LENGTH}
              placeholder={t_common('enter_field', { field: t('name') })}
              disabled={isPending}
              {...register('name')}
            />
          </Field>

          <Field name='description' error={errors.description?.message}>
            <Row className='w-full justify-between'>
              <Label htmlFor='description'>{t('description_field')}:</Label>
              <Text className='text-sm tabular-nums text-content-tertiary'>
                {description.length}/{DESCRIPTION_MAX_LENGTH}
              </Text>
            </Row>
            <textarea
              id='description'
              rows={4}
              maxLength={DESCRIPTION_MAX_LENGTH}
              placeholder={t_common('enter_field', { field: t('description_field') })}
              className='w-full min-h-24 resize-y rounded-3xl border border-outline bg-surface-primary px-4 py-2.5 text-content-primary transition duration-300 placeholder:text-content-tertiary hover:border-outline-hover focus:border-outline-hover focus:outline-none disabled:cursor-not-allowed disabled:opacity-50'
              disabled={isPending}
              {...register('description')}
            />
          </Field>

          <Field name='icon' error={iconError ?? undefined}>
            <Label htmlFor='icon'>{t('icon')}:</Label>
            {iconFile && iconPreview ? (
              <Row className='w-full gap-4'>
                <div className='size-24 shrink-0 overflow-hidden rounded-3xl border border-outline bg-surface-secondary'>
                  <img src={iconPreview} alt={iconFile.name} className='size-full object-cover' />
                </div>
                <Column className='grow'>
                  <Text>{iconFile.name}</Text>
                  <Text className='text-sm text-content-tertiary'>
                    {FileUtil.formatSize(iconFile.size)}
                  </Text>
                </Column>
                <Button color='secondary' disabled={isPending} onClick={removeIcon} type='button'>
                  <Trash2 className='size-4' />
                  {t_common('delete')}
                </Button>
              </Row>
            ) : (
              <DragAndDropFileField
                accept={FileUtil.ALLOWED_IMAGE_TYPES.join(',')}
                aria-label={t('icon')}
                description={t('dropzone_description')}
                disabled={isPending}
                onFiles={(files) => selectIcon(files[0] ?? null)}
              >
                {t('choose_icon')}
              </DragAndDropFileField>
            )}
          </Field>
        </Column>

        {isSubmitting && (
          <Row aria-live='polite' className='w-full gap-4'>
            <StepItem
              active={step === 'creating'}
              done={step === 'uploading'}
              label={t('steps.creating')}
            />
            {iconFile && <StepItem active={step === 'uploading'} label={t('steps.uploading')} />}
            {step === 'uploading' && progress != null && (
              <Text className='text-sm tabular-nums text-content-tertiary'>{progress}%</Text>
            )}
          </Row>
        )}

        <Row className='w-full justify-end'>
          <Button disabled={isPending} loading={isSubmitting} type='submit'>
            {isPending ? t_common('loading') : t_common('submit')}
          </Button>
        </Row>
      </Column>
    </form>
  )
}

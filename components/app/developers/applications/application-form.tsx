'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Column, DragAndDropFileField, Field, Input, Label, Row, Text } from '@trash-kit/ui'
import { ConfirmationDialog } from '@/components/dialogs/confirmation-dialog'
import { IMAGE_TYPES, validate } from '@/lib/file'
import { handle } from '@/lib/handle'
import { useObjectUrl } from '@/lib/hooks/use-object-url'
import { LINKS } from '@/lib/link'
import { ApplicationService } from '@/service/application'
import { applicationSchema, type ApplicationValues } from '@/service/application/schema'
import type { Application } from '@/types/api/application'
import { ApplicationImage } from './application'

export const ApplicationForm = ({
  token,
  application
}: {
  token: string
  application?: Application
}) => {
  const t = useTranslations('developers.applications')
  const common = useTranslations('common')
  const router = useRouter()
  const generation = useRef(0)
  const activeApplication = useRef(application?.id)
  const removingIcon = useRef(false)
  const [savedApplication, setSavedApplication] = useState(application)
  const [iconFile, setIconFile] = useState<File | null>(null)
  const [iconError, setIconError] = useState<string | null>(null)
  const [isRemovingIcon, setIsRemovingIcon] = useState(false)
  const [confirmRemoveIcon, setConfirmRemoveIcon] = useState(false)
  const { url: preview, setFile: setPreview } = useObjectUrl()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting }
  } = useForm<ApplicationValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: { name: application?.name ?? '', description: application?.description ?? '' }
  })
  const isPending = isSubmitting || isRemovingIcon

  useEffect(
    () => () => {
      generation.current++
      if (activeApplication.current)
        ApplicationService.cancelIconUpload(activeApplication.current, token)
    },
    [token]
  )

  const clearSelection = () => {
    setIconFile(null)
    setPreview(null)
    setIconError(null)
  }

  const selectIcon = (file: File | null) => {
    if (!file || isPending) return
    const invalid = validate(file)
    if (invalid) {
      setIconError(t(`new.errors.${invalid}`))
      return
    }
    setIconError(null)
    setIconFile(file)
    setPreview(file)
  }

  const removeIcon = async () => {
    if (!savedApplication || isSubmitting || removingIcon.current) return false
    const current = ++generation.current
    removingIcon.current = true
    setIsRemovingIcon(true)
    clearSelection()
    const response = await ApplicationService.deleteIcon(savedApplication.id, token)
    if (current !== generation.current) return false
    removingIcon.current = false
    setIsRemovingIcon(false)
    if (handle(response, setIconError)) return false
    setSavedApplication((previous) => (previous ? { ...previous, icon: null } : previous))
    router.refresh()
    return true
  }

  const onSubmit = async (values: ApplicationValues) => {
    if (removingIcon.current) return
    const current = ++generation.current
    const response = savedApplication
      ? await ApplicationService.update(savedApplication.id, values, token)
      : await ApplicationService.create(values, token)
    if (current !== generation.current) return
    if (response.error) {
      if (response.code === 'developer_program_required') {
        window.location.replace(LINKS.developers.root)
        return
      }
      if (response.details) {
        let mapped = false
        for (const [field, message] of Object.entries(response.details)) {
          if (field === 'name' || field === 'description') {
            setError(field, { message })
            mapped = true
          }
        }
        if (mapped) return
      }
      handle(response)
      return
    }
    activeApplication.current = response.data.id
    // Retain the created resource if its logo upload needs a retry.
    setSavedApplication(response.data)
    if (iconFile) {
      setIconError(null)
      const uploaded = await ApplicationService.uploadIcon(response.data.id, iconFile, token)
      if (current !== generation.current) return
      if (uploaded.error && uploaded.code === 'image_upload_cancelled') return
      if (handle(uploaded, setIconError)) return
      setSavedApplication({ ...response.data, icon: uploaded.data })
      clearSelection()
    }
    window.location.replace(LINKS.developers.application(response.data.id))
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Column className='gap-2'>
        <Field name='icon' error={iconError ?? undefined}>
          <Label htmlFor='icon'>{t('new.icon')}:</Label>
          <Column className='w-full gap-6'>
            {savedApplication?.icon && (
              <Row className='w-fit shrink-0 gap-2'>
                <ApplicationImage application={savedApplication} large />
                <Button
                  type='button'
                  shape='circle'
                  className='size-8 p-0'
                  color='secondary'
                  aria-label={t('delete_icon')}
                  title={t('delete_icon')}
                  disabled={isPending}
                  loading={isRemovingIcon}
                  onClick={() => setConfirmRemoveIcon(true)}
                >
                  <Trash2 className='size-4' />
                </Button>
              </Row>
            )}
            <div className='w-full min-w-0'>
              {iconFile && preview ? (
                <Row className='w-full gap-3'>
                  <img
                    src={preview}
                    alt={iconFile.name}
                    className='size-16 shrink-0 rounded-2xl border border-outline object-cover'
                  />
                  <Text className='min-w-0 grow break-all'>{iconFile.name}</Text>
                  <Button
                    type='button'
                    shape='circle'
                    className='size-8 p-0'
                    color='secondary'
                    aria-label={common('cancel')}
                    title={common('cancel')}
                    disabled={isPending}
                    onClick={clearSelection}
                  >
                    <X className='size-4' />
                  </Button>
                </Row>
              ) : (
                <DragAndDropFileField
                  accept={IMAGE_TYPES.join(',')}
                  aria-label={t('new.icon')}
                  description={null}
                  className='block w-full'
                  contentClassName='[&>div]:p-3 [&>div>div]:flex-row [&>div>div]:items-center [&>div>div]:gap-2 [&_svg]:size-6'
                  disabled={isPending}
                  onFiles={(files) => selectIcon(files[0] ?? null)}
                >
                  {t('new.choose_icon')}
                </DragAndDropFileField>
              )}
            </div>
          </Column>
        </Field>
        <Field name='name' error={errors.name?.message}>
          <Label>{t('new.name')}:</Label>
          <Input
            maxLength={100}
            placeholder={common('enter_field', { field: t('new.name') })}
            disabled={isPending}
            {...register('name')}
          />
        </Field>
        <Field name='description' error={errors.description?.message}>
          <Label htmlFor='description'>{t('new.description_field')}:</Label>
          <textarea
            id='description'
            rows={3}
            maxLength={500}
            placeholder={common('enter_field', { field: t('new.description_field') })}
            className='w-full min-h-24 resize-y rounded-3xl border border-outline bg-surface-primary px-4 py-2.5 text-content-primary transition duration-300 placeholder:text-content-tertiary hover:border-outline-hover focus:border-outline-hover focus:outline-none disabled:cursor-not-allowed disabled:opacity-50'
            disabled={isPending}
            {...register('description')}
          />
        </Field>
        <Row className='w-full justify-end'>
          <Button disabled={isPending} loading={isSubmitting} type='submit'>
            {iconError && iconFile ? common('retry') : common(savedApplication ? 'save' : 'submit')}
          </Button>
        </Row>
      </Column>
      <ConfirmationDialog
        open={confirmRemoveIcon}
        onClose={() => setConfirmRemoveIcon(false)}
        onConfirm={removeIcon}
        title={t('delete_icon')}
        description={t('delete_icon_description')}
        confirmLabel={common('delete')}
      />
    </form>
  )
}

'use client'

import { useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'

import { Button, Column, Heading, Row, Section, Text, toast } from '@trash-kit/ui'
import { ConfirmationDialog } from '@/components/dialogs/confirmation-dialog'
import { DetailsTable } from '@/components/ui/details-table'
import { format } from '@/lib/date'
import { handle } from '@/lib/handle'
import { Link, useRouter } from '@/lib/i18n/navigation'
import { LINKS } from '@/lib/link'
import { ApplicationService } from '@/service/application'

import type { Application } from '@/types/api/application'

type ApplicationViewProps = {
  application: Application
  token: string
}

export const ApplicationView = ({ application, token }: ApplicationViewProps) => {
  const t = useTranslations('developers.applications')
  const common = useTranslations('common')
  const locale = useLocale()
  const router = useRouter()

  const [confirmDelete, setConfirmDelete] = useState(false)

  const remove = async () => {
    const response = await ApplicationService.delete(application.id, token)

    if (handle(response)) return false

    toast(t('deleted'))

    router.replace(LINKS.developers.applications)
    router.refresh()

    return true
  }

  return (
    <Section
      title={
        <Row className='w-full items-start justify-between gap-4'>
          <Heading size='h1' className='min-w-0 break-words'>
            {application.name}
          </Heading>

          <Row className='w-fit shrink-0 flex-wrap gap-2'>
            <Button type='button' color='danger' onClick={() => setConfirmDelete(true)}>
              {common('delete')}
            </Button>

            <Link href={LINKS.developers.editApplication(application.id)}>
              <Button>{common('edit')}</Button>
            </Link>
          </Row>
        </Row>
      }
    >
      <Column className='gap-4'>
        <Text className='whitespace-pre-wrap break-words text-content-tertiary'>
          {application.description}
        </Text>

        <DetailsTable
          rows={[
            {
              label: t('application_id'),
              value: <code className='break-all text-sm'>{application.id}</code>
            },
            {
              label: t('created_at'),
              value: format(application.createdAt, locale)
            }
          ]}
        />
      </Column>

      <ConfirmationDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={remove}
        title={t('delete_title')}
        description={t('delete_description', { name: application.name })}
        confirmLabel={common('delete')}
      />
    </Section>
  )
}

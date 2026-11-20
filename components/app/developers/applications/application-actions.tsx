'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Button, Row, toast } from '@trash-kit/ui'
import { ConfirmationDialog } from '@/components/dialogs/confirmation-dialog'
import { handle } from '@/lib/handle'
import { Link, useRouter } from '@/lib/i18n/navigation'
import { LINKS } from '@/lib/link'
import { ApplicationService } from '@/service/application'
import type { Application } from '@/types/api/application'

export const ApplicationActions = ({
  application,
  token
}: {
  application: Application
  token: string
}) => {
  const t = useTranslations('developers.applications')
  const common = useTranslations('common')
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
    <Row className='w-fit flex-wrap gap-4'>
      <Button type='button' color='danger' onClick={() => setConfirmDelete(true)}>
        {common('delete')}
      </Button>
      <Link href={LINKS.developers.editApplication(application.id)}>
        <Button>{common('edit')}</Button>
      </Link>
      <ConfirmationDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={remove}
        title={t('delete_title')}
        description={t('delete_description', { name: application.name })}
        confirmLabel={common('delete')}
      />
    </Row>
  )
}

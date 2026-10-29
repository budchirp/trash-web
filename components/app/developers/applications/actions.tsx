'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Button, Row, toast } from '@trash-kit/ui'
import { ConfirmationDialog } from '@/components/dialogs/confirmation-dialog'
import { Link, useRouter } from '@/lib/i18n/navigation'
import { LINKS } from '@/lib/link'
import { handle } from '@/lib/handle'
import { ApplicationService } from '@/service/application'
import type { Application } from '@/types/api/application'

type ApplicationActionsProps = {
  application: Application
  token: string
}

export const ApplicationActions = ({ application, token }: ApplicationActionsProps) => {
  const t = useTranslations('developers.applications')
  const common = useTranslations('common')
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const remove = async () => {
    const response = await ApplicationService.delete(application.id, token)
    if (handle(response)) return false
    toast(t('deleted'))
    router.replace(LINKS.developers.applications)
    router.refresh()
    return true
  }

  return (
    <Row className='gap-2 mt-4'>
      <Link href={LINKS.developers.editApplication(application.id)}>
        <Button>{common('edit')}</Button>
      </Link>
      <Button color='danger' onClick={() => setOpen(true)}>{common('delete')}</Button>
      <ConfirmationDialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={remove}
        title={t('delete_title')}
        description={t('delete_description', { name: application.name })}
        confirmLabel={common('delete')}
      />
    </Row>
  )
}
